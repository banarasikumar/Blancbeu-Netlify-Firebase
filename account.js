import { db, auth } from './firebase-config.js';
import { collection, query, where, getCountFromServer, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
}

async function loadAccountData(user) {
    const accountSection = document.getElementById('account');
    if (!accountSection) return;

    // 1. Update Profile Card
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const profileAvatar = document.querySelector('.profile-avatar');

    if (profileName) profileName.textContent = user.displayName || "Valued Customer";
    if (profileEmail) profileEmail.textContent = user.email || "No email linked";

    if (profileAvatar && user.photoURL) {
        profileAvatar.innerHTML = `<img src="${user.photoURL}" alt="User" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    }

    // 2. Load Stats (real bookings count)
    // Loyalty points and reviews are mocked for now as we don't have those collections yet.
    try {
        const bookingsColl = collection(db, "bookings");
        const q = query(bookingsColl, where("userId", "==", user.uid));
        const snapshot = await getCountFromServer(q);
        const count = snapshot.data().count;

        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 2) {
            statValues[1].textContent = count; // Accessing by index based on HTML structure: 0=Points, 1=Bookings, 2=Reviews
        }
    } catch (error) {
        console.error("Error loading account stats:", error);
    }
}

function initAccountPage() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        // Remove old listeners to avoid duplicates if re-init
        const newBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);

        newBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to sign out?")) {
                signOut(auth).then(() => {
                    alert("Signed out successfully");
                    window.location.hash = "#home"; // Redirect to home
                    // window.location.reload(); // Optional, but usually safer
                }).catch((error) => {
                    console.error("Sign Out Error", error);
                });
            }
        });
    }
}

// Auth Listener
onAuthStateChanged(auth, (user) => {
    const accountSection = document.getElementById('account');
    if (!accountSection) return;

    if (user) {
        // User is logged in
        // We assume the HTML structure exists (from index.html) and we just fill it.
        // If it was hidden/login-wall-ed, we'd reveal it here.
        loadAccountData(user);
    } else {
        // User is logged out
        // Replace content with login prompt or redirect
        // For this app, let's just show a simple login state in the profile card
        const profileName = document.querySelector('.profile-name');
        const profileEmail = document.querySelector('.profile-email');
        const profileAvatar = document.querySelector('.profile-avatar');

        if (profileName) profileName.textContent = "Guest User";
        if (profileEmail) profileEmail.textContent = "Please sign in";
        if (profileAvatar) profileAvatar.innerHTML = '<div class="avatar-placeholder">👤</div>';

        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(el => el.textContent = "-");

        // Make the edit button trigger login
        const editBtn = document.querySelector('.edit-profile-btn');
        if (editBtn) {
            editBtn.onclick = () => document.dispatchEvent(new Event('open-login-modal'));
        }
    }
});

// Run once on load
document.addEventListener('DOMContentLoaded', initAccountPage);
