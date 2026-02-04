
// Import Firebase Config from the parent directory
import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import {
    doc, getDoc, setDoc,
    collection, query, orderBy, limit, onSnapshot, updateDoc
} from "firebase/firestore";

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginBtn = document.getElementById('admin-login-btn');
const contentArea = document.querySelector('.content-area');
const navItems = document.querySelectorAll('.nav-item');

// State
let currentUser = null;
let bookingsUnsubscribe = null;

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthContext();
    initNavigation();
});

// --- Auth Logic ---
function checkAuthContext() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('User detected:', user.email);
            loadingScreen.style.display = 'flex';

            try {
                const isAdmin = await verifyAdminRole(user.uid);

                if (isAdmin) {
                    currentUser = user;
                    showDashboard();
                } else {
                    console.warn("Access Denied: User role is not admin.");
                    alert("🚫 Access Denied\n\nYou do not have permission to access the Admin Panel.");
                    await signOut(auth);
                    showLogin();
                }
            } catch (error) {
                console.error("Auth verification failed:", error);
                alert("Auth verification failed: " + error.message);
                showLogin();
            }
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

    // Default to Home View
    navigateTo('home');

    // Start Listening for Data
    initBookingListener();
    initUserListener();
}

// Event Listeners for Login
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

// Check Firestore for 'role: admin'
async function verifyAdminRole(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.role === 'admin') return true;

            // Safety net for super admins
            const superAdmins = ['banarasikumar@gmail.com', 'banarasikumarsahu@gmail.com', 'admin@blancbeu.com', 'banz3949@gmail.com', 'blancbeu07@gmail.com', 'rinak2645@gmail.com'];
            if (data.email && superAdmins.includes(data.email)) {
                await setDoc(docRef, { role: 'admin' }, { merge: true });
                return true;
            }
        }
        return false;
    } catch (e) {
        console.error("Error verifying admin role:", e);
        return false;
    }
}

// --- Navigation Logic ---
function initNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.dataset.target;

            // Update Active State
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            navigateTo(target);
        });
    });
}

function navigateTo(view) {
    // Clear content
    contentArea.innerHTML = '';

    switch (view) {
        case 'home':
            renderHomeView();
            break;
        case 'bookings':
            renderBookingsView();
            break;
        case 'users':
            renderUsersView();
            break;
        case 'settings':
            renderSettingsView();
            break;
        default:
            renderHomeView();
    }
}

// --- Views & Renderers ---

function renderHomeView() {
    // --- ELEGANT ART BACKGROUND LAYOUT ---
    contentArea.innerHTML = `
        <!-- Fixed Artistic Background -->
        <div class="art-background-layer">
            <div class="art-blob-top"></div>
            <div class="art-blob-bottom"></div>
        </div>

        <!-- Scrollable Content -->
        <div class="dashboard-content-wrapper" style="padding:0 4px;">
            <div class="hero-section">
                <div class="hero-content">
                    <span class="brand-badge" style="margin-bottom:8px; display:inline-block; font-size:10px; font-weight:700; color:white; background:rgba(255,255,255,0.2); padding:4px 10px; border-radius:12px;">BLANCBEU SALON</span>
                    <h1 style="font-size:28px; font-weight:800; margin:0 0 6px 0; letter-spacing:-0.5px; color:white;">Hello, ${(currentUser?.displayName || 'Admin').split(' ')[0]}</h1>
                    <p style="font-size:15px; color:rgba(255,255,255,0.8); margin:0; font-weight:500;">Overview for today.</p>
                </div>
            </div>

            <div style="margin-bottom:32px;">
                <h3 style="font-size:18px; font-weight:700; color:#1C1C1E; margin-bottom:16px;">Overview</h3>
                <div id="stats-grid-container"></div>
            </div>

            <div>
                <h3 style="font-size:18px; font-weight:700; color:#1C1C1E; margin-bottom:16px;">Quick Actions</h3>
                <div id="actions-grid-container"></div>
            </div>
        </div>
    `;

    // Populate Components
    renderDashboardStats(
        document.getElementById('stats-grid-container'),
        document.getElementById('actions-grid-container')
    );
}

function renderDashboardStats(statsContainer, actionsContainer) {
    // Stats Grid
    statsContainer.innerHTML = `
        <div class="stat-grid-premium">
            <!-- Bookings Card -->
            <div class="stat-card-premium" onclick="window.navigateTo('bookings')">
                <div class="stat-icon-wrapper" style="background:#E1F0FF; color:#0A84FF;">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-value-lg" id="stat-bookings">--</div>
                <div class="stat-label-sm">Total Bookings</div>
            </div>

            <!-- Users Card -->
            <div class="stat-card-premium" onclick="window.navigateTo('users')">
                <div class="stat-icon-wrapper" style="background:#E3F9E5; color:#30D158;">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-value-lg" id="stat-users">--</div>
                <div class="stat-label-sm">Active Users</div>
            </div>

            <!-- Pending Card -->
            <div class="stat-card-premium" onclick="window.navigateTo('bookings'); setTimeout(() => window.switchTab('unfinished'), 100);">
                <div class="stat-icon-wrapper" style="background:#FFF0D6; color:#FF9F0A;">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-value-lg" id="stat-pending">--</div>
                <div class="stat-label-sm">Pending Appts</div>
            </div>

            <!-- Rating Card -->
            <div class="stat-card-premium">
                <div class="stat-icon-wrapper" style="background:#F2E6FF; color:#BF5AF2;">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-value-lg" id="stat-rating">4.9</div>
                <div class="stat-label-sm">Avg Rating</div>
            </div>
        </div>
    `;

    // Actions Grid
    if (actionsContainer) {
        actionsContainer.innerHTML = `
            <div class="action-grid-premium">
                <button class="action-btn-premium" onclick="window.handleFeatureNotImplemented('Add Service')">
                    <div class="action-icon-circle" style="background:#007AFF; color:white;">
                        <i class="fas fa-plus"></i>
                    </div>
                    <span>Service</span>
                </button>
                <button class="action-btn-premium" onclick="window.handleFeatureNotImplemented('Add Staff')">
                    <div class="action-icon-circle" style="background:#34C759; color:white;">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <span>Staff</span>
                </button>
                <button class="action-btn-premium" onclick="window.handleFeatureNotImplemented('Notify')">
                    <div class="action-icon-circle" style="background:#5856D6; color:white;">
                       <i class="fas fa-bullhorn"></i>
                    </div>
                    <span>Notify</span>
                </button>
                <button class="action-btn-premium" onclick="window.handleFeatureNotImplemented('Reports')">
                    <div class="action-icon-circle" style="background:#FF2D55; color:white;">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <span>Reports</span>
                </button>
            </div>
        `;
    }

    // Attempt to update stats if data is already loaded
    updateDashboardStats();
}

// --- BOOKINGS VIEW ---
// --- DATE HELPER ---
function formatFirestoreDate(dateField) {
    if (!dateField) return 'N/A';

    // Case 1: Firestore Timestamp
    if (dateField.seconds) {
        return new Date(dateField.seconds * 1000).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
    }

    // Case 2: String Date
    const d = new Date(dateField);
    if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
    }

    // Fallback: Return raw string to see what's wrong, or just "N/A" if it looks ugly
    return String(dateField);
}

// --------------------------------------------------------------------------------
// --- NEW BOOKING LOGIC (TABS, SWIPES, NO LIMITS) ---
// --------------------------------------------------------------------------------

window.currentSort = 'createdAt';
window.currentTab = 'unfinished';
window.allBookings = [];

// History Tab State
window.historyState = {
    searchQuery: '',
    dateRange: { start: null, end: null },
    statusFilter: 'all', // all, completed, cancelled, declined
    currentPage: 1,
    itemsPerPage: 50
};

// 1. Render Main View
// 1. Render Main View
function renderBookingsView() {
    // Dynamically get controls for the current tab (Unfinished or History)
    const controlsHtml = getHistoryControlsHtml();

    // Pagination is currently only for history, or maybe we want it for both? 
    // Logic in switchTab handles it tailored for 'finished'. 
    // We'll keep the placeholder logic consistent.
    const isHistory = window.currentTab === 'finished';

    contentArea.innerHTML = `
        <div class="view-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2 class="view-title" style="margin:0;">Bookings</h2>
             <select id="sortBookings" onchange="window.sortBookings(this.value)" style="padding:6px 10px; border-radius:8px; border:1px solid #eee; background:white; font-size:12px; font-weight:600; color:#333;">
                <option value="createdAt" ${window.currentSort === 'createdAt' ? 'selected' : ''}>Recent</option>
                <option value="date" ${window.currentSort === 'date' ? 'selected' : ''}>Appointment Date</option>
                <option value="userName" ${window.currentSort === 'userName' ? 'selected' : ''}>Client Name</option>
            </select>
        </div>

        <!-- Segmented Control Tabs -->
        <div class="segmented-control">
            <button class="segment-btn ${window.currentTab === 'unfinished' ? 'active' : ''}" onclick="window.switchTab('unfinished')">
                Unfinished
            </button>
            <button class="segment-btn ${window.currentTab === 'finished' ? 'active' : ''}" onclick="window.switchTab('finished')">
                History
            </button>
        </div>

        ${controlsHtml}

        <div id="bookings-list" class="bookings-list" style="overflow-x:hidden; min-height:400px; padding-bottom:100px;">
            <div class="spinner" style="margin:20px auto"></div>
        </div>
        
        <div id="pagination-controls" style="padding: 20px 0; text-align: center;"></div>
    `;

    if (window.allBookings && window.allBookings.length > 0) {
        sortAndRenderBookings();
    } else {
        // Wait for listener...
    }
}

function renderFilterChip(label, value) {
    const isActive = window.historyState.statusFilter === value;

    // Determine Colors
    let activeColor = '#0A84FF'; // Default Blue
    if (value === 'completed') activeColor = '#34C759'; // Green
    if (value === 'cancelled') activeColor = '#FF3B30'; // Red
    if (value === 'confirmed') activeColor = '#30D158'; // Vibrant Green
    if (value === 'pending') activeColor = '#FF9F0A'; // Orange
    if (value === 'overdue') activeColor = '#FF453A'; // Red/Pink

    const bg = isActive ? activeColor : 'white';
    const border = isActive ? activeColor : '#E5E5EA';
    const color = isActive ? 'white' : '#1C1C1E';

    return `
        <button class="filter-chip ${isActive ? 'active' : ''}" 
                onclick="window.setHistoryFilter('${value}')"
                style="padding:6px 12px; border-radius:15px; border:1px solid ${border}; background:${bg}; color:${color}; font-size:12px; font-weight:600; white-space:nowrap; cursor:pointer; transition:all 0.2s;">
            ${label}
        </button>
    `;
}

// 2. Tab Switching
window.switchTab = (tabName) => {
    window.currentTab = tabName;
    document.querySelectorAll('.segment-btn').forEach(btn => btn.classList.remove('active'));

    // Set active
    const btns = document.querySelectorAll('.segment-btn');
    if (tabName === 'unfinished' && btns[0]) btns[0].classList.add('active');
    if (tabName === 'finished' && btns[1]) btns[1].classList.add('active');

    // Reset Filter State on Tab Switch
    window.historyState = {
        statusFilter: 'all',
        searchQuery: '',
        dateRange: { start: null, end: null },
        currentPage: 1,
        itemsPerPage: 50
    };

    // Re-render Controls (Remove old, inject new based on tab)
    const segControl = document.querySelector('.segmented-control');
    const existingControls = document.querySelector('.history-controls');
    if (existingControls) existingControls.remove();

    if (segControl) {
        const controlsHtml = getHistoryControlsHtml();
        segControl.insertAdjacentHTML('afterend', controlsHtml);
    }

    const existingPagination = document.getElementById('pagination-controls');
    if (tabName === 'finished') {
        if (!existingPagination) {
            const list = document.getElementById('bookings-list');
            if (list) list.insertAdjacentHTML('afterend', '<div id="pagination-controls" style="padding: 20px 0; text-align: center;"></div>');
        }
    } else {
        if (existingPagination) existingPagination.remove();
    }

    // Show Loading Animation
    const container = document.getElementById('bookings-list');
    if (container) {
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:300px; animation:fadeIn 0.3s ease;">
                <video src="/assets/animations/loading_dots_in_yellow.webm" autoplay loop muted playsinline style="width: 60px; height: 60px; opacity:0.8;"></video>
            </div>
        `;
    }

    // Delay render to simulate refresh
    setTimeout(() => {
        sortAndRenderBookings();
    }, 400);
}

// 4. Main Filter & Sort
function sortAndRenderBookings() {
    if (!window.allBookings) return;

    const currentTab = window.currentTab;
    const { statusFilter, searchQuery, dateRange } = window.historyState;
    const now = new Date();

    // A. Filter Logic (Consolidated)
    let filtered = window.allBookings.filter(b => {
        // 1. UI Override (Animations)
        if (window.uiOverrides && window.uiOverrides[b.id]) return true;

        const s = (b.status || 'pending').toLowerCase();

        // 2. Tab Scoping (Base Set)
        let inScope = false;
        if (currentTab === 'unfinished') {
            inScope = ['pending', 'confirmed'].includes(s);
        } else {
            inScope = ['completed', 'cancelled', 'declined'].includes(s);
        }
        if (!inScope) return false;

        // 3. Status Filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'overdue') {
                if (s !== 'pending') return false; // Only pending can be overdue

                // Parse date for overdue check
                let bookingTs = getBookingTimestamp(b);
                if (bookingTs > now.getTime()) return false; // Future is not overdue
            } else {
                if (s !== statusFilter) return false;
            }
        }

        // 4. Search Filter
        if (searchQuery) {
            const searchStr = `${b.id} ${b.userName} ${b.userEmail} ${b.userPhone || ''} ${JSON.stringify(b.services || '')} ${JSON.stringify(b.servicesList || '')}`.toLowerCase();
            if (!searchStr.includes(searchQuery)) return false;
        }

        // 5. Date Range Filter
        if (dateRange.start || dateRange.end) {
            let bookingTs = getBookingTimestamp(b);

            if (dateRange.start) {
                const startTs = new Date(dateRange.start).setHours(0, 0, 0, 0);
                if (bookingTs < startTs) return false;
            }
            if (dateRange.end) {
                const endTs = new Date(dateRange.end).setHours(23, 59, 59, 999);
                if (bookingTs > endTs) return false;
            }
        }

        return true;
    });

    // B. Sort
    filtered.sort((a, b) => {
        if (window.currentSort === 'createdAt') {
            const timeA = a.createdAt?.seconds || new Date(a.createdAt).getTime() || 0;
            const timeB = b.createdAt?.seconds || new Date(b.createdAt).getTime() || 0;
            return timeB - timeA;
        }
        if (window.currentSort === 'date') {
            return getBookingTimestamp(a) - getBookingTimestamp(b);
        }
        if (window.currentSort === 'userName') {
            return (a.userName || '').localeCompare(b.userName || '');
        }
        return 0;
    });

    // C. Pagination (Only for History so far, unless we want it for all?)
    let paginated = filtered;
    if (window.currentTab === 'finished') {
        const page = window.historyState.currentPage;
        const perPage = window.historyState.itemsPerPage;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        paginated = filtered.slice(start, end);

        // Update Counter
        const counter = document.getElementById('history-counter');
        if (counter) counter.innerHTML = `<span>Showing ${Math.min(start + 1, filtered.length)}-${Math.min(end, filtered.length)} of ${filtered.length} results</span>`;

        renderPagination(filtered.length);
    } else {
        // Update Counter for Unfinished too!
        const counter = document.getElementById('history-counter');
        if (counter) counter.innerHTML = `<span>Showing ${filtered.length} results</span>`;
    }

    renderBookingListItems(paginated);
}

// Helper for timestamp parsing
function getBookingTimestamp(b) {
    if (b.date) {
        if (b.date.seconds) return b.date.seconds * 1000;
        else if (typeof b.date === 'string' && b.date.includes('-')) {
            const [day, m, y] = b.date.split('-');
            return new Date(y, m - 1, day).getTime();
        } else {
            return new Date(b.date).getTime();
        }
    } else {
        return b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
    }
}
// 2. Tab Switching
window.switchTab = (tabName) => {
    window.currentTab = tabName;
    document.querySelectorAll('.segment-btn').forEach(btn => btn.classList.remove('active'));

    // Set active
    const btns = document.querySelectorAll('.segment-btn');
    if (tabName === 'unfinished' && btns[0]) btns[0].classList.add('active');
    if (tabName === 'finished' && btns[1]) btns[1].classList.add('active');

    // Reset Filter State on Tab Switch to prevent confusion
    window.historyState = {
        statusFilter: 'all',
        searchQuery: '',
        dateRange: { start: null, end: null },
        currentPage: 1,
        itemsPerPage: 50
    };

    // Re-render Controls (Remove old, inject new based on tab)
    const segControl = document.querySelector('.segmented-control');
    const existingControls = document.querySelector('.history-controls');
    if (existingControls) existingControls.remove();

    if (segControl) {
        // ALWAYS inject controls now (for both tabs)
        const controlsHtml = getHistoryControlsHtml();
        segControl.insertAdjacentHTML('afterend', controlsHtml);
    }

    // Handle Pagination visibility (Only for Finished?) 
    // User didn't explicitly ask for pagination on Unfinished, but typically Unfinished list is smaller.
    // Let's keep pagination only for History for now unless requested.
    const existingPagination = document.getElementById('pagination-controls');
    if (tabName === 'finished') {
        if (!existingPagination) {
            const list = document.getElementById('bookings-list');
            if (list) list.insertAdjacentHTML('afterend', '<div id="pagination-controls" style="padding: 20px 0; text-align: center;"></div>');
        }
    } else {
        if (existingPagination) existingPagination.remove();
    }

    // Show Loading Animation
    const container = document.getElementById('bookings-list');
    if (container) {
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:300px; animation:fadeIn 0.3s ease;">
                <video src="/assets/animations/loading_dots_in_yellow.webm" autoplay loop muted playsinline style="width: 60px; height: 60px; opacity:0.8;"></video>
            </div>
        `;
    }

    // Delay render to simulate refresh
    setTimeout(() => {
        sortAndRenderBookings();
    }, 400);
}

// Helper to generate controls HTML
// Helper to generate controls HTML
function getHistoryControlsHtml() {
    // Dynamic label for date range
    let dateLabel = 'Date Range';
    const range = window.historyState.dateRange;
    if (range && range.start && range.end) {
        const fmt = d => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' });
        dateLabel = `${fmt(range.start)} - ${fmt(range.end)}`;
    }

    // Tab-Specific Logic
    const isUnfinished = window.currentTab === 'unfinished';
    const today = new Date().toISOString().split('T')[0];
    const maxDateAttr = isUnfinished ? '' : `max="${today}"`; // Only restrict history

    let filtersHtml = '';
    if (isUnfinished) {
        filtersHtml = `
            ${renderFilterChip('All', 'all')}
            ${renderFilterChip('Confirmed', 'confirmed')}
            ${renderFilterChip('Pending', 'pending')}
            ${renderFilterChip('Overdue', 'overdue')}
        `;
    } else {
        filtersHtml = `
            ${renderFilterChip('All', 'all')}
            ${renderFilterChip('Completed', 'completed')}
            ${renderFilterChip('Cancelled', 'cancelled')}
        `;
    }

    return `
        <div class="history-controls" style="margin-bottom: 20px; animation: fadeIn 0.3s ease;">
            <!-- Search & Sort Row -->
            <div class="control-row" style="display:flex; gap:10px; margin-bottom:12px;">
                <div class="search-bar" style="flex:1; position:relative;">
                    <i class="fas fa-search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#8E8E93;"></i>
                    <input type="text" placeholder="Search name, ID, service..." 
                           value="${window.historyState ? window.historyState.searchQuery : ''}"
                           oninput="window.handleHistorySearch(this.value)"
                           style="width:100%; padding:10px 10px 10px 36px; border-radius:10px; border:1px solid #E5E5EA; background:#F2F2F7; font-size:14px;">
                </div>
            </div>

            <!-- Filters Row -->
            <div class="filter-row" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; align-items:center;">
                ${filtersHtml}
                
                <button class="filter-chip ${range.start ? 'active' : ''}" onclick="window.toggleDateRangePicker()" 
                        style="border:1px dashed ${range.start ? '#0A84FF' : '#ccc'}; background:${range.start ? '#0A84FF' : 'white'}; color:${range.start ? 'white' : '#1C1C1E'}; padding:6px 12px; border-radius:15px; font-size:12px; font-weight:600; cursor:pointer; white-space:nowrap;">
                    <i class="fas fa-calendar-alt"></i> ${dateLabel}
                </button>
            </div>
            
             <!-- Result Counter -->
            <div id="history-counter" style="font-size:12px; color:#8E8E93; margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                <span>Showing results...</span>
            </div>

            <!-- PREMIUM MODAL PICKER -->
            <div id="date-range-panel" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; backdrop-filter:blur(4px); animation:fadeIn 0.2s ease;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:24px; border-radius:24px; width:85%; max-width:320px; box-shadow:0 20px 60px rgba(0,0,0,0.3); animation:scaleIn 0.2s ease;">
                    
                    <div style="text-align:center; margin-bottom:20px;">
                        <h3 style="font-size:18px; font-weight:700; color:#1C1C1E; margin:0 0 4px 0;">Select Dates</h3>
                        <p style="font-size:13px; color:#8E8E93; margin:0;">Filter bookings by appointment date</p>
                    </div>

                    <!-- VERTICAL STACKING FOR MOBILE -->
                    <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#8E8E93; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">From</label>
                            <input type="date" id="date-start" value="${range.start || ''}" ${maxDateAttr}
                                   style="width:100%; height:48px; border:1px solid #E5E5EA; border-radius:12px; padding:0 12px; font-size:16px; background:#F9F9F9; outline:none; color:#1C1C1E; font-family:inherit;">
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#8E8E93; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">To</label>
                            <input type="date" id="date-end" value="${range.end || ''}" ${maxDateAttr}
                                   style="width:100%; height:48px; border:1px solid #E5E5EA; border-radius:12px; padding:0 12px; font-size:16px; background:#F9F9F9; outline:none; color:#1C1C1E; font-family:inherit;">
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                         <button onclick="window.toggleDateRangePicker()" style="padding:14px; color:#1C1C1E; background:#F2F2F7; border:none; border-radius:14px; font-size:15px; font-weight:600; cursor:pointer;">Cancel</button>
                         <button onclick="window.applyDateFilter()" style="padding:14px; background:#007AFF; color:white; border:none; border-radius:14px; font-size:15px; font-weight:600; cursor:pointer; box-shadow:0 4px 12px rgba(0,122,255,0.3);">Apply</button>
                    </div>
                     <button onclick="window.clearDateFilter()" style="width:100%; margin-top:12px; padding:10px; color:#FF3B30; background:none; border:none; font-size:14px; font-weight:500; cursor:pointer;">Clear Filter</button>
                </div>
            </div>
        </div>
    `;
}

// 3. Sorting Handler
window.sortBookings = (criteria) => {
    window.currentSort = criteria;
    sortAndRenderBookings();
};

// --- HISTORY ACTIONS ---
window.handleHistorySearch = (value) => {
    window.historyState.searchQuery = value.toLowerCase();
    window.historyState.currentPage = 1; // Reset to page 1
    sortAndRenderBookings();
}

window.setHistoryFilter = (status) => {
    window.historyState.statusFilter = status;
    window.historyState.currentPage = 1;

    // Update UI for chips (Re-render controls to reflect active state)
    const controlsContainer = document.querySelector('.history-controls');
    if (controlsContainer) {
        controlsContainer.outerHTML = getHistoryControlsHtml();
    }

    sortAndRenderBookings(); // Re-render list
}

window.toggleDateRangePicker = () => {
    const panel = document.getElementById('date-range-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
};

window.applyDateFilter = () => {
    const start = document.getElementById('date-start').value;
    const end = document.getElementById('date-end').value;

    if (!start && !end) {
        alert("Please select a date.");
        return;
    }

    try {
        window.historyState.dateRange.start = start ? new Date(start).toISOString() : null;
        window.historyState.dateRange.end = end ? new Date(end).toISOString() : null;

        // Force UI update
        const controlsContainer = document.querySelector('.history-controls');
        if (controlsContainer) controlsContainer.outerHTML = getHistoryControlsHtml();

        sortAndRenderBookings();
    } catch (e) {
        alert("Invalid Date Selection");
    }
};

window.clearDateFilter = () => {
    window.historyState.dateRange.start = null;
    window.historyState.dateRange.end = null;

    // UI Update
    const controlsContainer = document.querySelector('.history-controls');
    if (controlsContainer) controlsContainer.outerHTML = getHistoryControlsHtml();

    sortAndRenderBookings();
};

window.changePage = (newPage) => {
    window.historyState.currentPage = newPage;
    sortAndRenderBookings();
    // Scroll to top of list
    document.getElementById('bookings-list')?.scrollIntoView({ behavior: 'smooth' });
}

// 4. Main Filter & Sort


function renderPagination(totalItems) {
    const container = document.getElementById('pagination-controls');
    if (!container) return;

    const totalPages = Math.ceil(totalItems / window.historyState.itemsPerPage);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    const current = window.historyState.currentPage;

    container.innerHTML = `
        <div style="display:inline-flex; gap:10px; align-items:center;">
            <button onclick="window.changePage(${current - 1})" ${current === 1 ? 'disabled' : ''} style="padding:8px 16px; border-radius:8px; border:1px solid #ddd; background:white; opacity:${current === 1 ? 0.5 : 1}">Prev</button>
            <span style="font-size:14px; font-weight:600; color:#555;">Page ${current} of ${totalPages}</span>
            <button onclick="window.changePage(${current + 1})" ${current === totalPages ? 'disabled' : ''} style="padding:8px 16px; border-radius:8px; border:1px solid #ddd; background:white; opacity:${current === totalPages ? 0.5 : 1}">Next</button>
        </div>
    `;
}

// 5. Render Items (Swipe Supported)
function renderBookingListItems(bookings) {
    const container = document.getElementById('bookings-list');
    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-check" style="font-size:40px; color:#ddd; margin-bottom:10px;"></i>
                <p style="color:#8E8E93;">No ${window.currentTab} bookings</p>
            </div>`;
        return;
    }

    // Helpers
    function generateAvatar(name, photoUrl) {
        if (photoUrl) return `<img src="${photoUrl}" alt="${name}" class="user-avatar-img">`;
        const colors = ['#FF9F0A', '#30D158', '#0A84FF', '#BF5AF2', '#FF375F', '#AC8E68'];
        const char = (name || 'U').charAt(0).toUpperCase();
        const color = colors[char.charCodeAt(0) % colors.length];
        return `<div class="user-avatar-fallback" style="background-color: ${color};">${char}</div>`;
    }

    function formatRelativeTime(dateField) {
        if (!dateField) return '';
        let dateObj;
        if (dateField.seconds) dateObj = new Date(dateField.seconds * 1000);
        else dateObj = new Date(dateField);
        if (isNaN(dateObj.getTime())) return '';
        const now = new Date();
        const diffInSeconds = Math.floor((now - dateObj) / 1000);
        const exactTime = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        let relative = '';
        if (diffInSeconds < 60) relative = 'Just now';
        else if (diffInSeconds < 3600) relative = `${Math.floor(diffInSeconds / 60)}m ago`;
        else if (diffInSeconds < 86400) relative = `${Math.floor(diffInSeconds / 3600)}h ago`;
        else relative = `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${exactTime} <span style="font-weight:400; color:#8E8E93; margin-left:4px;">(${relative})</span>`;
    }

    function calculateCountdown(dateField, timeStr) {
        if (!dateField || !timeStr) return '';
        let targetDate;
        if (dateField.seconds) {
            targetDate = new Date(dateField.seconds * 1000);
        } else {
            if (typeof dateField === 'string' && dateField.includes('-')) {
                const parts = dateField.split('-');
                if (parts.length === 3 && parts[2].length === 4) targetDate = new Date(parts[2], parts[1] - 1, parts[0]);
                else targetDate = new Date(dateField);
            } else targetDate = new Date(dateField);
        }
        if (isNaN(targetDate.getTime())) return '';
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const now = new Date();
        const diffMs = targetDate - now;
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffHours / 24;

        if (diffMs < 0) return '<span style="color:#FF3B30; font-weight:700; font-size:10px; margin-left:6px;">(Overdue)</span>';

        let label = '';
        if (diffDays >= 1) label = `in ${Math.floor(diffDays)} days`;
        else if (diffHours >= 1) label = `in ${Math.floor(diffHours)} hours`;
        else label = `in ${Math.floor(diffMs / (1000 * 60))} mins`;
        return `<span style="color:#0A84FF; font-weight:700; font-size:10px; margin-left:6px; background:rgba(10,132,255,0.1); padding:2px 6px; border-radius:4px;">${label}</span>`;
    }


    container.innerHTML = bookings.map(booking => {
        const status = (booking.status || 'pending').toLowerCase();
        let statusClass = status === 'declined' ? 'cancelled' : status;
        const dateStr = formatFirestoreDate(booking.date);
        const bookedOnStr = formatRelativeTime(booking.createdAt);
        const countdownStr = calculateCountdown(booking.date, booking.time);
        const avatarHtml = generateAvatar(booking.userName, booking.userPhoto);

        // Service Chips
        let serviceHtml = '<span style="color:#8E8E93; font-style:italic;">No services</span>';
        const servicesData = booking.servicesList || (booking.service ? booking.service.split(',') : (booking.serviceName ? [booking.serviceName] : []));
        if (Array.isArray(servicesData) && servicesData.length > 0) {
            serviceHtml = `<div style="display:flex; flex-wrap:wrap; gap:6px;">${servicesData.map((s, i) => {
                const name = typeof s === 'string' ? s.trim() : (s.name || s.serviceName || 'Unknown');
                const colors = ['#e3f2fd', '#f3e5f5', '#e8f5e9', '#fff3e0', '#fce4ec', '#fff8e1', '#e0f2f1', '#f1f8e9'];
                const textColors = ['#1565c0', '#7b1fa2', '#2e7d32', '#ef6c00', '#c2185b', '#f57f17', '#00695c', '#33691e'];
                const idx = (name.length + i) % colors.length;
                return `<span style="background:${colors[idx]}; color:${textColors[idx]}; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:700; border:1px solid rgba(0,0,0,0.05); white-space:nowrap;">${name}</span>`;
            }).join('')}</div>`;
        }

        const overrideState = (window.uiOverrides && window.uiOverrides[booking.id]) || null;

        let containerClass = `${statusClass}-border`;
        let overlayHtml = '';

        if (overrideState === 'processing') {
            overlayHtml = `
                <div class="processing-overlay">
                    <video src="/assets/animations/loading_dots_in_yellow.webm" autoplay loop muted playsinline style="width: 80px; height: 80px;"></video>
                    <span class="processing-text">Processing...</span>
                </div>
            `;
        } else if (overrideState === 'vanishing') {
            containerClass += ' card-vanishing';
        }

        return `
        <div class="swipe-container ${overrideState === 'vanishing' ? 'card-vanishing' : ''}" data-id="${booking.id}">
            <!-- Hidden Actions (Reveal on swipe) -->
            <div class="swipe-actions-left">
                 <button class="swipe-btn btn-completed" onclick="updateBookingStatus('${booking.id}', 'completed')">
                    <i class="fas fa-check-double"></i> Complete
                 </button>
                 <button class="swipe-btn btn-cancelled" onclick="updateBookingStatus('${booking.id}', 'cancelled')">
                    <i class="fas fa-ban"></i> Cancel
                 </button>
            </div>
            
            <!-- Main Content Card -->
            <div class="booking-card swipe-content ${containerClass}">
                 ${overlayHtml}
                 <div class="booking-header">
                    <div style="display:flex; flex-direction:column;">
                        <span class="booking-id">#${booking.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <span class="status-badge ${statusClass}">${status}</span>
                </div>
                
                <div class="booking-details-grid">
                     <!-- 1. Appointment -->
                    <div class="detail-item full-width-mobile" style="grid-column: span 2; background:rgba(10,132,255,0.03); border:1px solid rgba(10,132,255,0.1);">
                        <label><i class="fas fa-calendar-alt"></i> Appointment</label>
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:5px;">
                            <span style="font-weight:700; font-size:15px; color:#1C1C1E; letter-spacing:-0.3px;">${dateStr} • ${booking.time || '--:--'}</span>
                            ${countdownStr}
                        </div>
                    </div>

                    <!-- 2. Client -->
                     <div class="detail-item full-width-mobile" style="grid-column: span 2;">
                        <label><i class="fas fa-user"></i> Client</label>
                        <div style="display:flex; align-items:center; gap:12px; margin-top:6px;">
                            ${avatarHtml}
                            <div style="display:flex; flex-direction:column; overflow:hidden;">
                                <span style="font-size:15px; font-weight:700; color:var(--primary-color);">${booking.userName || 'Guest'}</span>
                                <span style="font-size:12px; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${booking.userEmail || 'No Email'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Services -->
                    <div class="detail-item full-width-mobile" style="grid-column: span 2;">
                        <label><i class="fas fa-tag"></i> Services</label>
                        <div style="margin-top:4px;">${serviceHtml}</div>
                    </div>

                    <!-- 4. Contact / Booked -->
                     <div class="detail-item">
                        <label><i class="fas fa-phone"></i> Contact</label>
                        <span style="font-weight:600; font-size:13px;">${booking.userPhone || 'N/A'}</span>
                    </div>
                     <div class="detail-item">
                        <label><i class="fas fa-clock"></i> Booked On</label>
                        <span style="font-size:12px; line-height:1.4;">${bookedOnStr}</span>
                    </div>
                     <!-- 5. Special Req -->
                    <div class="detail-item full-width-mobile" style="grid-column: span 2;">
                        <label><i class="fas fa-comment-dots"></i> Special Request</label>
                        <div style="margin-top:4px;">
                            ${booking.notes ? `<span style="font-size:13px; color:#1C1C1E; line-height:1.4;">${booking.notes}</span>` : `<span style="font-size:13px; color:#8E8E93; font-style:italic;">None</span>`}
                        </div>
                    </div>
                </div>
                
                 <!-- Hint for swipe -->
                 <div class="swipe-hint" style="text-align:center; font-size:10px; color:#ddd; margin-top:10px;">
                    <i class="fas fa-chevron-right"></i> Swipe right to manage
                 </div>
            </div>
        </div>`;
    }).join('');

    // Init Swipes
    initSwipeGestures();
}

function initSwipeGestures() {
    const containers = document.querySelectorAll('.swipe-container');

    containers.forEach(container => {
        const content = container.querySelector('.swipe-content');
        if (!content) return;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        content.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            content.style.transition = 'none'; // removing transition for direct follow
        }, { passive: true }); // passive for scroll performance

        content.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].clientX;
            const diff = x - startX;

            // Only allow dragging RIGHT (positive diff)
            if (diff > 0 && diff < 200) {
                content.style.transform = `translateX(${diff}px)`;
                currentX = diff;
            }
        }, { passive: true });

        content.addEventListener('touchend', (e) => {
            isDragging = false;
            content.style.transition = 'transform 0.3s ease-out';

            // Threshold to snap open
            if (currentX > 100) {
                // Snap Open
                content.style.transform = 'translateX(160px)'; // Enough to show buttons
                container.classList.add('swiped-open');
            } else {
                // Snap Back
                content.style.transform = 'translateX(0)';
                container.classList.remove('swiped-open');
            }
            currentX = 0;
        });

        // Click to close if open
        content.addEventListener('click', () => {
            if (container.classList.contains('swiped-open')) {
                content.style.transform = 'translateX(0)';
                container.classList.remove('swiped-open');
            }
        });
    });
}

// --- UI STATE MANAGEMENT ---
window.uiOverrides = {}; // { [id]: 'processing' | 'vanishing' }

// Global Actions
window.updateBookingStatus = async (bookingId, newStatus) => {
    if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

    // 1. Show Processing State
    window.uiOverrides[bookingId] = 'processing';
    if (typeof sortAndRenderBookings === 'function') sortAndRenderBookings();
    else if (typeof window.sortAndRenderBookings === 'function') window.sortAndRenderBookings();

    try {
        // 2. Perform Server Update
        await updateDoc(doc(db, "bookings", bookingId), {
            status: newStatus,
            updatedAt: new Date().toISOString()
        });

        // 3. Show Vanishing Animation
        window.uiOverrides[bookingId] = 'vanishing';
        if (typeof sortAndRenderBookings === 'function') sortAndRenderBookings();
        else if (typeof window.sortAndRenderBookings === 'function') window.sortAndRenderBookings();

        // 4. Show Toast
        const icon = newStatus === 'completed' ? 'fa-check-circle' : 'fa-ban';
        const msg = newStatus === 'completed' ? 'Marked as Completed' : 'Booking Cancelled';
        showBeautifulToast(msg, icon);

        // 5. Cleanup after animation (0.8s matches CSS)
        setTimeout(() => {
            delete window.uiOverrides[bookingId];
            if (typeof sortAndRenderBookings === 'function') sortAndRenderBookings();
            else if (typeof window.sortAndRenderBookings === 'function') window.sortAndRenderBookings();
        }, 800);

    } catch (e) {
        console.error("Error updating status:", e);
        delete window.uiOverrides[bookingId];
        if (typeof sortAndRenderBookings === 'function') sortAndRenderBookings();
        else if (typeof window.sortAndRenderBookings === 'function') window.sortAndRenderBookings();
        alert("Error: " + e.message);
    }
};

window.showBeautifulToast = (message, iconClass = 'fa-check-circle') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'beautiful-toast';
    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    // Remove after 3s
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

window.toggleUserRole = async (uid, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role from ${currentRole} to ${newRole}?`)) return;

    try {
        await updateDoc(doc(db, "users", uid), {
            role: newRole
        });
    } catch (e) {
        alert("Error updating role: " + e.message);
    }
};

// --- DATA HANDLING ---
// Unlimited Listener
function initBookingListener() {
    console.log("Initializing Booking Listener (Unlimited)");
    // Unlimited Query
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));

    bookingsUnsubscribe = onSnapshot(q, (snapshot) => {
        window.allBookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Update Stats
        updateDashboardStats();

        // If currently on bookings view, re-render
        if (contentArea.querySelector('.segmented-control')) {
            window.sortAndRenderBookings();
        }
    }, (error) => {
        console.error("Error listening to bookings:", error);
    });
}

function updateDashboardStats() {
    const bookingsEl = document.getElementById('stat-bookings');
    const pendingEl = document.getElementById('stat-pending');

    if (bookingsEl && window.allBookings) {
        bookingsEl.textContent = window.allBookings.length;
    }
    if (pendingEl && window.allBookings) {
        const pending = window.allBookings.filter(b => b.status === 'pending').length;
        pendingEl.textContent = pending;
    }
}

// --- GLOBAL EXPORTS FOR HTML ONCLICK ---
window.navigateTo = navigateTo;

// --- USERS VIEW ---
function renderUsersView() {
    contentArea.innerHTML = `
        <div class="view-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2 class="view-title" style="margin:0;">Users</h2>
            <div style="font-size:12px; color:#8E8E93;">
                <span id="user-count">0</span> Registered
            </div>
        </div>

        <div class="search-bar" style="margin-bottom:16px; position:relative;">
             <i class="fas fa-search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#8E8E93;"></i>
             <input type="text" placeholder="Search users by name or email..." 
                    oninput="window.handleUserSearch(this.value)"
                    style="width:100%; padding:10px 10px 10px 36px; border-radius:10px; border:1px solid #E5E5EA; background:#F2F2F7; font-size:14px;">
        </div>

        <div id="users-list" class="users-list" style="overflow-x:hidden; min-height:400px; padding-bottom:100px;">
            <div class="spinner" style="margin:20px auto"></div>
        </div>
    `;

    if (window.allUsers) {
        renderUserListItems(window.allUsers);
    } else {
        // If undefined, wait for listener (it should have started)
    }
}

window.handleUserSearch = (query) => {
    if (!window.allUsers) return;
    const q = query.toLowerCase();
    const filtered = window.allUsers.filter(u =>
        (u.displayName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q)
    );
    renderUserListItems(filtered);
};

function renderUserListItems(users) {
    const list = document.getElementById('users-list');
    const countEl = document.getElementById('user-count');
    if (countEl) countEl.textContent = users.length;
    if (!list) return;

    if (users.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="text-align:center; padding:40px 20px;">
                <i class="fas fa-users-slash" style="font-size:40px; color:#ddd; margin-bottom:10px;"></i>
                <p style="color:#8E8E93;">No users found</p>
            </div>`;
        return;
    }

    list.innerHTML = users.map(user => {
        // Robust Data Extraction
        const name = user.displayName || user.name || user.fullName || 'Guest User';
        const email = user.email || 'No email';
        const phone = user.phone || user.phoneNumber || user.mobile || null;
        const photoUrl = user.photoURL || user.photo || user.avatar || user.image;

        // Generate Color from Name
        const colors = ['#FF9F0A', '#30D158', '#0A84FF', '#BF5AF2', '#FF375F', '#AC8E68', '#5E5CE6', '#32ADE6', '#E04F5C'];
        const charCode = (name || '?').charCodeAt(0) || 0;
        const color = colors[charCode % colors.length];

        const photo = photoUrl ? `<img src="${photoUrl}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` :
            `<div style="width:40px; height:40px; border-radius:50%; background:${color}; display:flex; align-items:center; justify-content:center; color:white; font-weight:700;">${name.charAt(0).toUpperCase()}</div>`;

        const roleBadge = user.role === 'admin'
            ? `<span style="background:#0A84FF; color:white; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:700;">ADMIN</span>`
            : `<span style="background:#F2F2F7; color:#8E8E93; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:700;">USER</span>`;

        // Safe helper for strings
        const safeStr = (str) => (str || '').replace(/'/g, "\\'");

        return `
            <div class="user-item" 
                 style="display:flex; align-items:center; gap:12px; background:white; padding:16px; border-radius:16px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                ${photo}
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span style="font-weight:600; font-size:15px; color:#1C1C1E;">${name}</span>
                        ${roleBadge}
                    </div>
                    <div style="font-size:12px; color:#8E8E93; margin-top:2px;">${email}</div>
                    ${phone ? `<div style="font-size:12px; color:#0A84FF; margin-top:2px;"><i class="fas fa-phone-alt" style="font-size:10px; margin-right:4px;"></i>${phone}</div>` : ''}
                    <div style="font-size:10px; color:#C7C7CC; margin-top:4px;">ID: ${user.id.slice(0, 8)}...</div>
                </div>
                <button onclick="window.showUserOptions(event, '${user.id}', '${safeStr(name)}', '${safeStr(email)}', '${safeStr(phone)}')" 
                        style="background:none; border:none; padding:8px; cursor:pointer;">
                    <i class="fas fa-ellipsis-v" style="color:#C7C7CC; font-size:16px;"></i>
                </button>
            </div>
        `;
    }).join('');
}


// --- USER ACTION SHEET ---
window.showUserOptions = (e, uid, name, email, phone) => {
    e.stopPropagation(); // Prevent bubbling

    // Remove existing if any
    document.querySelector('.action-sheet-overlay')?.remove();

    const actionSheet = document.createElement('div');
    actionSheet.className = 'action-sheet-overlay';
    actionSheet.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 10000;
        display: flex; flex-direction: column; justify-content: flex-end;
        animation: fadeIn 0.2s ease;
    `;

    // Close handler
    const close = () => {
        actionSheet.remove();
    };

    actionSheet.onclick = (ev) => {
        if (ev.target === actionSheet) close();
    };

    const content = `
        <div style="background:white; border-radius:20px 20px 0 0; padding:24px; animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <div>
                     <h3 style="margin:0; font-size:18px;">${name || 'User Options'}</h3>
                     <span style="font-size:12px; color:#8E8E93;">${uid}</span>
                </div>
                <button class="close-sheet" style="background:none; border:none; color:#8E8E93; font-size:20px;"><i class="fas fa-times"></i></button>
            </div>

            <div style="display:grid; gap:12px;">
                <button onclick="window.filterHistoryByUser('${uid}')" 
                        style="display:flex; align-items:center; gap:12px; padding:16px; background:#F2F2F7; border:none; border-radius:12px; font-size:15px; font-weight:600; color:#1C1C1E; width:100%; text-align:left;">
                    <i class="fas fa-history" style="color:#0A84FF; font-size:18px; width:24px;"></i>
                    View Booking History
                </button>

                ${email && email !== 'No email' ? `
                <a href="mailto:${email}" 
                   style="display:flex; align-items:center; gap:12px; padding:16px; background:#F2F2F7; border:none; border-radius:12px; font-size:15px; font-weight:600; color:#1C1C1E; text-decoration:none;">
                    <i class="fas fa-envelope" style="color:#30D158; font-size:18px; width:24px;"></i>
                    Send Email
                </a>` : ''}

                ${phone && phone !== 'undefined' ? `
                <a href="tel:${phone}" 
                   style="display:flex; align-items:center; gap:12px; padding:16px; background:#F2F2F7; border:none; border-radius:12px; font-size:15px; font-weight:600; color:#1C1C1E; text-decoration:none;">
                    <i class="fas fa-phone" style="color:#30D158; font-size:18px; width:24px;"></i>
                    Call User
                </a>` : ''}

                <button onclick="navigator.clipboard.writeText('${uid}'); window.showToast('User ID Copied!');" 
                        style="display:flex; align-items:center; gap:12px; padding:16px; background:#F2F2F7; border:none; border-radius:12px; font-size:15px; font-weight:600; color:#1C1C1E; width:100%; text-align:left;">
                    <i class="fas fa-copy" style="color:#8E8E93; font-size:18px; width:24px;"></i>
                    Copy User ID
                </button>
            </div>
            
             <button class="cancel-btn" style="width:100%; padding:16px; margin-top:16px; background:white; border:1px solid #E5E5EA; border-radius:12px; font-weight:600; color:#FF3B30;">Cancel</button>
        </div>
    `;

    actionSheet.innerHTML = content;
    document.body.appendChild(actionSheet);

    // Bind Internal Events
    actionSheet.querySelector('.close-sheet').onclick = close;
    actionSheet.querySelector('.cancel-btn').onclick = close;
};

// Helper Action: Filter History by User
window.filterHistoryByUser = (uid) => {
    // 1. Remove Action Sheet
    document.querySelector('.action-sheet-overlay')?.remove();

    // 2. Switch to Bookings Tab
    window.navigateTo('bookings');

    // 3. Switch to History Sub-tab
    setTimeout(() => {
        window.switchTab('finished');
        window.handleHistorySearch(uid);
    }, 100);
};


// --- DATA LISTENER ---
function initUserListener() {
    console.log("Initializing User Listener");
    const q = query(collection(db, "users"));

    // Using global variable similar to bookingsUnsubscribe if needed, or just let it run
    onSnapshot(q, (snapshot) => {
        window.allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Update Stats
        const userStatEl = document.getElementById('stat-users');
        if (userStatEl) userStatEl.textContent = window.allUsers.length;

        // Re-render if in Users view
        if (document.getElementById('users-list')) {
            renderUserListItems(window.allUsers); // or filter if search is active... simpl for now
            // Better: re-trigger search handler if value exists
            const searchInput = document.querySelector('.search-bar input');
            if (searchInput && searchInput.value) {
                window.handleUserSearch(searchInput.value);
            } else {
                renderUserListItems(window.allUsers);
            }
        }
    }, (error) => {
    });
}

// --- SETTINGS VIEW ---
function renderSettingsView() {
    contentArea.innerHTML = `
        <div class="view-header" style="margin-bottom:24px;">
            <h2 class="view-title" style="margin:0;">Settings</h2>
        </div>

        <!-- Profile Section -->
        <div class="settings-card" style="background:white; border-radius:16px; padding:20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.04); display:flex; align-items:center; gap:16px;">
            <div style="width:60px; height:60px; border-radius:50%; background:#007AFF; color:white; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:700;">
                ${(currentUser?.displayName || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
                <h3 style="margin:0; font-size:18px;">${currentUser?.displayName || 'Admin User'}</h3>
                <p style="margin:4px 0 0; color:#8E8E93; font-size:14px;">${currentUser?.email}</p>
            </div>
        </div>

        <!-- Settings List -->
        <div class="settings-list" style="background:white; border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div onclick="window.handleFeatureNotImplemented('Edit Profile')" style="padding:16px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #F2F2F7; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <i class="fas fa-user-circle" style="color:#007AFF; width:24px;"></i>
                    <span style="font-size:16px; font-weight:500;">Edit Profile</span>
                </div>
                <i class="fas fa-chevron-right" style="color:#C7C7CC; font-size:14px;"></i>
            </div>
            
            <div onclick="window.handleFeatureNotImplemented('Notifications')" style="padding:16px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #F2F2F7; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <i class="fas fa-bell" style="color:#FF3B30; width:24px;"></i>
                    <span style="font-size:16px; font-weight:500;">Notifications</span>
                </div>
                <i class="fas fa-chevron-right" style="color:#C7C7CC; font-size:14px;"></i>
            </div>

            <div onclick="window.handleAdminLogout()" style="padding:16px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <i class="fas fa-sign-out-alt" style="color:#FF3B30; width:24px;"></i>
                    <span style="font-size:16px; font-weight:500; color:#FF3B30;">Logout</span>
                </div>
            </div>
        </div>
        
        <div style="text-align:center; margin-top:32px; color:#C7C7CC; font-size:12px;">
            <p>Admin Panel v1.0.0</p>
        </div>
    `;
}

// Global Export
window.handleAdminLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
        try {
            await signOut(auth);
            window.location.reload();
        } catch (e) {
            console.error("Logout failed", e);
            alert("Logout failed");
        }
    }
};

window.handleFeatureNotImplemented = (featureName) => {
    alert(`The '${featureName}' feature is coming soon!`);
};

// Menu Button Listener
const menuBtn = document.getElementById('menu-btn');
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        alert("Menu clicked! (Sidebar toggle coming soon)");
    });
}
