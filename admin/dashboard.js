import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { collection, getCountFromServer } from "firebase/firestore";

console.log("Admin: dashboard.js loaded");

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginBtn = document.getElementById('admin-login-btn');
const welcomeMsg = document.querySelector('.welcome-card p');
const gridActions = document.querySelector('.grid-actions');

// Timeout to detect if Auth never fires
setTimeout(() => {
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.warn("Admin: Auth check timed out or is very slow.");
    }
}, 5000);

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
    console.log("Admin: Auth State Changed", user);
    if (user) {
        showDashboard(user);
        loadDashboardStats(); // Load data
    } else {
        showLogin();
    }

    // Hide loading screen
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
});

function showDashboard(user) {
    if (authContainer) authContainer.classList.add('hidden');
    if (dashboardContainer) dashboardContainer.classList.remove('hidden');

    if (welcomeMsg) {
        // Use user's name
        welcomeMsg.innerHTML = `Logged in as <strong>${user.displayName || user.email}</strong>`;
    }
}

function showLogin() {
    if (dashboardContainer) dashboardContainer.classList.add('hidden');
    if (authContainer) authContainer.classList.remove('hidden');
}

// Stats Loading Logic
async function loadDashboardStats() {
    if (!gridActions) return;

    // Show skeleton/loading state
    gridActions.innerHTML = '<div style="text-align:center; width:100%; padding:20px; color:#888;">Loading stats... <div class="spinner" style="width:20px; height:20px; display:inline-block; vertical-align:middle;"></div></div>';

    try {
        // Fetch real counts from Firestore
        // Note: aggregations require Firestore index or small dataset, usually fast
        const usersSnap = await getCountFromServer(collection(db, "users"));
        // Assuming 'bookings' is the collection name
        const bookingsSnap = await getCountFromServer(collection(db, "bookings"));

        const userCount = usersSnap.data().count;
        const bookingCount = bookingsSnap.data().count;

        // Render Stats Cards
        gridActions.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon" style="background:rgba(10, 132, 255, 0.1); color:#0A84FF">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">${userCount}</div>
                    <div class="stat-label">Total Users</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background:rgba(48, 209, 88, 0.1); color:#30D158">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">${bookingCount}</div>
                    <div class="stat-label">Bookings</div>
                </div>
            </div>
            
            <div class="section-title" style="grid-column: 1 / -1; margin-top: 10px;">Quick Actions</div>
            
            <div class="quick-actions-grid" style="grid-column: 1 / -1;">
                <button class="action-btn" onclick="alert('Navigate to Bookings')">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Bookings</span>
                </button>
                <button class="action-btn" onclick="alert('Navigate to Users')">
                    <i class="fas fa-user-shield"></i>
                    <span>Users</span>
                </button>
                 <button class="action-btn" onclick="window.logout()">
                    <i class="fas fa-sign-out-alt" style="color:#FF3B30"></i>
                    <span>Logout</span>
                </button>
            </div>
        `;

    } catch (error) {
        console.error("Error loading stats:", error);
        gridActions.innerHTML = `<div style="color:red; padding:10px;">Error loading stats: ${error.message}</div>`;
    }
}

// Login Handler
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed: " + error.message);
        }
    });
}

// Logout Global
window.logout = async () => {
    if (confirm("Are you sure you want to logout?")) {
        try {
            await signOut(auth);
            console.log("Logged out");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
};

// Menu Toggle
const menuBtn = document.getElementById('menu-btn');
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        alert("Sidebar Menu functionality coming soon!");
    });
}
