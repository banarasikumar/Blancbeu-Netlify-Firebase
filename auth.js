import { auth, db } from './firebase-config.js';
import {
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    signOut,
    onAuthStateChanged,
    signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM Elements
const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModal');
const whatsappBtn = document.getElementById('whatsappLoginBtn');
const googleBtn = document.getElementById('googleLoginBtn');
const appleBtn = document.getElementById('appleLoginBtn');

// Profile Elements
const completeProfileModal = document.getElementById('completeProfileModal');
const completeProfileForm = document.getElementById('completeProfileForm');
const cancelProfileAuth = document.getElementById('cancelProfileAuth');

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
        window.open(url, '_blank');

        // We do not close the modal immediately so they can come back or we can show a "Check your phone" state? 
        // For now, let's close it after a sort delay as they leave the app
        setTimeout(() => {
            authModal.style.display = 'none';
        }, 1500);
    });
}

// Google Login Handler
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Profile check happens in onAuthStateChanged
            authModal.style.display = 'none';
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Login failed: " + error.message);
        }
    });
}

// Apple Login Handler
if (appleBtn) {
    appleBtn.addEventListener('click', async () => {
        // Need to configure Apple Sign In in Firebase Console first
        const provider = new OAuthProvider('apple.com');
        try {
            const result = await signInWithPopup(auth, provider);
            authModal.style.display = 'none';
        } catch (error) {
            console.error("Apple Login Error:", error);
            alert("Apple Sign In requires setup. Please use Google/WhatsApp for now.");
        }
    });
}

// Handle Profile Completion
if (completeProfileForm) {
    completeProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        const name = document.getElementById('profileName').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const dob = document.getElementById('profileDob').value;

        // Save to Firestore
        try {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email || null,
                phoneNumber: user.phoneNumber || null, // WhatsApp sets this
                displayName: name, // Custom name
                gender: gender,
                dob: dob,
                photoURL: user.photoURL || null,
                profileCompleted: true,
                createdAt: new Date(),
                lastLogin: new Date()
            }, { merge: true });

            // If name differs from Auth profile, update Auth profile too (optional but good)
            // await updateProfile(user, { displayName: name });

            completeProfileModal.style.display = 'none';
            alert(`Welcome to BlancBeu, ${name}!`);

            // Restore intended action
            restoreLoginState();

        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        }
    });
}

if (cancelProfileAuth) {
    cancelProfileAuth.addEventListener('click', async () => {
        await signOut(auth);
        completeProfileModal.style.display = 'none';
        window.location.reload();
    });
}

// Logout Global
window.logout = async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully");
        window.location.reload();
    } catch (error) {
        console.error("Logout error:", error);
    }
};


// --- Auth Logic & Profile Check ---

async function checkAndEnforceProfile(user) {
    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // New User -> Show Complete Profile Modal
            // But if it's Google, we might want to auto-create using Google data?
            // The request says "no need to ask when logging with google... we'll pick it from google"
            // So if Google, we create doc silently. If WhatsApp (no name), we show modal.

            const isGoogle = user.providerData.some(p => p.providerId === 'google.com');

            if (isGoogle) {
                // Auto-create profile from Google data
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    profileCompleted: true, // Assuming Google is enough
                    createdAt: new Date(),
                    lastLogin: new Date()
                });
                console.log("Auto-created profile from Google data");
            } else {
                // WhatsApp or Phone Auth -> Likely missing name/gender
                console.log("New Phone/WhatsApp User -> Enforcing Profile Completion");
                completeProfileModal.style.display = 'block';
            }
        } else {
            // Existing user
            const data = userDoc.data();
            if (!data.profileCompleted) {
                completeProfileModal.style.display = 'block';
            } else {
                console.log("Profile verified for:", data.displayName);
            }
        }

    } catch (error) {
        console.error("Error checking profile:", error);
        // Fallback: don't block user if DB fails? Or block?
        // For now, allow but log error.
    }
}

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Auth State: Logged In", user.uid);
        checkAndEnforceProfile(user);
    } else {
        console.log("Auth State: Logged Out");
    }
});


// --- Magic Link Logic ---
async function checkMagicLink() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
        console.log("Found magic link token...");
        try {
            const result = await signInWithCustomToken(auth, token);
            // URL Cleanup
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);

            if (authModal) authModal.style.display = 'none';
        } catch (error) {
            console.error("Magic link failed:", error);
            alert("Login link expired or invalid.");
        }
    }
}

// State Persistence
function saveLoginState(action = null) {
    const state = { path: window.location.pathname, action: action, timestamp: Date.now() };
    localStorage.setItem('login_redirect_state', JSON.stringify(state));
}

function restoreLoginState() {
    const stateJson = localStorage.getItem('login_redirect_state');
    if (!stateJson) return;
    try {
        const state = JSON.parse(stateJson);
        if (Date.now() - state.timestamp > 5 * 60 * 1000) {
            localStorage.removeItem('login_redirect_state');
            return;
        }
        if (state.action === 'openBookingModal') {
            setTimeout(() => document.dispatchEvent(new CustomEvent('open-booking-modal')), 500);
        }
        localStorage.removeItem('login_redirect_state');
    } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', checkMagicLink);

export function openLoginModal(pendingAction = null) {
    if (pendingAction) saveLoginState(pendingAction);
    authModal.style.display = 'block';
}
