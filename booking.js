import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { openLoginModal } from './auth.js'; // Import openLoginModal

// DOM Elements
const bookingModal = document.getElementById('bookingModal');
const closeBookingModalBtn = document.getElementById('closeBookingModal');
const bookingForm = document.getElementById('bookingForm');
const serviceSelect = document.getElementById('bookingService');

// --- Services Data (Temporary, mirroring what's likely on the site) ---
const services = [
    { id: 'hair-cut', name: 'Premium Haircut & Style' },
    { id: 'facial', name: 'Facial & Skincare' },
    { id: 'makeup', name: 'Makeup & Bridal' },
    { id: 'threading', name: 'Threading & Waxing' },
    // Add more as needed
];

// Populate Select Options
function populateServices() {
    if (serviceSelect && serviceSelect.options.length === 1) { // Only if empty (except default)
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.name; // Storing name for simplicity now
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    }
}
populateServices();


// --- Event Listeners ---

// Close Booking Modal
if (closeBookingModalBtn) {
    closeBookingModalBtn.addEventListener('click', () => {
        bookingModal.style.display = 'none';
        bookingForm.reset();
    });
}

// Handle "Book Now" buttons globally
// We use event delegation or attach to specific classes
document.addEventListener('click', (e) => {
    // Check if clicked element is a Book Now button (or close to it)
    if (e.target.closest('.service-btn') || e.target.closest('.hero-btn.primary-btn') || e.target.closest('.service-page-book-btn')) { // Adjust selectors as needed
        e.preventDefault(); // Prevent default anchor behavior

        const user = auth.currentUser;
        if (!user) {
            alert("Please login to book an appointment.");
            openLoginModal('openBookingModal');
        } else {
            // Optional: Pre-select service if clicked from a specific card
            // For now, just open the modal
            bookingModal.style.display = 'block';
        }
    }
});


// Submit Booking
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Booking form submitted!"); // CRITICAL DEBUG LOG

        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in.");
            bookingModal.style.display = 'none';
            openLoginModal('openBookingModal');
            return;
        }

        const service = document.getElementById('bookingService').value;
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const notes = document.getElementById('bookingNotes').value;

        console.log("Submission Data:", { service, date, time, notes, userEmail: user.email }); // DEBUG LOG

        try {
            await addDoc(collection(db, "bookings"), {
                userId: user.uid,
                userName: user.displayName || "Anonymous",
                userEmail: user.email,
                service: service,
                date: date,
                time: time,
                notes: notes,
                status: 'pending', // pending, confirmed, completed, cancelled
                createdAt: serverTimestamp()
            });

            console.log("Firestore write successful!"); // DEBUG LOG

            alert("Booking request sent! We will contact you shortly to confirm.");
            bookingModal.style.display = 'none';
            bookingForm.reset();

            // Optionally refresh "My Bookings" if on that page
            // import('./my-bookings.js').then(m => m.loadBookings()); 

        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to submit booking. Please try again.");
        }
    });
}
