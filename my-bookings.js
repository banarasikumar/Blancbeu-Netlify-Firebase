import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Filter State (Global to module)
let currentBookingFilter = 'all';

// Expose filter setter globally
window.setBookingFilter = function (filter) {
    currentBookingFilter = filter;
    loadBookings(); // Re-render
}

function formatDate(dateString) {
    if (!dateString) return 'Date TBD';
    if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 2 && parts[2].length === 4) {
            const [day, month, year] = parts;
            const date = new Date(`${year}-${month}-${day}`);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(timeString) {
    if (!timeString) return '';
    if (timeString.match(/AM|PM/i)) return timeString;
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = minutes ? minutes : '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
}

// Filter UI Helper
function renderFilterChips(counts) {
    const filters = [
        { id: 'all', label: 'All' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'pending', label: 'Pending' },
        { id: 'completed', label: 'Completed' },
        { id: 'previous', label: 'Previous' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    return `
    <div class="booking-filter-container">
        ${filters.map(f => `
            <button class="filter-chip ${currentBookingFilter === f.id ? 'active' : ''}"
                    onclick="window.setBookingFilter('${f.id}')">
                ${f.label} <span class="chip-count">${counts[f.id] || 0}</span>
            </button>
        `).join('')}
    </div>`;
}

export async function loadBookings() {
    const listContainer = document.querySelector('.bookings-list');
    const container = document.getElementById('bookingsListContainer') || listContainer;

    if (!container) return;

    const user = auth.currentUser;
    if (!user) {
        container.innerHTML = `
            <div style="text-align:center; padding: 40px 20px;">
                <h3 style="color:var(--text-primary);">Please Login</h3>
                <button onclick="document.dispatchEvent(new Event('open-login-modal'))" class="book-now-btn">Login Now</button>
            </div>`;
        return;
    }

    // Don't show full loading spinner on filter change if content exists, but for simplicity we do.
    // Actually, preserving existing chips if possible would be nice, but re-rendering all is safer for state sync.
    container.innerHTML = '<div style="text-align:center; padding:40px;"><div class="loading-spinner"></div><p>Loading...</p></div>';

    try {
        const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = `
                <div class="empty-state-bookings" style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 80px; margin-bottom: 20px;">📅</div>
                    <h2 style="color: var(--text-primary); margin-bottom: 10px; font-size: 24px;">No Bookings Yet</h2>
                    <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">Schedule your first beauty appointment!</p>
                </div>`;
            return;
        }

        let bookings = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        // --- COUNT CALCULATION ---
        const now = new Date();
        const counts = {
            all: bookings.length,
            upcoming: 0,
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0
        };

        bookings.forEach(b => {
            let bTimestamp = 0;
            if (b.date) {
                try {
                    const [d, m, y] = b.date.split('-').map(Number);
                    let h = 0, min = 0;
                    if (b.time) {
                        const timeParts = b.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                        if (timeParts) {
                            h = parseInt(timeParts[1], 10);
                            if (timeParts[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
                            if (timeParts[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
                            min = parseInt(timeParts[2], 10);
                        }
                    }
                    bTimestamp = new Date(y, m - 1, d, h, min).getTime();
                } catch (e) { }
            }

            const isFuture = bTimestamp >= now.getTime();

            // Count logic
            if (b.status === 'pending') counts.pending++;
            if (b.status === 'confirmed') counts.confirmed++;
            if (b.status === 'completed') counts.completed++;
            if (b.status === 'cancelled' || b.status === 'declined') counts.cancelled++;

            // Upcoming (Future + Active)
            if (isFuture && b.status !== 'cancelled' && b.status !== 'declined' && b.status !== 'completed') {
                counts.upcoming++;
            }

            // Previous (Past OR Completed/Cancelled)
            if (!isFuture || b.status === 'completed' || b.status === 'cancelled' || b.status === 'declined') {
                counts.previous = (counts.previous || 0) + 1;
            }
        });

        let html = renderFilterChips(counts); // Pass counts here

        // Sort descending
        bookings.sort((a, b) => {
            const getTimestamp = (booking) => {
                if (!booking.date) return 0;
                try {
                    const [d, m, y] = booking.date.split('-').map(Number);
                    let h = 0, min = 0;
                    if (booking.time) {
                        const timeParts = booking.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                        if (timeParts) {
                            h = parseInt(timeParts[1], 10);
                            min = parseInt(timeParts[2], 10);
                            const ampm = timeParts[3];
                            if (ampm) {
                                if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
                                if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
                            }
                        }
                    }
                    return new Date(y, m - 1, d, h, min).getTime();
                } catch (e) { return 0; }
            };
            return getTimestamp(b) - getTimestamp(a);
        });

        // Helper to Render Card
        const renderCard = (data) => {
            const doc = { id: data.id };
            const serviceName = data.service || 'General Service';
            const dateStr = formatDate(data.date);
            const timeStr = formatTime(data.time);
            const status = data.status || 'pending';
            let statusColor = '#f39c12';
            let displayStatus = 'Pending';

            if (status === 'confirmed') { statusColor = '#27ae60'; displayStatus = 'Confirmed'; }
            else if (status === 'completed') { statusColor = '#7f8c8d'; displayStatus = 'Completed'; }
            else if (status === 'cancelled' || status === 'declined') { statusColor = '#e74c3c'; displayStatus = 'Cancelled'; }

            // ... (rest of render logic remains same)
            let bookedOnStr = '';
            if (data.createdAt) {
                try {
                    const createdDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    const dateIdx = createdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    const timeIdx = createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    bookedOnStr = `Placed on: ${dateIdx}, ${timeIdx}`;
                } catch (e) { }
            }

            return `
            <div class="booking-card upcoming-card" data-status="${status}">
                <div class="booking-status-badge" style="background: ${statusColor}; color:white;">${displayStatus}</div>
                <div class="booking-header-row">
                    <div class="booking-service-info">
                        <div class="booking-service-tags">
                            ${(data.servicesList || serviceName.split(',')).map((s, index) => {
                const colors = ['#e3f2fd', '#f3e5f5', '#e8f5e9', '#fff3e0', '#fce4ec', '#fff8e1', '#e0f2f1', '#f1f8e9'];
                const textColors = ['#1565c0', '#7b1fa2', '#2e7d32', '#ef6c00', '#c2185b', '#f57f17', '#00695c', '#33691e'];
                const colorIndex = (s.length + index) % colors.length;
                return `<span class="service-tag-chip" style="background:${colors[colorIndex]}; color:${textColors[colorIndex]};">${s.trim()}</span>`;
            }).join('')}
                    </div>
                    <p class="booking-beautician" style="opacity:0.7; font-size:0.9em; margin-top:8px;">Premium Service</p>
                </div>
                <div class="booking-time-block">
                    <div class="booking-time">${dateStr}</div>
                    <div class="booking-time-detail">${timeStr}</div>
                </div>
            </div>
            <div class="booking-details">
                <span class="detail-item" style="font-family:monospace; background:rgba(0,0,0,0.03); padding:2px 6px; border-radius:4px;">Ref: ${doc.id.slice(0, 8).toUpperCase()}</span>
                ${bookedOnStr ? `<span class="detail-item" style="display:inline-block; margin-left:10px; font-size: 11px; opacity: 0.6;">🕒 ${bookedOnStr}</span>` : ''}
                ${data.notes ? `<span class="detail-item" style="max-width:100%; display:block; margin-top:5px;">📝 "${data.notes}"</span>` : ''}
            </div>
            <div class="booking-location">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:16px;">📍</span>
                    <div>
                        <div style="font-weight:700; color:var(--text-primary); line-height:1.2;">Blancbeu Salon</div>
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:3px; opacity:0.9;">4th Floor, Victory Mall, Upper Bazar</div>
                    </div>
                </div>
            </div>
        </div>`;
        };

        // --- FILTERING & RENDERING LOGIC ---
        // const now = new Date(); // Already declared above

        // Filter Array
        let filteredBookings = bookings;
        if (currentBookingFilter !== 'all') {
            if (currentBookingFilter === 'upcoming') {
                filteredBookings = bookings.filter(b => {
                    // Logic for upcoming: Future time AND not cancelled/completed
                    let bTimestamp = 0;
                    if (b.date) {
                        try {
                            const [d, m, y] = b.date.split('-').map(Number);
                            let h = 0, min = 0;
                            if (b.time) {
                                const timeParts = b.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                                if (timeParts) {
                                    h = parseInt(timeParts[1], 10);
                                    if (timeParts[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
                                    if (timeParts[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
                                    min = parseInt(timeParts[2], 10);
                                }
                            }
                            bTimestamp = new Date(y, m - 1, d, h, min).getTime();
                        } catch (e) { }
                    }
                    return bTimestamp >= now.getTime() && b.status !== 'cancelled' && b.status !== 'declined' && b.status !== 'completed';
                });
            } else if (currentBookingFilter === 'previous') {
                filteredBookings = bookings.filter(b => {
                    let bTimestamp = 0;
                    if (b.date) {
                        try {
                            const [d, m, y] = b.date.split('-').map(Number);
                            let h = 0, min = 0;
                            if (b.time) {
                                const timeParts = b.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                                if (timeParts) {
                                    h = parseInt(timeParts[1], 10);
                                    if (timeParts[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
                                    if (timeParts[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
                                    min = parseInt(timeParts[2], 10);
                                }
                            }
                            bTimestamp = new Date(y, m - 1, d, h, min).getTime();
                        } catch (e) { }
                    }
                    return bTimestamp < now.getTime() || b.status === 'completed' || b.status === 'cancelled' || b.status === 'declined';
                });
            } else {
                // Status based filters
                filteredBookings = bookings.filter(b => b.status === currentBookingFilter || (currentBookingFilter === 'cancelled' && b.status === 'declined'));
            }
        }

        // Render split sections ONLY if filter is 'all'
        if (currentBookingFilter === 'all') {
            const ongoing = [];
            const previous = [];

            bookings.forEach(b => {
                let bTimestamp = 0;
                if (b.date) {
                    try {
                        const [d, m, y] = b.date.split('-').map(Number);
                        let h = 0, min = 0;
                        if (b.time) {
                            const timeParts = b.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                            if (timeParts) {
                                h = parseInt(timeParts[1], 10);
                                if (timeParts[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
                                if (timeParts[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
                                min = parseInt(timeParts[2], 10);
                            }
                        }
                        bTimestamp = new Date(y, m - 1, d, h, min).getTime();
                    } catch (e) { }
                }

                if (b.status === 'cancelled' || b.status === 'declined' || b.status === 'completed') {
                    previous.push(b);
                } else if (bTimestamp < now.getTime()) {
                    previous.push(b);
                } else {
                    ongoing.push(b);
                }
            });

            // Upcoming
            html += `<div class="booking-section">
                <div class="section-divider"><span class="booking-section-label">📅 Upcoming Appointments</span></div>`;
            if (ongoing.length > 0) {
                html += ongoing.map(renderCard).join('');
            } else {
                html += `
                <div class="empty-upcoming-card" style="text-align:center; padding: 30px 20px; background:rgba(0,0,0,0.02); border-radius:16px; border:1px dashed rgba(212, 175, 55, 0.3);">
                    <p style="color:var(--text-secondary); margin-bottom:15px; font-size:14px;">You have no upcoming appointments.</p>
                    <button onclick="window.navigateToPage('booking')" style="background:linear-gradient(135deg, var(--gold-24k), var(--gold-bright)); color:black; border:none; padding:10px 20px; border-radius:30px; font-weight:bold; cursor:pointer; box-shadow:0 4px 15px rgba(212, 175, 55, 0.2); transition:transform 0.2s;">
                        Book New Appointment ✨
                    </button>
                </div>`;
            }
            html += `</div>`;

            // Previous
            if (previous.length > 0) {
                html += `<div class="booking-section" style="margin-top: 30px;">
                    <div class="section-divider"><span class="booking-section-label" style="opacity: 0.8;">📜 Previous Appointments</span></div>
                    <div style="opacity: 0.85;">
                        ${previous.map(renderCard).join('')}
                    </div>
                </div>`;
            }

        } else {
            // Specific Filter View (Flat List)
            html += `<div class="booking-section" style="margin-top:10px;">`;
            if (filteredBookings.length > 0) {
                html += filteredBookings.map(renderCard).join('');
            } else {
                html += `<div style="text-align:center; padding:40px; color:var(--text-secondary);">No ${currentBookingFilter} appointments found.</div>`;
            }
            html += `</div>`;
        }

        container.innerHTML = html;

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = `<p style="text-align:center; color:red;">Error: ${error.message}</p>`;
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) loadBookings();
    else {
        const c = document.getElementById('bookingsListContainer');
        if (c) c.innerHTML = '<p style="text-align:center; padding:40px;">Please login.</p>';
    }
});
window.refreshBookings = loadBookings;
