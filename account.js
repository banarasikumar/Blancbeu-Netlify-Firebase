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

    init() {
        // 1. IMPROMEDIATE DEFAULT: Force Guest View
        this.showGuestState();

        // 2. Wait for Firebase
        this.waitForFirebase();

        // 3. Bind Profile Page specific inputs
        // Wait slightly to ensure DOM is ready if script ran fast
        setTimeout(() => this.bindProfilePageEvents(), 100);
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

    /* ------------------------------------------------------------------------
       PROFILE PAGE LOGIC (NEW)
       ------------------------------------------------------------------------ */
    bindProfilePageEvents() {
        console.log("Binding Profile Page Events...");
        const editToggle = document.getElementById('editProfileToggle');
        const saveBtn = document.getElementById('saveProfileBtn');
        const imgInput = document.getElementById('profileImageInput');
        const badge = document.querySelector('.edit-avatar-badge');

        if (editToggle) {
            // Remove old listeners to be safe
            editToggle.onclick = null;
            editToggle.onclick = () => {
                console.log("Edit Toggle Clicked");
                this.toggleProfilePageEdit();
            };
        } else {
            console.warn("#editProfileToggle not found. Is index.html correct?");
        }

        if (saveBtn) {
            saveBtn.onclick = (e) => {
                e.preventDefault();
                console.log("Save Button Clicked");
                this.saveProfileChanges();
            };
        }

        // Avatar upload trigger
        if (badge && imgInput) {
            badge.addEventListener('click', () => imgInput.click());
            imgInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }
    }

    toggleProfilePageEdit() {
        const container = document.querySelector('.profile-content-scroll');
        if (!container) return;

        const isEditing = container.classList.contains('editing-mode');
        const toggleBtn = document.getElementById('editProfileToggle');
        const saveActions = document.querySelector('.profile-actions');
        const avatarBadge = document.querySelector('.edit-avatar-badge');

        const inputs = document.querySelectorAll('#profileDetailsForm input, #profileDetailsForm select');

        if (!isEditing) {
            // ENABLE EDIT
            container.classList.add('editing-mode');
            if (toggleBtn) {
                toggleBtn.textContent = 'Cancel';
                toggleBtn.classList.add('editing');
            }
            if (saveActions) saveActions.style.display = 'block';
            if (avatarBadge) avatarBadge.style.display = 'flex';

            inputs.forEach(input => {
                // Unlock Name, Gender, DOB
                if (['detailName', 'detailGender', 'detailDob'].includes(input.id)) {
                    input.removeAttribute('readonly');
                    input.removeAttribute('disabled');
                }
            });
        } else {
            // CANCEL EDIT
            container.classList.remove('editing-mode');
            if (toggleBtn) {
                toggleBtn.textContent = 'Edit';
                toggleBtn.classList.remove('editing');
            }
            if (saveActions) saveActions.style.display = 'none';
            if (avatarBadge) avatarBadge.style.display = 'none';

            inputs.forEach(input => {
                input.setAttribute('readonly', 'true');
                if (input.tagName === 'SELECT') input.setAttribute('disabled', 'true');
            });

            // Revert changes by refreshing data
            if (window.refreshUserData) window.refreshUserData();
        }
    }

    async saveProfileChanges() {
        const newName = document.getElementById('detailName').value;
        const newDob = document.getElementById('detailDob').value;
        const newGender = document.getElementById('detailGender').value;
        const saveBtn = document.getElementById('saveProfileBtn');

        if (saveBtn) {
            saveBtn.textContent = 'Saving...';
            saveBtn.disabled = true;
        }

        try {
            // 1. Update Auth Profile (Display Name)
            if (newName && newName !== this.currentUser.displayName) {
                await this.currentUser.updateProfile({ displayName: newName });
            }

            // 2. Update Firestore (DOB, Gender, Name)
            if (window.saveUserProfileGlobal) {
                await window.saveUserProfileGlobal(this.currentUser.uid, {
                    name: newName,
                    dob: newDob,
                    gender: newGender
                });
            } else {
                console.warn("saveUserProfileGlobal not found");
            }

            // Success
            alert("Profile updated successfully! ✨");
            this.toggleProfilePageEdit(); // Exit edit mode

        } catch (e) {
            console.error("Save failed", e);
            alert("Failed to save changes: " + e.message);
        } finally {
            if (saveBtn) {
                saveBtn.textContent = 'Save Changes ✨';
                saveBtn.disabled = false;
            }
        }
    }

    // Stub for avatar upload (can implement fully if needed)
    handleAvatarUpload(e) {
        alert("Avatar upload logic pending... Use 'Edit' to change text details for now.");
    }

    /* ------------------------------------------------------------------------
       EXISTING LOGIC
       ------------------------------------------------------------------------ */

    renderUserProfile(user) {
        if (!user) return;

        // --- ACCOUNT DASHBOARD UPDATES ---
        const name = user.displayName || 'Valued Member';
        if (this.profileNameEl) this.profileNameEl.textContent = name;

        const email = user.email || 'No email provided';
        if (this.profileEmailEl) this.profileEmailEl.textContent = email;

        if (user.photoURL && this.profileAvatarEl) {
            this.profileAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        } else if (this.profileAvatarEl) {
            this.profileAvatarEl.innerHTML = `<div class="avatar-placeholder">${name.charAt(0).toUpperCase()}</div>`;
        }

        // --- PROFILE PAGE DETAILS UPDATES ---
        if (window.refreshUserData) window.refreshUserData();
    }

    showGuestState() {
        // 1. Update Profile Card
        if (this.profileNameEl) this.profileNameEl.textContent = 'Guest User';
        if (this.profileEmailEl) this.profileEmailEl.textContent = 'Sign in to access exclusive perks';
        if (this.profileAvatarEl) this.profileAvatarEl.innerHTML = `<div class="avatar-placeholder" style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;

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

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'statsSection' && isMember) el.style.display = 'grid';
                else if (id === 'benefitsSection' && isMember) el.style.display = 'block';
                else el.style.display = displayValue;
            }
        });
    }

    async handleLogout() {
        if (window.logout) {
            window.logout();
        } else {
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
            if (this.profileNameEl) this.profileNameEl.textContent = newName;
            if (!this.currentUser.photoURL) {
                this.profileAvatarEl.innerHTML = `<div class="avatar-placeholder">${newName.charAt(0).toUpperCase()}</div>`;
            }
            if (window.refreshUserData) window.refreshUserData();
            console.log('✅ Profile updated');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Could not update profile. ' + error.message);
        }
    }

    async fetchUserStats(user) {
        // Handled by refreshUserData() now
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AccountController());
} else {
    new AccountController();
}
