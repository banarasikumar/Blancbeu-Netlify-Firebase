// Minimal Staff App Script
import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const loadingScreen = document.getElementById('loading-screen');
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginBtn = document.getElementById('staff-login-btn');
const logoutBtn = document.getElementById('logout-btn');

document.addEventListener('DOMContentLoaded', () => {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/staff/sw.js')
            .then(reg => console.log('Staff SW registered', reg))
            .catch(err => console.error('Staff SW failed', err));
    }

    checkAuth();
});

function checkAuth() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // For now, allow any authenticated user to access staff for testing
            // TODO: Implement proper role check for 'staff'
            console.log('Staff User:', user.email);
            showDashboard();
        } else {
            showLogin();
        }
    });
}

function showLogin() {
    loadingScreen.style.display = 'none';
    dashboardContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
}

function showDashboard() {
    loadingScreen.style.display = 'none';
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
}

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed: " + error.message);
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await signOut(auth);
        window.location.reload();
    });
}
