import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { openLoginModal, showToast } from './auth.js';

// DOM Elements
const bookingForm = document.getElementById('bookingForm');
const selectedServicesList = document.getElementById('selectedServicesList');
const addServicesBtn = document.getElementById('addServicesBtn');

// State for selected services
let selectedServices = [];

// --- Helper Functions ---

// Initial load of services from storage (if any) or clear
function loadSelectedServices() {
    const saved = localStorage.getItem('booking_selected_services');
    if (saved) {
        try {
            selectedServices = JSON.parse(saved);
        } catch (e) {
            selectedServices = [];
        }
    }
    renderSelectedServices();
}

// Save to storage
function saveSelectedServices() {
    localStorage.setItem('booking_selected_services', JSON.stringify(selectedServices));
}


// Render the list of selected services in the booking form
function renderSelectedServices() {
    if (!selectedServicesList) return;

    selectedServicesList.innerHTML = '';

    if (selectedServices.length === 0) {
        selectedServicesList.innerHTML = `
            <div class="empty-services-state">
                <span class="empty-icon">✨</span>
                <p>No services selected yet</p>
                <button type="button" onclick="document.getElementById('addServicesBtn').click()" class="btn-text-gold">Browse Services</button>
            </div>
        `;
        return;
    }

    // Create wrapper list
    const listWrapper = document.createElement('ul');
    listWrapper.className = 'service-list-colorful';

    selectedServices.forEach((serviceName, index) => {
        const item = document.createElement('li');
        item.className = 'service-list-item-colorful';
        item.style.animationDelay = `${index * 0.1}s`;

        // Use a span for content
        item.innerHTML = `
            <span class="service-icon-colorful">✨</span>
            <span class="service-item-text">${serviceName}</span>
            <button type="button" class="remove-service-btn-list" data-index="${index}" aria-label="Remove ${serviceName}">
                ✕
            </button>
        `;
        listWrapper.appendChild(item);
    });

    selectedServicesList.appendChild(listWrapper);

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-service-btn-list').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            removeService(index);
        });
    });

    // Update Floating Bar
    if (typeof updateCartBar === 'function') {
        updateCartBar();
    }
}

// Add a service to the list
function addService(serviceName) {
    if (!selectedServices.includes(serviceName)) {
        selectedServices.push(serviceName);
        saveSelectedServices();
        renderSelectedServices();

        // Update Add Services button text temporarily
        const addBtn = document.querySelector(`.service-btn[data-service-name="${serviceName}"]`)
            || document.querySelector(`.service-btn`); // Fallback

        showToast(`Added: ${serviceName} ✨`);
    } else {
        showToast("Service already added!");
    }
}

// Remove a service
function removeService(index) {
    const removedName = selectedServices[index];
    selectedServices.splice(index, 1);
    saveSelectedServices();
    renderSelectedServices();
    // showToast(`Removed: ${removedName}`);
}


// Navigate to booking page (Full Page Logic)
function internalNavigateToBookingPage() {
    // Hide all pages
    document.querySelectorAll('.app-page').forEach(page => {
        page.classList.remove('active');
    });

    // Show booking page
    const bookingPage = document.getElementById('booking');
    if (bookingPage) {
        bookingPage.classList.add('active');
        window.scrollTo(0, 0);
        window.location.hash = 'booking';

        // Render current list
        renderSelectedServices();

        // Update Greeting with Name
        const userNameSpan = document.getElementById('bookingUserName');
        if (userNameSpan) {
            const user = auth.currentUser;
            if (user && user.displayName) {
                // Get first name
                const firstName = user.displayName.split(' ')[0];
                userNameSpan.textContent = firstName;
            } else {
                userNameSpan.textContent = "Guest";
            }
        }

        // Update Bottom Nav to deselect all (since Booking is a sub-page/action)
        document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => {
            nav.classList.remove('active');
        });

        // Reset adding mode
        localStorage.removeItem('booking_mode');
        // Update "Add Services" buttons back to "Book Now" if needed (handled by view logic, optional here)

    } else {
        console.error("Booking page not found!");
        showToast("Error loading booking page. Please refresh.", "error");
    }
}

// Get service name from the clicked card
function getServiceNameFromCard(clickedElement) {
    const serviceCard = clickedElement.closest('.service-page-card') ||
        clickedElement.closest('.service-card') ||
        clickedElement.closest('.featured-card');

    if (serviceCard) {
        const nameEl = serviceCard.querySelector('.service-page-card-name') ||
            serviceCard.querySelector('.service-name') ||
            serviceCard.querySelector('h3');
        if (nameEl) {
            return nameEl.textContent.trim();
        }
    }
    return null;
}

// --- Event Listeners ---

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedServices();

    // Fix for "Add Services" button
    const addBtn = document.getElementById('addServicesBtn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Add Services Clicked (Direct Listener)");

            // Set mode
            localStorage.setItem('booking_mode', 'adding');
            saveSelectedServices();

            // Navigate via Hash
            window.location.hash = '#services';

            // Force active class update if hash listener is slow
            setTimeout(() => {
                document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
                const servicesPage = document.getElementById('services');
                if (servicesPage) servicesPage.classList.add('active');

                // Update bottom nav
                document.querySelectorAll('.bottom-nav .nav-item').forEach(n => n.classList.remove('active'));
                const sNav = document.querySelector('.bottom-nav .nav-item[data-page="services"]');
                if (sNav) sNav.classList.add('active');
            }, 100);

            updateServicesPageButtons();
        });
    }

    // Set Date Input Restrictions (Today to +1 Month)
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);

        // Format to YYYY-MM-DD
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        dateInput.min = formatDate(today);
        dateInput.max = formatDate(maxDate);
    }
});

function updateServicesPageButtons() {
    // This assumes we are on the services page
    // Change all "Book Now" buttons to "Add +"
    const buttons = document.querySelectorAll('.service-page-book-btn, .service-btn');
    buttons.forEach(btn => {
        btn.textContent = "Add +";
        // Optionally add a class to style it differently
        btn.classList.add('add-mode-btn');
    });
}

// Observer to handle dynamic content loading (like on search or filter)
// If we are in 'adding' mode, ensuring buttons act like 'Add'
const serviceGridObserver = new MutationObserver(() => {
    const mode = localStorage.getItem('booking_mode');
    if (mode === 'adding' || selectedServices.length > 0) {
        updateServicesPageButtons();
    }
});
const servicesGrid = document.getElementById('servicesPageGrid');
if (servicesGrid) {
    serviceGridObserver.observe(servicesGrid, { childList: true });
}

// Update Service Cart Bar Visibility & Count
function updateCartBar() {
    const cartBar = document.getElementById('serviceCartBar');
    const cartCount = document.getElementById('cartCount');

    // Logic: Show only if services > 0 AND we are on 'services' page (or home page effectively)
    // Actually user requested: "when the user is in the services page"
    // We can check current hash or active section
    const isServicesPage = window.location.hash === '#services' || document.getElementById('services').classList.contains('active');

    if (selectedServices.length > 0 && isServicesPage) {
        if (cartBar) {
            cartBar.classList.remove('hidden');
            cartCount.textContent = selectedServices.length;
        }
    } else {
        if (cartBar) {
            cartBar.classList.add('hidden');
        }
    }
}

// Hook into navigation to update bar
window.addEventListener('hashchange', () => {
    setTimeout(updateCartBar, 100);
});

// Also hook into our custom navigation function
// Also hook into our custom navigation function
window.navigateToBookingPage = function () {
    internalNavigateToBookingPage();
    updateCartBar(); // Will hide it since we leave services page
};


// Restore Booking State (e.g. after login)
document.addEventListener('open-booking-modal', () => {
    console.log("State restored: Navigating to booking page");
    // If we have a pending service from login redirect, add it
    const savedService = localStorage.getItem('pending_booking_service');
    if (savedService) {
        addService(savedService);
        localStorage.removeItem('pending_booking_service');
    }

    navigateToBookingPage();
});

// Handle "Book Now" / "Add" buttons globally
document.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.service-btn') ||
        e.target.closest('.hero-btn.primary-btn') ||
        e.target.closest('.service-page-book-btn');

    if (targetBtn) {
        e.preventDefault();
        console.log("Action button clicked!");

        try {
            // Safety check for Firebase Auth
            if (!auth) {
                console.error("Auth is not initialized!");
                showToast("System Error: Setup incomplete. Please refresh or contact support.", "error");
                return;
            }

            const serviceName = getServiceNameFromCard(e.target);

            // Check if we are in "Add Mode" or simply adding to existing cart
            const mode = localStorage.getItem('booking_mode');
            const isAddMode = (mode === 'adding' || selectedServices.length > 0);

            if (isAddMode && serviceName) {
                // Add to list logic
                addService(serviceName);

                // Visual feedback on button
                const originalText = targetBtn.textContent;
                targetBtn.textContent = "Added ✔";
                setTimeout(() => {
                    targetBtn.textContent = originalText;
                }, 1000);

            } else {
                // "Book Now" Legacy Logic (Single Service -> Booking Page)
                const user = auth.currentUser;

                if (!user) {
                    if (serviceName) {
                        localStorage.setItem('pending_booking_service', serviceName);
                    }
                    showToast("Please login to book an appointment 🔐", "error");
                    openLoginModal('openBookingModal');
                } else {
                    // Logged in
                    if (serviceName) {
                        if (selectedServices.length === 0) {
                            addService(serviceName);
                        } else {
                            addService(serviceName);
                        }
                        navigateToBookingPage();
                    } else {
                        navigateToBookingPage();
                    }
                }
            }
        } catch (error) {
            console.error("Booking Button Error:", error);
            showToast("Something went wrong. Please try again.", "error");
        }
    }
});


// Submit Booking
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Booking form submitted!");

        const user = auth.currentUser;
        if (!user) {
            showToast("You must be logged in 🔐", "error");
            openLoginModal('openBookingModal');
            return;
        }

        if (selectedServices.length === 0) {
            showToast("Please select at least one service.", "error");
            return;
        }

        // const service = document.getElementById('bookingService').value; // OLD
        const serviceString = selectedServices.join(", "); // Combine for simple display

        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const notes = document.getElementById('bookingNotes').value;

        // Construct data
        // Storing 'service' as comma string for backward compatibility, 
        // but adding 'servicesList' array for better data structure.
        const bookingData = {
            userId: user.uid,
            userName: user.displayName || "Anonymous",
            userEmail: user.email,
            service: serviceString, // Maintained for legacy view
            servicesList: selectedServices, // New array field
            date: date,
            time: time,
            notes: notes,
            status: 'pending',
            createdAt: serverTimestamp()
        };

        console.log("Submission Data:", bookingData);

        try {
            await addDoc(collection(db, "bookings"), bookingData);

            console.log("Firestore write successful!");

            showToast("Booking request sent! We'll confirm shortly 🎉");

            // Clear selections
            selectedServices = [];
            saveSelectedServices();
            renderSelectedServices();

            bookingForm.reset();

            // Redirect to Home after short delay to show success
            setTimeout(() => {
                const homeNav = document.querySelector('.bottom-nav .nav-item[data-page="home"]');
                if (homeNav) homeNav.click();
            }, 1000);

            // Trigger confetti if available globally
            if (window.triggerConfetti) {
                window.triggerConfetti();
            }

        } catch (error) {
            console.error("Booking error:", error);
            showToast("Failed to submit booking. Please try again.", "error");
        }
    });
}
