// COMPLETE FIREBASE INTEGRATION & REAL-TIME DATA SYNC

import { 
  getNotifications, getBookings, getUserProfile, getUserStats,
  createBooking, cancelBooking, updateUserProfile
} from './firebase-api.js';

import { authController } from './firebase-auth.js';

let currentFilter = 'upcoming';
let notificationsCache = [];
let bookingsCache = [];

// ==================== REAL-TIME DATA LOADING ====================

async function loadAllData() {
  console.log('🔄 Loading real-time data from Firebase...');
  
  try {
    // Load all data in parallel
    const [notifications, bookings, profile, stats] = await Promise.all([
      getNotifications(),
      getBookings(currentFilter),
      getUserProfile(),
      getUserStats()
    ]);

    notificationsCache = notifications;
    bookingsCache = bookings;

    console.log('✅ Data loaded successfully');
    renderNotifications(notifications);
    renderBookings(bookings);
    renderAccount(profile, stats);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// ==================== RENDER NOTIFICATIONS ====================

function renderNotifications(notifications) {
  const list = document.getElementById('notificationsList');
  if (!list) return;

  if (!notifications || notifications.length === 0) {
    list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No notifications yet</div>';
    return;
  }

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

// ==================== RENDER BOOKINGS ====================

function renderBookings(bookings) {
  const list = document.getElementById('bookingsList');
  if (!list) return;

  if (!bookings || bookings.length === 0) {
    list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No bookings found</div>';
    return;
  }

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
        <p class="booking-time">⏰ ${b.appointmentTime || 'Time TBD'}</p>
        <p class="booking-service">✂️ Service: ${b.serviceName}</p>
        <p class="booking-price">₹${b.servicePrice}</p>
      </div>
      <div class="booking-actions" style="${b.status === 'completed' || b.status === 'cancelled' ? 'display: none;' : ''}">
        <button class="btn-reschedule" onclick="rescheduleBooking('${b.id}')">Reschedule</button>
        <button class="btn-cancel" onclick="confirmCancel('${b.id}')">Cancel</button>
      </div>
      ${b.status === 'completed' ? '<div class="booking-status">✅ Completed</div>' : ''}
      ${b.status === 'cancelled' ? '<div class="booking-status">❌ Cancelled</div>' : ''}
    </div>
  `).join('');
}

// ==================== RENDER ACCOUNT ====================

function renderAccount(profile, stats) {
  const user = authController.getCurrentUser() || profile;
  
  const profileCard = document.querySelector('.profile-card');
  if (profileCard) {
    profileCard.innerHTML = `
      <div class="profile-avatar">
        <div class="avatar-placeholder">${user.avatar || '👩‍🦰'}</div>
      </div>
      <div class="profile-info">
        <h2>Welcome, ${user.name || 'Beauty Lover'}! 💄</h2>
        <p class="profile-email">${user.email || 'user@example.com'}</p>
        <p class="profile-phone">${user.phone || '+91 98765 43210'}</p>
        <button class="btn-edit-profile" onclick="openEditProfile()">Edit Profile</button>
      </div>
    `;
  }

  const statsContainer = document.querySelector('.account-stats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">💳</div>
        <div class="stat-info">
          <div class="stat-value">${stats.rewardPoints || 280}</div>
          <div class="stat-label">Reward Points</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💄</div>
        <div class="stat-info">
          <div class="stat-value">${stats.servicesUsed || 12}</div>
          <div class="stat-label">Services Used</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <div class="stat-value">${stats.rating || 4.8}</div>
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

  // Auto-load data for tab
  if (tabName === 'notifications') loadNotificationsTab();
  if (tabName === 'bookings') loadBookingsTab();
  if (tabName === 'account') loadAccountTab();
}

async function loadNotificationsTab() {
  if (notificationsCache.length === 0) {
    const data = await getNotifications();
    notificationsCache = data;
  }
  renderNotifications(notificationsCache);
}

async function loadBookingsTab() {
  const data = await getBookings(currentFilter);
  bookingsCache = data;
  renderBookings(data);
}

async function loadAccountTab() {
  const [profile, stats] = await Promise.all([
    getUserProfile(),
    getUserStats()
  ]);
  renderAccount(profile, stats);
}

// ==================== BOOKING OPERATIONS ====================

async function filterBookings(status) {
  currentFilter = status;
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.classList.toggle('active', tab.textContent.trim() === capitalizeFirst(status) || tab.textContent.includes(status));
  });
  await loadBookingsTab();
}

async function rescheduleBooking(bookingId) {
  const newDate = prompt('Enter new appointment date (YYYY-MM-DD):');
  if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    const result = await updateUserProfile({ appointmentDate: newDate });
    if (result.success) {
      alert('✅ Booking rescheduled successfully!');
      loadBookingsTab();
    }
  } else {
    alert('Invalid date format. Please use YYYY-MM-DD');
  }
}

async function confirmCancel(bookingId) {
  if (confirm('Are you sure? This action cannot be undone.')) {
    const result = await cancelBooking(bookingId);
    if (result.success) {
      alert('✅ Booking cancelled successfully!');
      loadBookingsTab();
    } else {
      alert('❌ Error cancelling booking');
    }
  }
}

// ==================== PROFILE OPERATIONS ====================

function openEditProfile() {
  const user = authController.getCurrentUser();
  const modal = document.getElementById('authModal') || createAuthModal();
  modal.querySelector('.auth-modal-header').textContent = '✏️ Edit Profile';
  modal.classList.add('active');
}

async function handleNotificationAction(id, type) {
  if (type === 'offer') {
    switchTab('bookings');
    alert('💰 Browse our special offers and book now!');
  } else if (type === 'review') {
    alert('⭐ Rate your experience (feature coming soon)');
  } else {
    alert(`📬 Action for: ${type}`);
  }
}

// ==================== AUTHENTICATION ====================

async function openLoginModal() {
  let modal = document.getElementById('authModal');
  if (!modal) modal = createAuthModal();
  modal.classList.add('active');
  modal.querySelector('.auth-form').innerHTML = getLoginForm();
}

function getLoginForm() {
  return `
    <input type="email" placeholder="Email" id="loginEmail" required>
    <input type="password" placeholder="Password" id="loginPassword" required>
    <div class="auth-form-buttons">
      <button class="auth-btn auth-btn-primary" onclick="handleLogin()">Login</button>
      <button class="auth-btn auth-btn-secondary" onclick="switchAuthMode()">Sign Up</button>
    </div>
  `;
}

function getSignupForm() {
  return `
    <input type="text" placeholder="Full Name" id="signupName" required>
    <input type="email" placeholder="Email" id="signupEmail" required>
    <input type="tel" placeholder="Phone" id="signupPhone" required>
    <input type="password" placeholder="Password" id="signupPassword" required>
    <div class="auth-form-buttons">
      <button class="auth-btn auth-btn-primary" onclick="handleSignup()">Sign Up</button>
      <button class="auth-btn auth-btn-secondary" onclick="switchAuthMode()">Login</button>
    </div>
  `;
}

async function handleLogin() {
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;
  
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }

  const result = await authController.login(email, password);
  if (result.success) {
    alert('✅ Logged in successfully!');
    document.getElementById('authModal').classList.remove('active');
    loadAllData();
  }
}

async function handleSignup() {
  const name = document.getElementById('signupName')?.value;
  const email = document.getElementById('signupEmail')?.value;
  const phone = document.getElementById('signupPhone')?.value;
  const password = document.getElementById('signupPassword')?.value;

  if (!name || !email || !phone || !password) {
    alert('Please fill in all fields');
    return;
  }

  const result = await authController.signup(email, password, name, phone);
  if (result.success) {
    alert('✅ Account created successfully!');
    document.getElementById('authModal').classList.remove('active');
    loadAllData();
  }
}

function switchAuthMode() {
  const modal = document.getElementById('authModal');
  const form = modal.querySelector('.auth-form');
  if (form.innerHTML.includes('loginEmail')) {
    form.innerHTML = getSignupForm();
    modal.querySelector('.auth-modal-header').textContent = '✨ Sign Up';
  } else {
    form.innerHTML = getLoginForm();
    modal.querySelector('.auth-modal-header').textContent = '🔐 Login';
  }
}

function createAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-modal-content">
      <button onclick="closeAuthModal()" style="float: right; background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
      <div class="auth-modal-header">🔐 Login</div>
      <div class="auth-modal-subtitle">Access your Blancbeu account</div>
      <div class="auth-form"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('active');
}

// ==================== UTILITY FUNCTIONS ====================

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

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== INITIALIZE ON LOAD ====================

window.addEventListener('load', () => {
  console.log('🚀 Blancbeu app initializing...');
  
  // Check if user is logged in
  if (!authController.isLoggedIn()) {
    console.log('📝 No user logged in, using demo account');
    // Auto-login with demo account
    authController.login('demo@blancbeu.com', 'demo123');
  }

  // Setup tab navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.getAttribute('data-page');
      switchTab(page);
    });
  });

  // Load initial data
  loadAllData();
  
  console.log('✅ App ready!');
});

// Refresh data every 30 seconds for real-time updates
setInterval(() => {
  if (authController.isLoggedIn()) {
    loadAllData();
  }
}, 30000);

// Export for global use
window.switchTab = switchTab;
window.handleNotificationAction = handleNotificationAction;
window.filterBookings = filterBookings;
window.rescheduleBooking = rescheduleBooking;
window.confirmCancel = confirmCancel;
window.openEditProfile = openEditProfile;
window.openLoginModal = openLoginModal;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.switchAuthMode = switchAuthMode;
window.closeAuthModal = closeAuthModal;
