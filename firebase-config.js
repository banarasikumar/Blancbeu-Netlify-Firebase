// Firebase Configuration for Blancbeu Salon
// Replace these with your actual Firebase credentials from Firebase Console

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemoKey123456789",
  authDomain: "blancbeu-salon.firebaseapp.com",
  projectId: "blancbeu-salon",
  storageBucket: "blancbeu-salon.appspot.com",
  messagingSenderId: "1234567890123",
  appId: "1:1234567890123:web:abcd1234efgh5678ijkl",
  functionsUrl: "https://us-central1-blancbeu-salon.cloudfunctions.net"
};

// ==================== DEPLOYMENT INSTRUCTIONS ====================
// 
// 1. Create Firebase Project at console.firebase.google.com
//    - Project name: blancbeu-salon
//    - Enable Firestore Database
//    - Enable Cloud Functions
//
// 2. Get your credentials:
//    - Go to Project Settings (gear icon)
//    - Copy API Key, Project ID, Storage Bucket, etc.
//    - Replace values above
//
// 3. Deploy Backend:
//    cd /home/runner/firebase-backend
//    firebase init
//    firebase deploy --only functions
//    firebase deploy --only firestore:rules
//
// 4. Update this config with deployed Functions URL
//    (Will look like: https://us-central1-blancbeu-salon.cloudfunctions.net)
//
// ====================================================================

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FIREBASE_CONFIG;
}
