import { auth } from './firebase-config.js';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
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
        const message = "Hi BlancBeu, please help me log in.";
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


// Export helpful functions
export function openLoginModal() {
    authModal.style.display = 'block';
}
