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

// Calculate remaining time to appointment
function getRemainingTime(dateStr, timeStr) {
    if (!dateStr) return null;

    try {
        const [d, m, y] = dateStr.split('-').map(Number);
        let h = 0, min = 0;

        if (timeStr) {
            const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
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

        const appointmentTime = new Date(y, m - 1, d, h, min).getTime();
        const now = Date.now();
        const diff = appointmentTime - now;

        if (diff <= 0) return null; // Already passed

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes, totalMs: diff };
    } catch (e) {
        return null;
    }
}

// Format remaining time for display
function formatRemainingTime(remaining) {
    if (!remaining) return '';

    const { days, hours, minutes, totalMs } = remaining;

    // Less than 1 hour
    if (totalMs < 60 * 60 * 1000) {
        return `${minutes}m left`;
    }

    // Less than 24 hours
    if (days === 0) {
        if (hours === 1) return `1h ${minutes}m left`;
        return `${hours}h ${minutes}m left`;
    }

    // 1-7 days
    if (days === 1) {
        return `1 day ${hours}h left`;
    }

    if (days <= 7) {
        return `${days} days left`;
    }

    // More than a week
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    if (weeks === 1) {
        if (remainingDays > 0) return `1 week ${remainingDays}d left`;
        return `1 week left`;
    }

    return `${weeks} weeks left`;
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
            else if (status === 'completed') { statusColor = '#2c3e50'; displayStatus = 'Completed'; }
            else if (status === 'cancelled' || status === 'declined') { statusColor = '#e74c3c'; displayStatus = 'Cancelled'; }

            // ... (rest of render logic remains same)
            let bookedOnStr = '';
            let relativeTime = '';
            if (data.createdAt) {
                try {
                    const createdDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    const now = new Date();
                    const diffMs = now - createdDate;
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMins / 60);
                    const diffDays = Math.floor(diffHours / 24);

                    if (diffMins < 60) relativeTime = `(${diffMins}m ago)`;
                    else if (diffHours < 24) relativeTime = `(${diffHours}h ago)`;
                    else relativeTime = `(${diffDays}d ago)`;

                    const dateIdx = createdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    const timeIdx = createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    bookedOnStr = `${dateIdx}, ${timeIdx}`;
                } catch (e) { }
            }

            // Calculate remaining time for confirmed bookings
            let remainingTimeHtml = '';
            if (status === 'confirmed') {
                const remaining = getRemainingTime(data.date, data.time);
                if (remaining) {
                    const remainingText = formatRemainingTime(remaining);
                    let urgencyClass = 'remaining-time-normal';
                    if (remaining.days === 0 && remaining.hours < 2) urgencyClass = 'remaining-time-urgent';
                    else if (remaining.days === 0) urgencyClass = 'remaining-time-soon';

                    remainingTimeHtml = `<div class="remaining-time-badge ${urgencyClass}">${remainingText}</div>`;
                }
            }

            return `
            <div class="booking-card upcoming-card" data-status="${status}">
                <div class="booking-card-top-header">
                    <span class="booking-ref-number">REF: ${doc.id.slice(0, 8).toUpperCase()}</span>
                    <div class="booking-status-badge ${status}" style="background: ${statusColor}; color:white;">${displayStatus}</div>
                </div>

                <div class="booking-main-content">
                    <div class="appointment-header-row">
                        <span class="appointment-label-mini">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            APPOINTMENT
                        </span>
                    </div>
                    
                    <div class="booking-time-row">
                        <div class="unified-timing">
                            ${dateStr} <span class="timing-dot">•</span> ${timeStr}
                        </div>
                        <div class="remaining-time-wrapper">
                            ${remainingTimeHtml}
                        </div>
                    </div>

                    <div class="booking-services-section">
                        <p class="section-title-small">SERVICES</p>
                        <div class="booking-service-tags">
                            ${(data.servicesList || serviceName.split(',')).map((s, index) => {
                const colors = [{ bg: '#2c3e50', text: '#ffffff' }, { bg: '#8e44ad', text: '#ffffff' }, { bg: '#27ae60', text: '#ffffff' }, { bg: '#d35400', text: '#ffffff' }, { bg: '#c0392b', text: '#ffffff' }, { bg: '#2980b9', text: '#ffffff' }, { bg: '#16a085', text: '#ffffff' }, { bg: '#2c2c2c', text: '#d4af37' }];
                const colorIndex = (s.length + index) % colors.length;
                const palette = colors[colorIndex];
                return `<span class="service-tag-chip" style="background:${palette.bg}; color:${palette.text};">${s.trim()}</span>`;
            }).join('')}
                        </div>
                        <p class="booking-premium-label">✨ Premium Service</p>
                    </div>
                </div>

                <div class="booking-footer-grid">
                    <div class="footer-info-box full-width">
                        <div class="box-header">
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            BOOKED ON
                        </div>
                        <div class="box-value">${bookedOnStr} <span class="relative-time">${relativeTime}</span></div>
                    </div>

                    <div class="footer-info-box full-width">
                        <div class="box-header">
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            SPECIAL REQUEST
                        </div>
                        <div class="box-value note-value">${data.notes || 'None'}</div>
                    </div>
                </div>

                <div class="booking-location-bar">
                    <div class="location-content">
                        <span class="loc-pin">📍</span>
                        <div class="loc-text">
                            <span class="salon-name">Blancbeu Salon</span>
                            <span class="salon-addr">4th Floor, Victory Mall, Upper Bazar</span>
                        </div>
                    </div>
                    ${status === 'confirmed' ? `
                        <a href="tel:+919229915277" class="footer-call-btn">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.25-2.25a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                        </a>
                    ` : ''}
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
