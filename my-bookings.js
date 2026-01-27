import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function formatDate(dateString) {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = minutes ? minutes : '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
}

export async function loadBookings() {
    const listContainer = document.querySelector('.bookings-list'); // Use the class which is cleaner
    // Or specifically the ID we added:
    const container = document.getElementById('bookingsListContainer') || listContainer;

    if (!container) {
        console.warn("Bookings container not found in DOM.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        container.innerHTML = `
            <div style="text-align:center; padding: 40px 20px;">
                <h3 style="color:var(--text-primary);">Please Login</h3>
                <p style="color:var(--text-secondary); margin-bottom:20px;">You need to be logged in to view your appointments.</p>
                <button onclick="document.dispatchEvent(new Event('open-login-modal'))" class="book-now-btn">Login Now</button>
            </div>`;
        return;
    }

    container.innerHTML = '<div style="text-align:center; padding:40px;"><div class="loading-spinner"></div><p>Loading appointments...</p></div>';

    try {
        const q = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid)
            // orderBy("date", "desc") // Commented out to avoid index issues for now
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = `
                <div class="empty-state-bookings" style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 80px; margin-bottom: 20px;">📅</div>
                    <h2 style="color: var(--text-primary); margin-bottom: 10px; font-size: 24px;">No Bookings Yet</h2>
                    <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">Schedule your first beauty appointment today!</p>
                </div>`;
            return;
        }

        let html = '';

        // Group into UPCOMING and COMPLETED (simple client-side filter)
        // For now, let's put everything in one list or just "Upcoming" since they are new.

        html += `<div class="booking-section"><div class="section-divider"><span class="section-label">📅 Your Appointments</span></div>`;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const serviceName = data.service || 'General Service';
            const dateStr = formatDate(data.date);
            const timeStr = formatTime(data.time);
            const status = data.status || 'pending';
            let statusColor = '#f39c12'; // Default Orange for Pending
            let displayStatus = 'Pending';

            if (status === 'confirmed') {
                statusColor = '#27ae60'; // Green
                displayStatus = 'Confirmed';
            } else if (status === 'completed') {
                statusColor = '#7f8c8d'; // Grey
                displayStatus = 'Completed';
            }

            html += `
            <div class="booking-card upcoming-card" data-status="${status}">
                <div class="booking-status-badge" style="background: ${statusColor}; color:white;">${displayStatus}</div>
                <div class="booking-header-row">
                    <div class="booking-service-info">
                        <div class="booking-service-tags">
                            ${(data.servicesList || serviceName.split(',')).map((s, index) => {
                // Generate a deterministic pastel color based on string
                const colors = ['#e3f2fd', '#f3e5f5', '#e8f5e9', '#fff3e0', '#fce4ec', '#fff8e1', '#e0f2f1', '#f1f8e9'];
                const textColors = ['#1565c0', '#7b1fa2', '#2e7d32', '#ef6c00', '#c2185b', '#f57f17', '#00695c', '#33691e'];
                const colorIndex = (s.length + index) % colors.length;
                return `<span class="service-tag-chip" style="background:${colors[colorIndex]}; color:${textColors[colorIndex]};">${s.trim()}</span>`;
            }).join('')}
                        </div>
                        <p class="booking-beautician" style="opacity:0.7; font-size:0.9em; margin-top:8px;">Blancbeu Redirection</p>
                    </div>
                    <div class="booking-time-block">
                        <div class="booking-time">${dateStr}</div>
                        <div class="booking-time-detail">${timeStr}</div>
                    </div>
                </div>
                <div class="booking-details">
                    <span class="detail-item">#${doc.id.slice(0, 8).toUpperCase()}</span>
                    ${data.notes ? `<span class="detail-item" style="max-width:100%; display:block; margin-top:5px;">📝 "${data.notes}"</span>` : ''}
                </div>
                <div class="booking-location">
                    📍 Blancbeu Salon
                </div>
            </div>`;
        });

        html += `</div>`; // Close section
        container.innerHTML = html;

    } catch (error) {
        console.error("Error fetching bookings:", error);
        container.innerHTML = `<p style="text-align:center; color:red;">Error loading bookings: ${error.message}</p>`;
    }
}

// Auto-load on auth state change
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadBookings();
    } else {
        const container = document.getElementById('bookingsListContainer');
        if (container) container.innerHTML = '<p style="text-align:center; padding:40px;">Please login to view bookings.</p>';
    }
});

// Expose to window for manual reloads if needed
window.refreshBookings = loadBookings;
