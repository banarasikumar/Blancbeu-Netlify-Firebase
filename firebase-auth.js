// Firebase Authentication Module for Blancbeu

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDemoKey123', // Will be replaced with real config
  authDomain: 'blancbeu-salon.firebaseapp.com',
  projectId: 'blancbeu-salon',
  storageBucket: 'blancbeu-salon.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef123456'
};

class AuthController {
  constructor() {
    this.currentUser = this.loadUser();
    this.isAuthenticated = !!this.currentUser;
  }

  loadUser() {
    try {
      const stored = localStorage.getItem('blancbeuUser');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  saveUser(user) {
    localStorage.setItem('blancbeuUser', JSON.stringify(user));
    this.currentUser = user;
    this.isAuthenticated = true;
  }

  // Mock sign up (real Firebase would be integrated here)
  async signup(email, password, name, phone) {
    try {
      const user = {
        uid: `user_${Date.now()}`,
        email,
        name,
        phone,
        avatar: '👩‍🦰',
        rewardPoints: 0,
        servicesUsed: 0,
        rating: 0,
        createdAt: new Date().toISOString()
      };

      this.saveUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Mock login (real Firebase would be integrated here)
  async login(email, password) {
    try {
      // Simulate Firebase login
      const user = {
        uid: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        phone: '+91 98765 43210',
        avatar: '👩‍🦰',
        rewardPoints: 280,
        servicesUsed: 12,
        rating: 4.8,
        lastLogin: new Date().toISOString()
      };

      this.saveUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Mock logout
  async logout() {
    localStorage.removeItem('blancbeuUser');
    this.currentUser = null;
    this.isAuthenticated = false;
    return { success: true };
  }

  // Update profile
  async updateProfile(updates) {
    if (!this.currentUser) return { success: false, error: 'Not authenticated' };
    
    this.currentUser = { ...this.currentUser, ...updates };
    this.saveUser(this.currentUser);
    return { success: true, user: this.currentUser };
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isLoggedIn() {
    return this.isAuthenticated && this.currentUser;
  }
}

// Export singleton instance
export const authController = new AuthController();
