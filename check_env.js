
import dotenv from 'dotenv';
import fs from 'fs';

// Try to load .env
if (fs.existsSync('.env')) {
    dotenv.config();
    console.log("Loaded .env file.");
} else {
    console.log("No .env file found.");
}

const requiredKeys = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID"
];

const missingKeys = requiredKeys.filter(key => !process.env[key]);

if (missingKeys.length > 0) {
    console.error("❌ Missing Environment Variables:");
    missingKeys.forEach(key => console.error(`   - ${key}`));
} else {
    console.log("✅ All Client-Side Firebase Keys present.");
}

// Check Service Account for Functions
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log("✅ FIREBASE_SERVICE_ACCOUNT is present.");
    try {
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log("✅ FIREBASE_SERVICE_ACCOUNT is valid JSON.");
    } catch (e) {
        console.error("❌ FIREBASE_SERVICE_ACCOUNT is NOT valid JSON.");
    }
} else {
    console.log("⚠️ FIREBASE_SERVICE_ACCOUNT is missing (Required for WhatsApp/Functions to work locally if testing backend).");
}
