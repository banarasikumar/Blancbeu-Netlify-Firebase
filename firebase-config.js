// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Debugging: Check if keys are loaded (do not log actual values in prod if possible, or careful)
console.log("Firebase Config Check:", {
    apiKeyPresent: !!import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    mode: import.meta.env.MODE
});

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with error handling
let app;
let auth;
let db;

try {
    if (!firebaseConfig.apiKey) {
        throw new Error("Missing Firebase API Key in environment variables!");
    }
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase Initialization Error:", error);
    // Visual alert to ensure the user knows why auth is broken
    alert(`Critical Error: Firebase configuration is missing or invalid.\n\n${error.message}\n\nCheck console for details.`);
}



// Expose to window for AccountController
window.auth = auth;
window.db = db;
window.firebase = { auth: auth }; // Mock structure for AccountController check

// Initialize Messaging
import { getMessaging } from "firebase/messaging";
const messaging = getMessaging(app);
export { app, auth, db, messaging };
