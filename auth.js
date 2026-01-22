import { auth, db } from './firebase-config.js';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    signInWithCustomToken,
    updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// DOM Elements
const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModal');
const whatsappBtn = document.getElementById('whatsappLoginBtn');
const googleBtn = document.getElementById('googleLoginBtn');

// Profile form elements
const authLoginView = document.getElementById('authLoginView');
const authProfileView = document.getElementById('authProfileView');
const authProfileForm = document.getElementById('authProfileForm');
const skipProfileBtn = document.getElementById('skipProfileBtn');

// Track pending user data for profile completion
let pendingUserData = null;
let isProfileMandatory = false;

// --- Event Listeners ---

// Close Modal
if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', () => {
        if (!isProfileMandatory) {
            closeAuthModal();
        }
    });
}

// Close modal when clicking outside
if (authModal) {
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal && !isProfileMandatory) {
            closeAuthModal();
        }
    });
}

// WhatsApp Login Handler
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        const phoneNumber = "919229915277";
        const message = "*Hi BlancBeu, please help me log in.*\n\n_Send this message without editing_";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(url, '_blank');

        // Show a toast notification
        showToast('Check WhatsApp for your login link! 📱');

        // Close modal after a delay
        setTimeout(() => {
            closeAuthModal();
        }, 2000);
    });
}

// Google Login Handler
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("User logged in with Google:", user);

            // Save/update user profile in Firestore
            await saveUserProfile(user.uid, {
                name: user.displayName || '',
                email: user.email || '',
                photoURL: user.photoURL || '',
                provider: 'google',
                lastLogin: serverTimestamp()
            });

            showToast(`Welcome, ${user.displayName}! ✨`);
            closeAuthModal();

        } catch (error) {
            console.error("Google Login Error:", error);
            if (error.code === 'auth/popup-closed-by-user') {
                return;
            }
            if (error.code === 'auth/unauthorized-domain') {
                showToast("Login Failed: Domain not authorized in Firebase Console.", "error");
                alert("Error: This domain is not authorized for OAuth operations for your Firebase project. Please add it in the Firebase Console -> Authentication -> Settings -> Authorized Domains.");
            } else if (error.code === 'auth/configuration-not-found') {
                showToast("Login Failed: Firebase config missing.", "error");
                alert("Error: Firebase configuration not found. Please check your environment variables.");
            } else {
                showToast(`Login failed: ${error.message}`, "error");
            }
        }
    });
}



// Profile Form Submission
if (authProfileForm) {
    authProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(authProfileForm);
        const profileData = {
            name: formData.get('name'),
            gender: formData.get('gender'),
            dob: formData.get('dob')
        };

        // DOB Validation
        if (profileData.dob) {
            const dobDate = new Date(profileData.dob);
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const m = today.getMonth() - dobDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }

            if (age < 5) {
                showToast("You must be at least 5 years old.", "error");
                return;
            }
            if (dobDate > today) {
                showToast("Date of birth cannot be in the future.", "error");
                return;
            }
        }

        try {
            if (pendingUserData) {
                // Update Firebase Auth display name
                if (auth.currentUser) {
                    await updateProfile(auth.currentUser, {
                        displayName: profileData.name
                    });
                }

                // Save to Firestore
                await saveUserProfile(pendingUserData.uid, {
                    ...profileData,
                    phone: pendingUserData.phone || '',
                    provider: 'whatsapp',
                    profileCompleted: true,
                    lastLogin: serverTimestamp()
                });

                showToast(`Welcome, ${profileData.name}! 🎉`);
                pendingUserData = null;
                isProfileMandatory = false; // Reset
            }

            closeAuthModal();
            restoreLoginState();

        } catch (error) {
            console.error("Profile save error:", error);
            showToast("Failed to save profile. Please try again.", "error");
        }
    });
}

// Skip Profile Button - CHANGED TO LOGOUT IF MANDATORY OR HIDE
if (skipProfileBtn) {
    skipProfileBtn.addEventListener('click', () => {
        if (isProfileMandatory) {
            // Check if user wants to cancel login effectively
            if (confirm("Profile completion is required. Do you want to cancel login?")) {
                window.logout();
            }
            return;
        }

        if (pendingUserData) {
            // Save minimal profile
            saveUserProfile(pendingUserData.uid, {
                provider: 'whatsapp',
                phone: pendingUserData.phone || '',
                profileCompleted: false,
                lastLogin: serverTimestamp()
            });
            pendingUserData = null;
        }

        showToast("You can complete your profile later in Account settings.");
        closeAuthModal();
        restoreLoginState();
    });
}

// --- Helper Functions ---

function closeAuthModal() {
    if (isProfileMandatory) return; // Prevent closing if mandatory

    if (authModal) {
        authModal.style.display = 'none';
        authModal.classList.remove('active'); // Ensure active class removed
    }
    // Reset to login view
    if (authLoginView) authLoginView.style.display = 'block';
    if (authProfileView) authProfileView.style.display = 'none';
    if (authProfileForm) authProfileForm.reset();
    pendingUserData = null;
    isProfileMandatory = false;

    // Show/Hide buttons based on state reset
    if (closeAuthModalBtn) closeAuthModalBtn.style.display = 'flex';
    if (skipProfileBtn) skipProfileBtn.style.display = 'block';
}

function showProfileForm(userData, mandatory = false) {
    pendingUserData = userData;
    isProfileMandatory = mandatory;

    if (authLoginView) authLoginView.style.display = 'none';
    if (authProfileView) authProfileView.style.display = 'block';
    if (authModal) {
        authModal.style.display = 'flex';
        authModal.classList.add('active'); // Add active for animations
    }

    // UI Adjustments for mandatory mode
    if (mandatory) {
        if (closeAuthModalBtn) closeAuthModalBtn.style.display = 'none';
        if (skipProfileBtn) skipProfileBtn.style.display = 'none'; // Hide skip button
    } else {
        if (closeAuthModalBtn) closeAuthModalBtn.style.display = 'flex';
        if (skipProfileBtn) skipProfileBtn.style.display = 'block';
    }

    // Set Max Date for DOB (Minimum age 5 years)
    const dobInput = document.getElementById('profileDob');
    if (dobInput) {
        const today = new Date();
        const minAge = 5;
        const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

        // Format as YYYY-MM-DD
        const yyyy = maxDate.getFullYear();
        const mm = String(maxDate.getMonth() + 1).padStart(2, '0');
        const dd = String(maxDate.getDate()).padStart(2, '0');

        dobInput.max = `${yyyy}-${mm}-${dd}`;
    }
}

async function saveUserProfile(uid, data) {
    try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Update existing user
            await setDoc(userRef, {
                ...data,
                updatedAt: serverTimestamp()
            }, { merge: true });
        } else {
            // Create new user
            await setDoc(userRef, {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        console.log("User profile saved:", uid);
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw error;
    }
}

function showToast(message, type = "success") {
    // Remove existing toasts to prevent stacking overload
    const existingToasts = document.querySelectorAll('.auth-toast');
    existingToasts.forEach(t => t.remove());

    // Icons mapping
    const icons = {
        success: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>', // Bold Check
        error: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>', // Bold Warning
        logout: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>'
    };

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `auth-toast auth-toast-${type}`;
    toast.innerHTML = `
        <div class="auth-toast-content">
            <span class="auth-toast-icon">${icons[type] || icons.success}</span>
            <span class="auth-toast-message">${message}</span>
        </div>
        <div class="auth-toast-progress"></div>
    `;

    // Add Premium Styles
    if (!document.getElementById('auth-toast-styles-premium')) {
        const styles = document.createElement('style');
        styles.id = 'auth-toast-styles-premium';
        styles.textContent = `
            .auth-toast {
                position: fixed;
                top: 15%; /* Distinct Upper Center */
                left: 50%;
                transform: translate(-50%, -20px) scale(0.9);
                min-width: 350px;
                max-width: 90vw;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                overflow: hidden;
                z-index: 2147483647 !important; /* Max Z-Index */
                font-family: 'Poppins', sans-serif;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* Elastic Pop */
                pointer-events: none;
                border: 1px solid rgba(255, 255, 255, 0.4);
            }
            .auth-toast.show {
                transform: translate(-50%, 0) scale(1);
                opacity: 1;
                pointer-events: auto;
            }
            
            /* High Vibrancy Gradients */
            .auth-toast-success {
                background: linear-gradient(135deg, #00f260 0%, #0575e6 100%); /* Neon Green-Blue */
                color: white;
                box-shadow: 0 20px 60px -10px rgba(0, 242, 96, 0.4);
                border: 2px solid rgba(255,255,255,0.3);
            }
            .auth-toast-error {
                background: linear-gradient(135deg, #ff00cc 0%, #333399 100%); /* Neon Purple-Red */
                color: white;
                box-shadow: 0 20px 60px -10px rgba(255, 0, 204, 0.4);
                border: 2px solid rgba(255,255,255,0.3);
            }
            .auth-toast-logout {
                background: linear-gradient(135deg, #f12711 0%, #f5af19 100%); /* Vibrant Sunset */
                color: white;
                box-shadow: 0 20px 60px -10px rgba(245, 175, 25, 0.4);
                border: 2px solid rgba(255,255,255,0.3);
            }

            .auth-toast-content {
                display: flex;
                align-items: center;
                padding: 20px 30px;
                gap: 20px;
                justify-content: center;
            }

            .auth-toast-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.25);
                border-radius: 50%;
                width: 42px;
                height: 42px;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .auth-toast-icon svg {
                width: 24px;
                height: 24px;
                filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
            }

            .auth-toast-message {
                font-weight: 700; 
                font-size: 17px;
                letter-spacing: 0.3px;
                line-height: 1.4;
                text-shadow: 0 2px 4px rgba(0,0,0,0.15);
                text-align: left;
            }

            .auth-toast-progress {
                height: 5px;
                width: 100%;
                background: rgba(255,255,255,0.5);
                position: absolute;
                bottom: 0;
                left: 0;
                transform-origin: left;
                transform: scaleX(1);
                transition: transform 3s linear;
                box-shadow: 0 -1px 4px rgba(0,0,0,0.1);
            }
            
            @media (max-width: 480px) {
                .auth-toast {
                    top: 15%;
                    width: 92%;
                    min-width: auto;
                }
                .auth-toast-message {
                    font-size: 15px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(toast);

    // Force strict reflow to ensuring transition plays
    void toast.offsetWidth;

    // Trigger Animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
        const progress = toast.querySelector('.auth-toast-progress');
        if (progress) progress.style.transform = 'scaleX(0)';
    });

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Logout moved to a global function so it can be called from UI
window.logout = async () => {
    try {
        await signOut(auth);

        // Show Toast IMMEDIATELY before anything else
        showToast("See you soon! You've been logged out. 👋", "logout");
        console.log("Logout toast triggered");

        // Delay reload so the user can see the beautiful toast
        setTimeout(() => {
            console.log("Reloading page now...");
            window.location.reload();
        }, 2500); // 2.5 seconds specifically to let the user enjoy the toast
    } catch (error) {
        console.error("Logout error:", error);
        showToast("Error logging out", "error");
    }
};


// --- Auth State Observer ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Auth State: User is logged in", user.uid);
        updateUIForLogin(user);
    } else {
        console.log("Auth State: User is logged out");
        updateUIForLogout(user);
    }
});

function updateUIForLogin(user) {
    // Hide auth modal if open
    if (authModal && authModal.style.display !== 'none') {
        closeAuthModal();
    }

    // Force reload if on Account page to ensure AccountController picks up the state
    // The efficient way would be events, but for "nothing happens" fix, a reload is safest
    const isAccountPage = window.location.pathname.includes('/account') || document.querySelector('.account-page-container');
    if (isAccountPage) {
        console.log("On Account page, reloading to refresh state...");
        window.location.reload();
    } else {
        // Dispatch event for other listeners
        document.dispatchEvent(new CustomEvent('user-logged-in', { detail: user }));
        showToast(`Welcome back, ${user.displayName || 'Member'}! ✨`, "success");
    }
}

function updateUIForLogout(user) {
    // Reset UI if needed
}

// --- Magic Link Handler ---
async function checkMagicLink() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const isNewUser = params.get('isNewUser') === 'true';

    if (token) {
        console.log("Found magic link token, attempting login...");
        try {
            const result = await signInWithCustomToken(auth, token);
            const user = result.user;
            console.log("Magic link login success:", user.uid);

            // Clear token from URL without refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);

            // Check if this is a new user or profile is incomplete
            if (isNewUser) {
                // Extract phone from UID (format: wa:+XXXXXXXXXXXX)
                const phone = user.uid.replace('wa:', '');

                // Show profile completion form
                showProfileForm({
                    uid: user.uid,
                    phone: phone
                }, true); // Mandatory for new users

            } else {
                // Existing user - check if profile is complete
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (!userDoc.exists() || !userDoc.data().profileCompleted) {
                    const phone = user.uid.replace('wa:', '');
                    showProfileForm({
                        uid: user.uid,
                        phone: phone
                    }, false); // Not mandatory for existing users (optional, but encouraged)
                } else {
                    showToast("Welcome back! 👋");
                    restoreLoginState();
                }
            }

        } catch (error) {
            console.error("Magic link login error:", error);
            showToast("Login failed. The link may have expired.", "error");
        }
    }
}

// --- State Persistence ---
function saveLoginState(action = null) {
    const state = {
        path: window.location.pathname,
        action: action,
        timestamp: Date.now()
    };
    localStorage.setItem('login_redirect_state', JSON.stringify(state));
    console.log("Saved login state:", state);
}

function restoreLoginState() {
    const stateJson = localStorage.getItem('login_redirect_state');
    if (!stateJson) return;

    try {
        const state = JSON.parse(stateJson);
        const fiveMinutes = 5 * 60 * 1000;

        // Expire old state
        if (Date.now() - state.timestamp > fiveMinutes) {
            localStorage.removeItem('login_redirect_state');
            return;
        }

        console.log("Restoring login state:", state);

        // Handle Actions
        if (state.action === 'openBookingModal') {
            setTimeout(() => {
                const event = new CustomEvent('open-booking-modal');
                document.dispatchEvent(event);
            }, 500);
        }

        // Cleanup
        localStorage.removeItem('login_redirect_state');

    } catch (e) {
        console.error("Error restoring login state:", e);
    }
}


// Listen for custom login open events
document.addEventListener('open-login-modal', (e) => {
    const action = e.detail && e.detail.action ? e.detail.action : null;
    openLoginModal(action);
});

// Check on load
document.addEventListener('DOMContentLoaded', () => {
    checkMagicLink();
    checkTestRoute();
});

function checkTestRoute() {
    // Check if path is /t or /t/
    if (window.location.pathname === '/t' || window.location.pathname === '/t/') {
        console.log("Test route detected. Simulating new user...");

        // Generate random number ending in 4629
        // Format: 91 + 6 random digits + 4629
        const randomPrefix = Math.floor(100000 + Math.random() * 900000);
        const phoneNumber = `91${randomPrefix}4629`;
        const uid = `wa:${phoneNumber}`; // Simulate format

        console.log(`Simulated User: ${phoneNumber}`);

        // Show toast
        showToast("Debugging: Simulating New User Sign Up 🛠️");

        // Trigger mandatory profile form
        showProfileForm({
            uid: uid,
            phone: phoneNumber
        }, true);
    }
}


// Export helpful functions
export function openLoginModal(pendingAction = null) {
    if (pendingAction) {
        saveLoginState(pendingAction);
    }
    // Reset to login view with animation
    if (authLoginView) {
        authLoginView.style.display = 'block';
        authLoginView.classList.remove('fade-in-slide');
        void authLoginView.offsetWidth; // Trigger reflow
        authLoginView.classList.add('fade-in-slide');
    }
    if (authProfileView) authProfileView.style.display = 'none';
    if (authModal) authModal.style.display = 'flex';
}
