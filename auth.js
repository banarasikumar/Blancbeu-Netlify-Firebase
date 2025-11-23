// ==================== BLANCBEU AUTHENTICATION SYSTEM ====================
// Supports: Phone Number, Google OAuth, WhatsApp

let currentAuthMode = 'phone'; // phone | google | whatsapp
let userSession = JSON.parse(localStorage.getItem('blancbeu_user')) || null;

// ==================== AUTHENTICATION STATE ====================

function isUserLoggedIn() {
  return userSession && userSession.phone;
}

function getCurrentUser() {
  return userSession;
}

function setUserSession(user) {
  userSession = user;
  localStorage.setItem('blancbeu_user', JSON.stringify(user));
  updateUIForLoggedInUser();
}

function logoutUser() {
  userSession = null;
  localStorage.removeItem('blancbeu_user');
  location.reload();
}

// ==================== SHOW/HIDE AUTH MODAL ====================

function showAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.style.display = 'flex';
    setAuthMode('phone');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function setAuthMode(mode) {
  currentAuthMode = mode;
  const modal = document.getElementById('authModal');
  if (!modal) return;
  
  const header = modal.querySelector('.auth-modal-header');
  const form = modal.querySelector('.auth-form');
  
  if (mode === 'phone') {
    header.innerHTML = '📱 Phone Login';
    form.innerHTML = `
      <div class="auth-method-selector">
        <button class="method-btn active" onclick="setAuthMode('phone')">Phone</button>
        <button class="method-btn" onclick="setAuthMode('google')">Google</button>
        <button class="method-btn" onclick="setAuthMode('whatsapp')">WhatsApp</button>
      </div>
      <input type="tel" id="authPhone" placeholder="+91 98765 43210" required>
      <input type="text" id="authOTP" placeholder="OTP (we'll send it)" required disabled>
      <div class="auth-form-buttons">
        <button class="auth-btn auth-btn-primary" onclick="sendPhoneOTP()">Send OTP</button>
        <button class="auth-btn auth-btn-secondary" onclick="verifyPhoneOTP()" id="verifyOTPBtn" style="display:none;">Verify OTP</button>
      </div>
      <div class="auth-info">We'll send a one-time password to verify your phone number.</div>
    `;
  } else if (mode === 'google') {
    header.innerHTML = '🔷 Google Login';
    form.innerHTML = `
      <div class="auth-method-selector">
        <button class="method-btn" onclick="setAuthMode('phone')">Phone</button>
        <button class="method-btn active" onclick="setAuthMode('google')">Google</button>
        <button class="method-btn" onclick="setAuthMode('whatsapp')">WhatsApp</button>
      </div>
      <button class="auth-btn auth-btn-google" onclick="loginWithGoogle()">
        <span>🔷 Sign in with Google</span>
      </button>
      <div class="auth-info">Secure sign-in using your Google account. Fast & easy!</div>
    `;
  } else if (mode === 'whatsapp') {
    header.innerHTML = '💬 WhatsApp Login';
    form.innerHTML = `
      <div class="auth-method-selector">
        <button class="method-btn" onclick="setAuthMode('phone')">Phone</button>
        <button class="method-btn" onclick="setAuthMode('google')">Google</button>
        <button class="method-btn active" onclick="setAuthMode('whatsapp')">WhatsApp</button>
      </div>
      <input type="tel" id="authWhatsAppPhone" placeholder="+91 98765 43210" required>
      <input type="text" id="authWhatsAppCode" placeholder="Login code (we'll send it)" required disabled>
      <div class="auth-form-buttons">
        <button class="auth-btn auth-btn-whatsapp" onclick="sendWhatsAppLoginCode()">Send Code on WhatsApp</button>
        <button class="auth-btn auth-btn-secondary" onclick="verifyWhatsAppCode()" id="verifyWhatsAppBtn" style="display:none;">Verify Code</button>
      </div>
      <div class="auth-info">✓ Send a message to our WhatsApp to receive your login code</div>
    `;
  }
}

// ==================== PHONE AUTHENTICATION ====================

let phoneOTPSent = false;
let sentPhoneNumber = '';

async function sendPhoneOTP() {
  const phone = document.getElementById('authPhone').value;
  
  if (!phone || phone.length < 10) {
    alert('Please enter a valid phone number');
    return;
  }
  
  sentPhoneNumber = phone;
  phoneOTPSent = true;
  
  // Simulate sending OTP (In production, use Twilio SMS)
  const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem('blancbeu_otp_temp', mockOTP);
  
  console.log('📱 OTP sent to', phone, '- Mock OTP:', mockOTP);
  alert(`OTP sent to ${phone}\nDemo OTP: ${mockOTP}`);
  
  // Enable OTP input and verify button
  document.getElementById('authOTP').disabled = false;
  document.getElementById('verifyOTPBtn').style.display = 'block';
}

function verifyPhoneOTP() {
  const otp = document.getElementById('authOTP').value;
  const savedOTP = localStorage.getItem('blancbeu_otp_temp');
  
  if (!otp || otp.length !== 6) {
    alert('Please enter a valid 6-digit OTP');
    return;
  }
  
  if (otp !== savedOTP) {
    alert('Invalid OTP. Try again.');
    return;
  }
  
  // Login successful
  const user = {
    phone: sentPhoneNumber,
    loginMethod: 'phone',
    loginTime: new Date().toISOString(),
    id: 'phone_' + Date.now()
  };
  
  setUserSession(user);
  closeAuthModal();
  alert('✅ Login successful! Welcome to Blancbeu');
  localStorage.removeItem('blancbeu_otp_temp');
}

// ==================== GOOGLE AUTHENTICATION ====================

async function loginWithGoogle() {
  try {
    // Check if Firebase is available
    if (typeof firebase !== 'undefined' && firebase.auth) {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      
      const user = {
        phone: result.user.phoneNumber || 'Google User',
        email: result.user.email,
        name: result.user.displayName,
        loginMethod: 'google',
        loginTime: new Date().toISOString(),
        id: result.user.uid,
        photoURL: result.user.photoURL
      };
      
      setUserSession(user);
      closeAuthModal();
      alert('✅ Google login successful!');
    } else {
      // Fallback: Simulate Google login
      alert('Firebase not configured. Using demo mode.');
      const user = {
        phone: '+91 9876543210',
        email: 'demo@gmail.com',
        name: 'Demo User',
        loginMethod: 'google',
        loginTime: new Date().toISOString(),
        id: 'google_' + Date.now()
      };
      
      setUserSession(user);
      closeAuthModal();
      alert('✅ Google login successful! (Demo Mode)');
    }
  } catch (error) {
    console.error('Google login error:', error);
    alert('Google login failed. Please try another method.');
  }
}

// ==================== WHATSAPP AUTHENTICATION ====================

let whatsappCodeSent = false;
let sentWhatsAppNumber = '';

async function sendWhatsAppLoginCode() {
  const phone = document.getElementById('authWhatsAppPhone').value;
  
  if (!phone || phone.length < 10) {
    alert('Please enter a valid phone number');
    return;
  }
  
  sentWhatsAppNumber = phone;
  whatsappCodeSent = true;
  
  // Generate login code
  const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem('blancbeu_whatsapp_code_temp', loginCode);
  
  // In production: Use Twilio WhatsApp API to send message
  console.log('💬 WhatsApp login code sent to', phone, '- Code:', loginCode);
  
  alert(`WhatsApp login code sent to ${phone}\nDemo Code: ${loginCode}\n\nInstructions:\n1. Go to your WhatsApp\n2. Send the code you received\n3. Enter it below to login`);
  
  // Enable code input and verify button
  document.getElementById('authWhatsAppCode').disabled = false;
  document.getElementById('verifyWhatsAppBtn').style.display = 'block';
}

function verifyWhatsAppCode() {
  const code = document.getElementById('authWhatsAppCode').value;
  const savedCode = localStorage.getItem('blancbeu_whatsapp_code_temp');
  
  if (!code || code.length !== 6) {
    alert('Please enter a valid 6-digit code');
    return;
  }
  
  if (code !== savedCode) {
    alert('Invalid code. Check your WhatsApp message and try again.');
    return;
  }
  
  // Login successful
  const user = {
    phone: sentWhatsAppNumber,
    loginMethod: 'whatsapp',
    loginTime: new Date().toISOString(),
    id: 'whatsapp_' + Date.now()
  };
  
  setUserSession(user);
  closeAuthModal();
  alert('✅ WhatsApp login successful! Welcome to Blancbeu');
  localStorage.removeItem('blancbeu_whatsapp_code_temp');
}

// ==================== PROTECTED PAGES - REQUIRE LOGIN ====================

function requireLogin(callback) {
  if (!isUserLoggedIn()) {
    showAuthModal();
    console.log('🔐 User not logged in - showing auth modal');
    return false;
  }
  if (callback) callback();
  return true;
}

// Check if page requires login and redirect to bookings/account
function checkPageAccess() {
  const currentPage = document.querySelector('.tab-page[style*="display: block"]')?.getAttribute('data-page');
  const restrictedPages = ['bookings', 'account', 'notifications'];
  
  if (restrictedPages.includes(currentPage) && !isUserLoggedIn()) {
    requireLogin(() => {
      navigateToPage('home');
    });
  }
}

// ==================== UI UPDATES ====================

function updateUIForLoggedInUser() {
  if (!userSession) return;
  
  // Update account page with user info
  const profileName = document.querySelector('.profile-info h2');
  const profilePhone = document.querySelector('.profile-info p');
  
  if (profileName) profileName.textContent = userSession.name || userSession.phone;
  if (profilePhone) profilePhone.textContent = userSession.phone;
  
  // Add logout button if not exists
  const nav = document.querySelector('.bottom-nav');
  if (nav && !document.querySelector('.logout-btn')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = '🚪 Logout';
    logoutBtn.onclick = logoutUser;
    nav.parentElement.appendChild(logoutBtn);
  }
}

// ==================== PAGE NAVIGATION WITH LOGIN CHECK ====================

function navigateToPage(page) {
  const restrictedPages = ['bookings', 'account', 'notifications'];
  
  if (restrictedPages.includes(page) && !isUserLoggedIn()) {
    showAuthModal();
    return;
  }
  
  // Hide all pages
  document.querySelectorAll('.tab-page').forEach(p => {
    p.style.display = 'none';
  });
  
  // Show selected page
  const selectedPage = document.querySelector(`[data-page="${page}"]`);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  }
  
  // Update nav indicators
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === page) {
      item.classList.add('active');
    }
  });
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  if (isUserLoggedIn()) {
    updateUIForLoggedInUser();
    console.log('✅ User session restored:', userSession.phone);
  } else {
    console.log('🔓 No active user session');
  }
  
  // Set up nav item click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.getAttribute('data-page');
      navigateToPage(page);
    });
  });
  
  // Check page access on load
  checkPageAccess();
});
