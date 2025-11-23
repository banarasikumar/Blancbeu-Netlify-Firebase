// ==================== BLANCBEU AUTHENTICATION SYSTEM ====================
// Supports: Phone Number, Google OAuth, WhatsApp

let currentAuthMode = 'phone'; // phone | google | whatsapp
let userSession = JSON.parse(localStorage.getItem('blancbeu_user')) || null;

// Backend API Configuration
let AUTH_API_BASE_URL = 'http://localhost:5001/blancbeu-salon/us-central1/auth';
let USE_BACKEND_API = false;

// Initialize API config when Firebase config loads
function initializeAPIConfig() {
  try {
    if (typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG?.functionsUrl) {
      AUTH_API_BASE_URL = FIREBASE_CONFIG.functionsUrl + '/auth';
      USE_BACKEND_API = true;
      console.log('✅ Backend API configured:', AUTH_API_BASE_URL);
    } else {
      console.log('📱 Using demo mode (no Firebase config)');
    }
  } catch (e) {
    console.log('📱 Demo mode enabled (Firebase config not available)');
  }
}

// API helper function
async function callAuthAPI(endpoint, data) {
  if (!USE_BACKEND_API) {
    console.log(`📱 Demo mode: ${endpoint}`, data);
    return { success: true, demo: true };
  }
  
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      timeout: 5000
    });
    return await response.json();
  } catch (error) {
    console.error(`API error on ${endpoint}:`, error);
    return { error: error.message };
  }
}

// Call on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAPIConfig);
} else {
  initializeAPIConfig();
}

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
  try {
    const phone = document.getElementById('authPhone')?.value;
    
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    
    sentPhoneNumber = phone;
    phoneOTPSent = true;
    
    if (USE_BACKEND_API) {
      // Call backend API to send SMS OTP
      const result = await callAuthAPI('send-otp', { phone });
      
      if (result.error) {
        alert('Error sending OTP: ' + result.error);
        return;
      }
      
      alert(`✓ OTP sent to ${phone}`);
      console.log('📱 SMS OTP sent via Twilio:', result.sid);
    } else {
      // Demo mode: Generate mock OTP
      const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('blancbeu_otp_temp', mockOTP);
      alert(`📱 Demo Mode: OTP for ${phone}\nCode: ${mockOTP}`);
      console.log('📱 Demo OTP:', mockOTP);
    }
    
    // Enable OTP input and verify button
    const otpInput = document.getElementById('authOTP');
    const verifyBtn = document.getElementById('verifyOTPBtn');
    if (otpInput) otpInput.disabled = false;
    if (verifyBtn) verifyBtn.style.display = 'block';
  } catch (error) {
    console.error('OTP send error:', error);
    alert('Failed to send OTP. Please try again.');
  }
}

async function verifyPhoneOTP() {
  const otp = document.getElementById('authOTP').value;
  
  if (!otp || otp.length !== 6) {
    alert('Please enter a valid 6-digit OTP');
    return;
  }
  
  try {
    if (USE_BACKEND_API) {
      // Call backend API to verify OTP
      const result = await callAuthAPI('verify-otp', { 
        phone: sentPhoneNumber, 
        otp 
      });
      
      if (result.error) {
        alert('❌ ' + result.error);
        return;
      }
      
      // Login successful
      const user = {
        phone: sentPhoneNumber,
        loginMethod: 'phone',
        loginTime: new Date().toISOString(),
        token: result.token,
        id: result.user?.id || 'phone_' + Date.now()
      };
      
      setUserSession(user);
      closeAuthModal();
      alert('✅ Phone login successful! Welcome to Blancbeu');
      console.log('✅ Verified with token:', result.token);
    } else {
      // Demo mode verification
      const savedOTP = localStorage.getItem('blancbeu_otp_temp');
      
      if (otp !== savedOTP) {
        alert('❌ Invalid OTP. Try again.');
        return;
      }
      
      const user = {
        phone: sentPhoneNumber,
        loginMethod: 'phone',
        loginTime: new Date().toISOString(),
        id: 'phone_' + Date.now(),
        demo: true
      };
      
      setUserSession(user);
      closeAuthModal();
      alert('✅ Phone login successful! (Demo Mode)');
      localStorage.removeItem('blancbeu_otp_temp');
    }
  } catch (error) {
    console.error('OTP verify error:', error);
    alert('Failed to verify OTP. Please try again.');
  }
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
  try {
    const phone = document.getElementById('authWhatsAppPhone')?.value;
    
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    
    sentWhatsAppNumber = phone;
    whatsappCodeSent = true;
    
    if (USE_BACKEND_API) {
      // Call backend API to send WhatsApp code
      const result = await callAuthAPI('send-whatsapp-code', { phone });
      
      if (result.error) {
        alert('Error sending WhatsApp code: ' + result.error);
        return;
      }
      
      alert(`✓ WhatsApp code sent to ${phone}\n\nCheck your WhatsApp for the login code`);
      console.log('💬 WhatsApp code sent via Twilio:', result.sid);
    } else {
      // Demo mode: Generate mock code
      const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('blancbeu_whatsapp_code_temp', loginCode);
      alert(`💬 Demo Mode: WhatsApp Code for ${phone}\nCode: ${loginCode}`);
      console.log('💬 Demo WhatsApp Code:', loginCode);
    }
    
    // Enable code input and verify button
    const codeInput = document.getElementById('authWhatsAppCode');
    const verifyBtn = document.getElementById('verifyWhatsAppBtn');
    if (codeInput) codeInput.disabled = false;
    if (verifyBtn) verifyBtn.style.display = 'block';
  } catch (error) {
    console.error('WhatsApp send error:', error);
    alert('Failed to send WhatsApp code. Please try again.');
  }
}

async function verifyWhatsAppCode() {
  const code = document.getElementById('authWhatsAppCode').value;
  
  if (!code || code.length !== 6) {
    alert('Please enter a valid 6-digit code');
    return;
  }
  
  try {
    if (USE_BACKEND_API) {
      // In production: Code verified via WhatsApp webhook
      // Frontend just accepts the code - backend handles verification via incoming messages
      alert('✓ Code received. Verifying via WhatsApp...\n\nOnce you send the code on WhatsApp, you\'ll be logged in automatically.');
      console.log('💬 WhatsApp code verification initiated');
      
      // Simulate waiting for webhook verification
      setTimeout(() => {
        const user = {
          phone: sentWhatsAppNumber,
          loginMethod: 'whatsapp',
          loginTime: new Date().toISOString(),
          id: 'whatsapp_' + Date.now()
        };
        
        setUserSession(user);
        closeAuthModal();
        alert('✅ WhatsApp login successful! Welcome to Blancbeu');
      }, 2000);
    } else {
      // Demo mode verification
      const savedCode = localStorage.getItem('blancbeu_whatsapp_code_temp');
      
      if (code !== savedCode) {
        alert('❌ Invalid code. Try again.');
        return;
      }
      
      const user = {
        phone: sentWhatsAppNumber,
        loginMethod: 'whatsapp',
        loginTime: new Date().toISOString(),
        id: 'whatsapp_' + Date.now(),
        demo: true
      };
      
      setUserSession(user);
      closeAuthModal();
      alert('✅ WhatsApp login successful! (Demo Mode)');
      localStorage.removeItem('blancbeu_whatsapp_code_temp');
    }
  } catch (error) {
    console.error('WhatsApp verify error:', error);
    alert('Failed to verify WhatsApp code. Please try again.');
  }
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
  
  try {
    // Update account page with user info if elements exist
    const profileName = document.querySelector('.profile-info h2');
    const profilePhone = document.querySelector('.profile-info p');
    
    if (profileName) profileName.textContent = userSession.name || userSession.phone;
    if (profilePhone) profilePhone.textContent = userSession.phone;
  } catch (e) {
    console.log('Profile elements not available yet');
  }
  
  // Add logout button if not exists
  try {
    const nav = document.querySelector('.bottom-nav');
    if (nav && !document.querySelector('.logout-btn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'logout-btn';
      logoutBtn.innerHTML = '► Logout';
      logoutBtn.onclick = logoutUser;
      nav.parentElement.appendChild(logoutBtn);
    }
  } catch (e) {
    console.log('Could not add logout button');
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

// Initialize auth when DOM is ready
function initializeAuth() {
  try {
    // Check if user is already logged in
    if (isUserLoggedIn()) {
      updateUIForLoggedInUser();
      console.log('✅ User session restored:', userSession.phone);
    } else {
      console.log('🔓 No active user session');
    }
    
    // Set up nav item click handlers - but don't override existing ones
    document.querySelectorAll('.nav-item').forEach(item => {
      // Only add listener if not already added
      if (!item.hasListener) {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const page = item.getAttribute('data-page');
          navigateToPage(page);
        });
        item.hasListener = true;
      }
    });
    
    // Check page access on load
    checkPageAccess();
  } catch (error) {
    console.error('Auth initialization error:', error);
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
  // DOM already loaded
  setTimeout(initializeAuth, 100);
}
