import { auth } from './firebase-config.js';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    signInWithCustomToken
} from "firebase/auth";


// DOM Elements
const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModal');
const whatsappBtn = document.getElementById('whatsappLoginBtn');
const googleBtn = document.getElementById('googleLoginBtn');

// --- Event Listeners ---

// Close Modal
if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
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

        // Note: Full magic link flow requires backend. 
        // For simulation, we could set a local flag or similar, 
        // but realistically users will use Google for managing the actual Firebase session for now.
        // Or we assume the "Agent" (Human) on WhatsApp will help them manually.

        // Optional: Close modal after a delay
        setTimeout(() => {
            authModal.style.display = 'none';
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
            alert(`Welcome back, ${user.displayName}!`);
            authModal.style.display = 'none';

        } catch (error) {
            console.error("Google Login Error:", error);
            // Handle specific error codes if needed
            alert("Login failed: " + error.message);
        }
    });
}

// Logout moved to a global function so it can be called from UI
window.logout = async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully");
        window.location.reload(); // Refresh to update UI cleanly
    } catch (error) {
        console.error("Logout error:", error);
    }
};


// --- Auth State Observer ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("Auth State: User is logged in", user.uid);
        updateUIForLogin(user);
    } else {
        // User is signed out
        console.log("Auth State: User is logged out");
        updateUIForLogout(user);
    }
});

function updateUIForLogin(user) {
    // Example: Update "Account" Nav Item or Header
    // For now, we rely on the generic app logic to redirect/show content
}

function updateUIForLogout(user) {
    // Reset UI if needed
}

// --- Magic Link Handler ---
async function checkMagicLink() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
        console.log("Found magic link token, attempting login...");
        try {
            const result = await signInWithCustomToken(auth, token);
            console.log("Magic link login success:", result.user.uid);

            // Clear token from URL without refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);

            alert("Successfully logged in via WhatsApp!");

            if (authModal) authModal.style.display = 'none';

            // Restore previous state (e.g. open booking modal)
            restoreLoginState();

        } catch (error) {
            console.error("Magic link login error:", error);
            alert("Login failed. The link may have expired or verified already.");
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
            // Wait a bit for DOM to be ready if needed, implies we function effectively
            // But we are in module scope, dispatching event is safer
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


// Check on load
document.addEventListener('DOMContentLoaded', checkMagicLink);


// Export helpful functions
export function openLoginModal(pendingAction = null) {
    if (pendingAction) {
        saveLoginState(pendingAction);
    }
    authModal.style.display = 'block';
}
