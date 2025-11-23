// Blancbeu Main Script with Firebase Integration

// ==================== BACKUP OF ORIGINAL FUNCTIONALITY ====================

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function moveCarousel(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  if (track) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
    console.log(`🔄 Moving carousel: current=${currentSlide}, direction=${currentSlide > 0 ? 1 : -1}`);
    console.log(`✅ New slide: ${currentSlide}`);
    startCarouselAutoplay();
  }
}

function updateDots() {
  const dotsContainer = document.getElementById('carouselDots');
  if (!dotsContainer) return;
  
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${i === currentSlide ? 'active' : ''}`;
    dot.onclick = () => {
      currentSlide = i;
      updateCarousel();
    };
    dotsContainer.appendChild(dot);
  }
}

let autoplayInterval;

function startCarouselAutoplay() {
  clearInterval(autoplayInterval);
  console.log('▶️ Starting carousel auto-play');
  autoplayInterval = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

// Theme toggle
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', newTheme);
    });
  }
}

// T&C Modal
function showTC() {
  const tcModal = document.getElementById('tcModal');
  if (tcModal) tcModal.style.display = 'block';
}

function closeTC() {
  const tcModal = document.getElementById('tcModal');
  if (tcModal) tcModal.style.display = 'none';
}

window.onclick = (event) => {
  try {
    const modal = document.getElementById('tcModal');
    if (modal && event.target === modal) {
      modal.style.display = 'none';
    }
  } catch (e) {
    console.error('Modal close error:', e);
  }
};

// ==================== FIREBASE INTEGRATION & REAL-TIME DATA ====================

// Mock data for fallback
const mockNotifications = [
  { id: 1, type: 'offer', title: 'Special Offer: Haircuts @₹99!', message: 'Limited time offer on all haircut styles. Book now!', createdAt: new Date().toISOString() },
  { id: 2, type: 'reward', title: 'Loyalty Reward Unlocked!', message: 'You\'ve earned 50 reward points. Use them for discounts!', createdAt: new Date().toISOString() },
  { id: 3, type: 'review', title: 'Rate Your Recent Visit', message: 'Tell us about your experience at BlancBeu', createdAt: new Date().toISOString() },
  { id: 4, type: 'festival', title: 'Festive Special: 50% OFF!', message: 'Celebrate with us - Get 50% off on beauty packages', createdAt: new Date().toISOString() }
];

const mockBookings = [
  { id: 1, serviceName: 'Haircut + Styling', servicePrice: 599, appointmentDate: '2025-11-28', appointmentTime: '2:30 PM', status: 'upcoming' },
  { id: 2, serviceName: 'Facial Treatment', servicePrice: 799, appointmentDate: '2025-11-25', appointmentTime: '11:00 AM', status: 'completed' }
];

const mockProfile = {
  name: 'Beauty Lover',
  email: 'user@example.com',
  phone: '+91 98765 43210',
  avatar: '👩‍🦰'
};

const mockStats = {
  rewardPoints: 280,
  servicesUsed: 12,
  rating: 4.8
};

// Current filter and cache
let currentFilter = 'upcoming';
let notificationsCache = mockNotifications;
let bookingsCache = mockBookings;

// ==================== RENDER FUNCTIONS ====================

function renderNotifications(notifications = mockNotifications) {
  const list = document.getElementById('notificationsList');
  if (!list) return;
  
  list.innerHTML = notifications.map(n => `
    <div class="notification-item">
      <div class="notification-icon">${getNotificationIcon(n.type)}</div>
      <div class="notification-content">
        <h3>${n.title}</h3>
        <p>${n.message}</p>
        <span class="notification-time">${formatTime(n.createdAt)}</span>
      </div>
      <button class="notification-btn" onclick="handleNotificationAction('${n.id}', '${n.type}')">
        ${getActionLabel(n.type)}
      </button>
    </div>
  `).join('');
}

function renderBookings(bookings = mockBookings) {
  const list = document.getElementById('bookingsList');
  if (!list) return;
  
  list.innerHTML = bookings.map(b => `
    <div class="booking-card">
      <div class="booking-date">
        <div class="date-box ${b.status === 'completed' ? 'completed' : ''}">
          <div class="day">${new Date(b.appointmentDate).getDate()}</div>
          <div class="month">${new Date(b.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}</div>
        </div>
      </div>
      <div class="booking-details">
        <h3>${b.serviceName}</h3>
        <p class="booking-time">⏰ ${b.appointmentTime}</p>
        <p class="booking-service">✂️ Service: ${b.serviceName}</p>
        <p class="booking-price">₹${b.servicePrice}</p>
      </div>
      <div class="booking-actions" style="${b.status === 'completed' || b.status === 'cancelled' ? 'display: none;' : ''}">
        <button class="btn-reschedule" onclick="alert('Reschedule feature coming soon')">Reschedule</button>
        <button class="btn-cancel" onclick="alert('Cancel feature coming soon')">Cancel</button>
      </div>
      ${b.status === 'completed' ? '<div class="booking-status">✅ Completed</div>' : ''}
    </div>
  `).join('');
}

function renderAccount(profile = mockProfile, stats = mockStats) {
  const profileCard = document.querySelector('.profile-card');
  if (profileCard) {
    profileCard.innerHTML = `
      <div class="profile-avatar">
        <div class="avatar-placeholder">${profile.avatar}</div>
      </div>
      <div class="profile-info">
        <h2>Welcome, ${profile.name}! 💄</h2>
        <p class="profile-email">${profile.email}</p>
        <p class="profile-phone">${profile.phone}</p>
        <button class="btn-edit-profile">Edit Profile</button>
      </div>
    `;
  }

  const statsContainer = document.querySelector('.account-stats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">💳</div>
        <div class="stat-info">
          <div class="stat-value">${stats.rewardPoints}</div>
          <div class="stat-label">Reward Points</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💄</div>
        <div class="stat-info">
          <div class="stat-value">${stats.servicesUsed}</div>
          <div class="stat-label">Services Used</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <div class="stat-value">${stats.rating}</div>
          <div class="stat-label">Your Rating</div>
        </div>
      </div>
    `;
  }
}

// ==================== TAB SWITCHING ====================

function switchTab(tabName) {
  document.querySelectorAll('.tab-page').forEach(tab => {
    tab.style.display = tab.getAttribute('data-page') === tabName ? 'block' : 'none';
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-page') === tabName);
  });

  // Load data for tab
  if (tabName === 'notifications') renderNotifications(notificationsCache);
  if (tabName === 'bookings') renderBookings(bookingsCache);
  if (tabName === 'account') renderAccount(mockProfile, mockStats);
}

function filterBookings(status) {
  currentFilter = status;
  const filtered = mockBookings.filter(b => status === 'all' || b.status === status);
  renderBookings(filtered);
}

// ==================== UTILITY FUNCTIONS ====================

function getNotificationIcon(type) {
  const icons = {
    offer: '🎉', reward: '💝', review: '⭐',
    festival: '🪔', booking: '📅', message: '💬'
  };
  return icons[type] || '🔔';
}

function getActionLabel(type) {
  const labels = {
    offer: 'Book Now', reward: 'View Rewards', review: 'Rate Now',
    festival: 'Explore', booking: 'View', message: 'Read'
  };
  return labels[type] || 'Action';
}

function formatTime(timestamp) {
  if (!timestamp) return 'Just now';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function handleNotificationAction(id, type) {
  if (type === 'offer') {
    switchTab('bookings');
  } else {
    alert(`Action for ${type}`);
  }
}

function openBooking() {
  switchTab('bookings');
}

// ==================== INITIALIZE ====================

document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('🎠 Carousel initialized with ' + totalSlides + ' slides');
    updateDots();
    startCarouselAutoplay();
    
    renderNotifications();
    renderBookings();
    renderAccount();
    
    setupThemeToggle();
    
    // Setup tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const page = item.getAttribute('data-page');
          if (page) switchTab(page);
        });
      });
    }

    console.log('✨ PWA Service Worker registered: ServiceWorkerRegistration');
  } catch (e) {
    console.error('DOM setup error:', e);
  }
});

// Export for global use
window.switchTab = switchTab;
window.filterBookings = filterBookings;
window.moveCarousel = moveCarousel;
window.handleNotificationAction = handleNotificationAction;
window.openBooking = openBooking;
window.showTC = showTC;
window.closeTC = closeTC;

// ==================== AUTHENTICATION - MANAGED BY auth.js ====================
// All authentication is now handled by auth.js module
// This file exports functions for backward compatibility and tab navigation

// Export auth functions from auth.js to window for onclick handlers
window.showAuthModal = typeof showAuthModal !== 'undefined' ? showAuthModal : function() { console.log('Auth module not loaded'); };
window.closeAuthModal = typeof closeAuthModal !== 'undefined' ? closeAuthModal : function() { console.log('Auth module not loaded'); };
window.setAuthMode = typeof setAuthMode !== 'undefined' ? setAuthMode : function(mode) { console.log('Auth module not loaded'); };
window.sendPhoneOTP = typeof sendPhoneOTP !== 'undefined' ? sendPhoneOTP : function() { console.log('Auth module not loaded'); };
window.verifyPhoneOTP = typeof verifyPhoneOTP !== 'undefined' ? verifyPhoneOTP : function() { console.log('Auth module not loaded'); };
window.loginWithGoogle = typeof loginWithGoogle !== 'undefined' ? loginWithGoogle : function() { console.log('Auth module not loaded'); };
window.sendWhatsAppLoginCode = typeof sendWhatsAppLoginCode !== 'undefined' ? sendWhatsAppLoginCode : function() { console.log('Auth module not loaded'); };
window.verifyWhatsAppCode = typeof verifyWhatsAppCode !== 'undefined' ? verifyWhatsAppCode : function() { console.log('Auth module not loaded'); };
window.logoutUser = typeof logoutUser !== 'undefined' ? logoutUser : function() { console.log('Auth module not loaded'); };

// NOTE: openAuthModal(), closeAuthModal(), toggleAuthMode(), handleAuthAction() 
// are now obsolete - use auth.js functions instead
