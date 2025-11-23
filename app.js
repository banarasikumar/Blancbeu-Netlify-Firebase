// DOM Elements
const tabButtons = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const themeToggle = document.querySelector('.theme-toggle');
const carousel = document.querySelector('.carousel');
const carouselDots = document.querySelectorAll('.carousel-dot');
const filterButtons = document.querySelectorAll('.filter-btn');
const bookingList = document.getElementById('booking-list');
const emptyBookings = document.getElementById('empty-bookings');
const serviceButtons = document.querySelectorAll('.service-card, [class*="Book"]');
const authModal = document.getElementById('auth-modal');
const bookingModal = document.getElementById('booking-modal');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// State
let currentTab = 'home';
let currentCarouselIndex = 0;
let carouselAutoplayInterval;
let theme = localStorage.getItem('theme') || 'dark';
let bookingFilter = 'upcoming';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeCarousel();
    setupEventListeners();
    loadBookings();
    // Show auth modal on first visit (optional - can be removed if not needed)
    // setTimeout(() => showAuthModal(), 300);
});

// Theme Management
function initializeTheme() {
    if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
        updateThemeIcon();
    }
}

function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    
    if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
    
    updateThemeIcon();
    animateThemeToggle();
}

function updateThemeIcon() {
    if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

function animateThemeToggle() {
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
}

// Carousel Management
function initializeCarousel() {
    if (!carousel) return;
    
    startCarouselAutoplay();
    
    // Smooth scroll carousel
    carousel.addEventListener('scroll', debounce(onCarouselScroll, 200));
}

function startCarouselAutoplay() {
    carouselAutoplayInterval = setInterval(() => {
        currentCarouselIndex = (currentCarouselIndex + 1) % 5;
        scrollCarouselToIndex(currentCarouselIndex);
        updateCarouselDots();
    }, 5000); // 5 seconds
}

function stopCarouselAutoplay() {
    if (carouselAutoplayInterval) {
        clearInterval(carouselAutoplayInterval);
    }
}

function scrollCarouselToIndex(index) {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const slide = carousel.children[index];
    if (slide) {
        slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
}

function onCarouselScroll() {
    if (!carousel) return;
    
    const scrollLeft = carousel.scrollLeft;
    const slideWidth = carousel.offsetWidth;
    currentCarouselIndex = Math.round(scrollLeft / slideWidth);
    updateCarouselDots();
    
    // Restart autoplay on manual scroll
    stopCarouselAutoplay();
    startCarouselAutoplay();
}

function updateCarouselDots() {
    carouselDots.forEach((dot, index) => {
        if (index === currentCarouselIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Tab Navigation
function switchTab(tabName) {
    // Hide all tabs
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active from all buttons
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Highlight selected button
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    currentTab = tabName;
    
    // Scroll to top
    document.querySelector('.main-content').scrollTop = 0;
}

// Bookings Management
function loadBookings() {
    filterBookings('upcoming');
}

function filterBookings(filter) {
    bookingFilter = filter;
    
    // Update filter buttons
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide bookings
    const allBookings = document.querySelectorAll('.booking-card');
    let visibleCount = 0;
    
    allBookings.forEach(booking => {
        const status = booking.dataset.status;
        if (status === filter) {
            booking.style.display = 'block';
            booking.style.animation = 'fadeIn 0.3s ease-out forwards';
            visibleCount++;
        } else {
            booking.style.display = 'none';
        }
    });
    
    // Show empty state if no bookings
    if (visibleCount === 0) {
        bookingList.style.display = 'none';
        emptyBookings.style.display = 'block';
    } else {
        bookingList.style.display = 'flex';
        emptyBookings.style.display = 'none';
    }
}

// Modal Management
function showAuthModal() {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
}

function showBookingModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners
function setupEventListeners() {
    // Tab Navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Filter Buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            filterBookings(filter);
        });
    });
    
    // Carousel Dots
    carouselDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            currentCarouselIndex = index;
            scrollCarouselToIndex(index);
            updateCarouselDots();
            stopCarouselAutoplay();
            startCarouselAutoplay();
        });
    });
    
    // Booking Action Buttons
    document.querySelectorAll('[class*="Book"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.textContent.includes('Book') || btn.textContent.includes('book')) {
                showBookingModal();
            }
        });
    });
    
    // Modal Close Buttons
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Booking Form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleBooking();
        });
    }
    
    // Preference checkboxes
    document.querySelectorAll('.checkbox-label input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            // Save preference
            console.log('Preference updated:', e.target.checked);
        });
    });
    
    // Reschedule and Cancel buttons
    document.querySelectorAll('.booking-actions button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.textContent.toLowerCase();
            if (action.includes('reschedule')) {
                showBookingModal();
            } else if (action.includes('cancel')) {
                handleCancelBooking(btn);
            }
        });
    });
}

// Form Handlers
function handleLogin() {
    const email = document.querySelector('.login-form input[type="email"]').value;
    const password = document.querySelector('.login-form input[type="password"]').value;
    
    console.log('Login attempt:', { email });
    
    // Simulate login
    setTimeout(() => {
        closeAuthModal();
        showNotification('Successfully logged in!', 'success');
        switchTab('home');
    }, 800);
}

function handleBooking() {
    const formData = new FormData(document.getElementById('booking-form'));
    console.log('Booking submitted:', Object.fromEntries(formData));
    
    // Simulate booking
    setTimeout(() => {
        closeBookingModal();
        showNotification('Booking confirmed! Check your bookings tab.', 'success');
        loadBookings();
        switchTab('bookings');
    }, 800);
}

function handleCancelBooking(btn) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const bookingCard = btn.closest('.booking-card');
        bookingCard.style.animation = 'fadeOut 0.3s ease-out forwards';
        
        setTimeout(() => {
            bookingCard.remove();
            loadBookings();
            showNotification('Booking cancelled', 'info');
        }, 300);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 16px;
        left: 16px;
        padding: 16px;
        border-radius: 12px;
        background-color: ${type === 'success' ? '#4caf50' : type === 'danger' ? '#f44336' : '#2196f3'};
        color: white;
        font-size: 14px;
        font-weight: 600;
        z-index: 2000;
        animation: slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.4s ease-out forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('Service Worker registered:', registration);
        }).catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (authModal.classList.contains('active')) {
            closeAuthModal();
        }
        if (bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    }
});

// Page Visibility - Pause carousel when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopCarouselAutoplay();
    } else {
        startCarouselAutoplay();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleTheme();
    }
});

// Add CSS animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Log initialization
console.log('🚀 Beauty Family Salon App Initialized');
console.log('✨ Theme:', theme);
console.log('📱 PWA Ready');
console.log('⚡ Performance Optimized');