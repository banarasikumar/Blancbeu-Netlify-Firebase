import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { openLoginModal, showToast } from './auth.js';

// DOM Elements
const bookingForm = document.getElementById('bookingForm');
const selectedServicesList = document.getElementById('selectedServicesList');
const addServicesBtn = document.getElementById('addServicesBtn');

// State for selected services
let selectedServices = [];

// Event Listener for Add Services Button (Fix for reliability)
// Event Listener for Add Services Button (Fix for reliability)
if (addServicesBtn) {
    addServicesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Add Services Clicked (Relinked Listener)");

        // 1. Set Mode
        localStorage.setItem('booking_mode', 'adding');

        // 2. Navigation
        // Use the global router if available for smooth transition
        if (window.navigateToPage) {
            window.navigateToPage('services');
        } else {
            // Fallback to hash navigation
            window.location.hash = '#services';
        }

        // 3. Ensure Services Page Logic Initializes
        // We dispatch a hashchange event to ensure script.js picks it up
        // even if navigateToPage used replaceState
        setTimeout(() => {
            window.dispatchEvent(new Event('hashchange'));
        }, 100);
    });
}

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
    // Ensure buttons reflect state on load (if explicit function exists)
    if (typeof updateServicesPageButtons === 'function') {
        updateServicesPageButtons();
    }
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

    // Always sync buttons
    if (typeof updateServicesPageButtons === 'function') {
        updateServicesPageButtons();
    }
}

// Remove a service
function removeService(index) {
    const removedName = selectedServices[index];
    selectedServices.splice(index, 1);
    saveSelectedServices();
    renderSelectedServices();
    if (typeof updateServicesPageButtons === 'function') {
        updateServicesPageButtons();
    }
    // showToast(`Removed: ${removedName}`);
}


// Navigate to booking page (Full Page Logic)
function internalNavigateToBookingPage() {
    // RESET HEADER (Fix for missing header on navigation)
    const header = document.getElementById('mainHeader');
    if (header) {
        header.classList.remove('hidden');
        header.style.transition = 'none'; // Instant reset
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
        header.style.visibility = 'visible';
        document.documentElement.style.setProperty('--sticky-top', '80px');

        // Restore transition after small delay
        setTimeout(() => {
            header.style.transition = '';
        }, 50);
    }

    // Hide all pages
    document.querySelectorAll('.app-page').forEach(page => {
        page.classList.remove('active');
    });

    // Show booking page
    const bookingPage = document.getElementById('booking');
    if (bookingPage) {
        bookingPage.classList.add('active');

        // Scroll Content to Top (Fix for physical scroll compatibility)
        const appContent = document.getElementById('appContent');
        if (appContent) {
            appContent.scrollTop = 0;
        } else {
            window.scrollTo(0, 0);
        }

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
        clickedElement.closest('.featured-card') ||
        clickedElement.closest('.service-highlight-card'); // Added for homepage featured services

    if (serviceCard) {
        const nameEl = serviceCard.querySelector('.service-page-card-name') ||
            serviceCard.querySelector('.service-name') ||
            serviceCard.querySelector('h3') ||
            serviceCard.querySelector('.highlight-card-title'); // Potential title class for highlights
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

            // Navigate via Global Helper (Robust)
            if (window.navigateToPage) {
                window.navigateToPage('services');
            } else {
                window.location.hash = '#services';
            }

            // Fallback for button state (runs after navigation)
            setTimeout(updateServicesPageButtons, 50);
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

    // --- Navigation Re-render Fix ---
    // Ensure services are rendered whenever the booking page becomes active

    // 1. Hash Change listener
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#booking' || window.location.hash === 'booking') {
            console.log("Hash changed to #booking, re-rendering services...");
            renderSelectedServices();
        }
    });

    // 2. MutationObserver for 'active' class on the booking section
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (bookingSection.classList.contains('active')) {
                        console.log("Booking section became active, re-rendering services...");
                        renderSelectedServices();
                    }
                }
            });
        });
        observer.observe(bookingSection, { attributes: true });
    }

    // Initialize Custom Pickers (New)
    initCustomPickers();
    // Initialize Date Quick Tags
    initDateQuickTags();
});

// --- Custom Picker Logic ---

let currentPickerDate = new Date(); // To track calendar month

function initCustomPickers() {
    const dateInput = document.getElementById('bookingDate');
    const timeInput = document.getElementById('bookingTime');
    const dateModal = document.getElementById('customDatePickerModal');
    const timeModal = document.getElementById('customTimePickerModal');

    // Date Picker Trigger
    if (dateInput && dateModal) {
        dateInput.addEventListener('click', (e) => {
            e.preventDefault();
            dateInput.blur(); // Prevent keyboard
            dateModal.classList.remove('hidden');
            renderCalendar(currentPickerDate);
        });
    }

    // Time Picker Trigger
    if (timeInput && timeModal) {
        timeInput.addEventListener('click', (e) => {
            e.preventDefault();
            timeInput.blur();
            // Optional: Only open if date is selected? For now, open freely.
            timeModal.classList.remove('hidden');
            renderTimeSlots();
        });
    }

    // Calendar Navigation
    document.getElementById('prevMonthBtn').addEventListener('click', () => {
        currentPickerDate.setMonth(currentPickerDate.getMonth() - 1);
        renderCalendar(currentPickerDate);
    });

    document.getElementById('nextMonthBtn').addEventListener('click', () => {
        currentPickerDate.setMonth(currentPickerDate.getMonth() + 1);
        renderCalendar(currentPickerDate);
    });

    // Click Outside to Close Logic
    [dateModal, timeModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                // If the click is ON the modal overlay (the background), closes it
                // e.target is what was clicked. currentTarget is the modal div.
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    });
}

// Helper to update tag state based on date string
function updateTagState(selectedDateString) {
    const tags = document.querySelectorAll('.date-tag');
    tags.forEach(t => t.classList.remove('active'));

    if (!selectedDateString) return;

    // Parse DD-MM-YYYY
    const [dd, mm, yyyy] = selectedDateString.split('-').map(Number);
    // Create date object (midnight)
    const selectedDate = new Date(yyyy, mm - 1, dd);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = selectedDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Match with tags
    const matchedTag = document.querySelector(`.date-tag[data-offset="${diffDays}"]`);
    if (matchedTag) {
        matchedTag.classList.add('active');
    }
}

function initDateQuickTags() {
    const tags = document.querySelectorAll('.date-tag');
    const dateInput = document.getElementById('bookingDate');

    if (!tags.length || !dateInput) return;

    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission

            const offset = parseInt(tag.getAttribute('data-offset'));
            const date = new Date();
            date.setDate(date.getDate() + offset);

            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');

            // Set input value
            const formattedDate = `${dd}-${mm}-${yyyy}`;
            dateInput.value = formattedDate;

            // Sync Highlighting
            updateTagState(formattedDate);

            // Update Global Calendar current view to this month (if defined)
            if (typeof currentPickerDate !== 'undefined') {
                currentPickerDate = new Date(date);
                currentPickerDate.setDate(1);
            }
        });
    });
}


function renderCalendar(date) {
    const grid = document.getElementById('customCalendarGrid');
    const monthYearTitle = document.getElementById('currentMonthYear');
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');

    if (!grid || !monthYearTitle) return;

    grid.innerHTML = '';

    // Set Header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearTitle.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    // --- Navigation Visibility Logic ---
    const today = new Date();
    // Normalize today to start of month for comparison
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Max Date (1 Month from now)
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Start of next month

    // Normalize Viewer Date
    const viewDateStart = new Date(date.getFullYear(), date.getMonth(), 1);

    // Hide Prev if we are at Start Month (or earlier, though unlikely)
    if (viewDateStart <= currentMonthStart) {
        if (prevBtn) prevBtn.style.visibility = 'hidden';
    } else {
        if (prevBtn) prevBtn.style.visibility = 'visible';
    }

    // Hide Next if we are at Max Month
    if (viewDateStart >= maxDate) {
        if (nextBtn) nextBtn.style.visibility = 'hidden';
    } else {
        if (nextBtn) nextBtn.style.visibility = 'visible';
    }

    // Get First Day and Days in Month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Empty Slots for Previous Month
    for (let i = 0; i < firstDay; i++) {
        const slot = document.createElement('div');
        slot.className = 'calendar-day empty';
        grid.appendChild(slot);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day available'; // Default Green (Available)
        dayEl.textContent = i;

        // Check if today or past
        const currentRef = new Date(date.getFullYear(), date.getMonth(), i);
        // Reset times for accurate compare
        currentRef.setHours(0, 0, 0, 0);
        const todayRef = new Date();
        todayRef.setHours(0, 0, 0, 0);

        // Logic: Disable if in the past
        if (currentRef < todayRef) {
            dayEl.classList.remove('available');
            dayEl.classList.add('empty'); // Make past dates disabled-looking (or just not green)
            dayEl.style.opacity = '0.3';
            dayEl.style.cursor = 'not-allowed';
        } else {
            // Click Handler
            dayEl.addEventListener('click', () => {
                // Date Selection
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(i).padStart(2, '0');

                // Format: DD-MM-YYYY (e.g. 30-01-2026)
                const formattedDate = `${dd}-${mm}-${yyyy}`;

                document.getElementById('bookingDate').value = formattedDate;
                document.getElementById('customDatePickerModal').classList.add('hidden');

                // Highlight visual selection state if re-opened (optional polish)
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                dayEl.classList.add('selected');

                // Sync Tag State
                if (typeof updateTagState === 'function') {
                    updateTagState(formattedDate);
                }
            });
        }

        grid.appendChild(dayEl);
    }
}

function renderTimeSlots() {
    const grid = document.getElementById('customTimeGrid');
    const dateInput = document.getElementById('bookingDate');
    if (!grid) return;

    // Check if selected date is Today
    let isToday = false;
    if (dateInput && dateInput.value) {
        // Parse "DD-MM-YYYY"
        const [d, m, y] = dateInput.value.split('-').map(Number);
        // Compare with today
        const today = new Date();
        const selDate = new Date(y, m - 1, d);

        if (selDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
            isToday = true;
        }
    }

    // Let's re-render to ensure fresh state
    grid.innerHTML = '';

    // Generate 30min slots from 10:00 to 19:30 (Closing 8:00 PM)
    const startHour = 10;
    const endHour = 19;

    // Current time for comparison
    const now = new Date();

    for (let h = startHour; h <= endHour; h++) {
        // If 19:00, allow both 00 and 30
        const slots = [0, 30];

        slots.forEach(m => {
            // Create a date object for this slot on "Today"
            const slotDate = new Date();
            slotDate.setHours(h, m, 0, 0);

            // Logic: Not Display if date is Today AND slot is in the past
            // We use a buffer of 0 mins (strict)
            if (isToday && slotDate < now) {
                return; // Skip rendering
            }

            // Format Time AM/PM
            // Just for display string, use a dummy date set to h:m
            const displayDate = new Date();
            displayDate.setHours(h, m);
            const timeString = displayDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            const slot = document.createElement('div');
            slot.className = 'time-slot available'; // Default Green
            slot.textContent = timeString;

            slot.addEventListener('click', () => {
                document.getElementById('bookingTime').value = timeString; // Display AM/PM
                document.getElementById('customTimePickerModal').classList.add('hidden');
            });

            grid.appendChild(slot);
        });
    }
}

function updateServicesPageButtons() {
    // This assumes we are on the services page
    // Change all "Book Now" buttons to "Add +" or "Added" depending on state
    const buttons = document.querySelectorAll('.service-page-book-btn, .service-btn');
    buttons.forEach(btn => {
        const serviceName = getServiceNameFromCard(btn);

        if (serviceName && selectedServices.includes(serviceName)) {
            btn.textContent = "ADDED \u2714";
            btn.classList.add('added-btn');
            btn.classList.add('add-mode-btn');
        } else {
            btn.textContent = "Add +";
            btn.classList.remove('added-btn');
            btn.classList.add('add-mode-btn');
        }
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
// Update Service Cart Bar Visibility & Count
function updateCartBar() {
    const cartBar = document.getElementById('serviceCartBar');
    const cartCount = document.getElementById('cartCount');

    // Logic: Show only if services > 0 AND we are on 'services' page (or home page effectively)
    // Actually user requested: "when the user is in the services page"
    // We can check current hash or active section
    const isServicesPage = window.location.hash === '#services' ||
        (document.getElementById('services') && document.getElementById('services').classList.contains('active'));

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
window.updateServiceCartVisibility = updateCartBar; // Expose for nav_fix.js

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
document.addEventListener('click', async (e) => {
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

            // WAIT for Auth to be ready (Fix for "login flash" on reload)
            await auth.authStateReady();

            const serviceName = getServiceNameFromCard(e.target);

            // Check if we are in "Add Mode" or simply adding to existing cart
            const mode = localStorage.getItem('booking_mode');
            const isAddMode = (mode === 'adding' || selectedServices.length > 0);

            if (isAddMode && serviceName) {
                // Add to list logic
                addService(serviceName);

                // Visual feedback on button (Permanent)
                targetBtn.textContent = "ADDED \u2714";
                targetBtn.classList.add('added-btn');
                targetBtn.classList.add('add-mode-btn');

            } else {
                // "Book Now" Legacy Logic (Single Service -> Booking Page)
                const user = auth.currentUser;

                if (!user) {
                    if (serviceName) {
                        localStorage.setItem('pending_booking_service', serviceName);
                    }
                    // No error toast needed here usually if it's just a prompt to login, 
                    // but keeping logic consistent with previous behavior or improving UX.
                    // Ideally, just open modal gracefully.

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

        // Validation: Ensure Date & Time are selected
        if (!date) {
            showToast("Please select a Date 📅", "error");
            return;
        }
        if (!time) {
            showToast("Please select a Time ⏰", "error");
            return;
        }

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
            status: (!notes || notes.trim() === "") ? 'confirmed' : 'pending',
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
