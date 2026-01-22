/*
================================================================================
ACCOUNT PAGE CONTROLLER
================================================================================
Handles User Profile, Edit Mode, Statistics, and Authentication State for the Account Tab.
*/

class AccountController {
    constructor() {
        this.auth = null; // Will be initialized from window.auth (Firebase)
        this.db = null;   // Will be initialized from window.db (Firestore)
        this.currentUser = null;

        // UI Elements
        this.profileNameEl = document.querySelector('.profile-name');
        this.profileEmailEl = document.querySelector('.profile-email');
        this.profileAvatarEl = document.querySelector('.profile-avatar');
        this.editBtn = document.querySelector('.edit-profile-btn');
        this.logoutBtn = document.querySelector('.logout-btn');
        this.statsValues = document.querySelectorAll('.stat-value');

        this.init();
    }

    async init() {
        // 1. IMPROMEDIATE DEFAULT: Force Guest View to prevent flash of member content
        this.showGuestState();

        // 2. Wait for Firebase to load globally (from auth.js / firebase-config.js)
        this.waitForFirebase();
    }

    waitForFirebase() {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window.firebase && window.auth) {
                clearInterval(checkInterval);
                this.auth = window.auth;
                this.db = window.db;
                this.setupAuthListener();
                console.log('✅ AccountController: Firebase connected');
            } else if (attempts > 20) {
                console.warn("AccountController: Waiting for Firebase...", { hasWindowAuth: !!window.auth });
            }
        }, 500);
    }

    setupAuthListener() {
        if (!this.auth) return;

        this.auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user;
                this.renderUserProfile(user);
                this.fetchUserStats(user);
                this.enableInteractions();
            } else {
                // User logged out - potentially redirect or show login prompt
                console.log('👤 Account: No user logged in');
                this.showGuestState();
            }
        });
    }

    renderUserProfile(user) {
        if (!user) return;

        // Name
        const name = user.displayName || 'Valued Member';
        if (this.profileNameEl) this.profileNameEl.textContent = name;

        // Email
        const email = user.email || 'No email provided';
        if (this.profileEmailEl) this.profileEmailEl.textContent = email;

        // Avatar
        if (user.photoURL && this.profileAvatarEl) {
            this.profileAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        } else {
            // Default placeholder
            if (this.profileAvatarEl) {
                this.profileAvatarEl.innerHTML = `<div class="avatar-placeholder">${name.charAt(0).toUpperCase()}</div>`;
            }
        }
    }

    showGuestState() {
        // 1. Update Profile Card
        if (this.profileNameEl) this.profileNameEl.textContent = 'Guest User';
        if (this.profileEmailEl) this.profileEmailEl.textContent = 'Sign in to access exclusive perks';
        if (this.profileAvatarEl) this.profileAvatarEl.innerHTML = '<div class="avatar-placeholder" style="background:#ddd; color:#666;">?</div>';

        // 2. Hide Member-Only Sections
        this.toggleMemberSections(false);

        // 3. Hide Edit Button
        if (this.editBtn) this.editBtn.style.display = 'none';

        // 4. Update Main Action Button (Sign In)
        if (this.logoutBtn) {
            this.logoutBtn.textContent = 'Sign In / Sign Up';
            this.logoutBtn.classList.add('signin-mode'); // Optional styling hook
            this.logoutBtn.onclick = () => {
                document.dispatchEvent(new CustomEvent('open-login-modal'));
            };
        }
    }

    enableInteractions() {
        // 1. Show Member Sections
        this.toggleMemberSections(true);

        // 2. Show Edit Profile
        if (this.editBtn) {
            this.editBtn.style.display = 'flex';
            this.editBtn.onclick = () => this.toggleEditMode();
        }

        // 3. Update Main Action Button (Sign Out)
        if (this.logoutBtn) {
            this.logoutBtn.textContent = 'Sign Out';
            this.logoutBtn.classList.remove('signin-mode');
            this.logoutBtn.onclick = () => this.handleLogout();
        }
    }

    toggleMemberSections(isMember) {
        const sections = [
            'tierSection',
            'statsSection',
            'benefitsSection',
            'quickActionsSection'
        ];

        const displayValue = isMember ? 'block' : 'none';
        const displayGrid = isMember ? 'grid' : 'none'; // Stats/Benefits use grid

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // Special handling for grid sections if needed, or just use CSS toggle class
                // Simple display toggle:
                if (id === 'statsSection' && isMember) el.style.display = 'grid';
                else if (id === 'benefitsSection' && isMember) el.style.display = 'block'; // Benefits usually block with inner grid
                else el.style.display = displayValue;
            }
        });
    }

    async handleLogout() {
        if (window.logout) {
            window.logout(); // Use global logout with beautiful toast
        } else {
            // Fallback
            try {
                await this.auth.signOut();
                window.location.reload();
            } catch (error) {
                console.error('Logout error:', error);
                alert('Failed to sign out. Please try again.');
            }
        }
    }

    toggleEditMode() {
        // Simple prompt based editing for now (can upgrade to modal later)
        const newName = prompt("Enter your new display name:", this.currentUser.displayName);
        if (newName && newName.trim() !== "") {
            this.updateProfileName(newName);
        }
    }

    async updateProfileName(newName) {
        try {
            await this.currentUser.updateProfile({
                displayName: newName
            });
            // Update UI immediately
            if (this.profileNameEl) this.profileNameEl.textContent = newName;

            // Re-render avatar if using initial
            if (!this.currentUser.photoURL) {
                this.profileAvatarEl.innerHTML = `<div class="avatar-placeholder">${newName.charAt(0).toUpperCase()}</div>`;
            }

            console.log('✅ Profile updated');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Could not update profile. ' + error.message);
        }
    }

    async fetchUserStats(user) {
        // 1. Loyalty Points (Mock logic or Firestore field)
        // 2. Total Saved (Mock)
        // 3. Bookings Count (Real Firestore Count)

        try {
            // Mock static stats for now
            // Future: await this.db.collection('users').doc(user.uid).get()...

            // Example: Fetch real booking count
            if (this.db) {
                const bookingsRef = this.db.collection('bookings').where('userId', '==', user.uid);
                const snapshot = await bookingsRef.get();
                const count = snapshot.size;

                // Update Bookings Stat Card (assuming index 2 is bookings)
                if (this.statsValues[2]) this.statsValues[2].textContent = count;
            }

        } catch (e) {
            console.warn('Could not fetch specific stats:', e);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AccountController());
} else {
    new AccountController();
}
