// Firebase Configuration for Blancbeu
// Deploy this to your frontend environment

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "blancbeu-salon.firebaseapp.com",
  projectId: "blancbeu-salon",
  storageBucket: "blancbeu-salon.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase in your frontend
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
