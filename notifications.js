import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app, db, auth } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

const messaging = getMessaging(app);

// Function to request permission and get token
export async function requestNotificationPermission(userId) {
    if (!userId) return;

    console.log("Requesting notification permission...");
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // Ensure this is in .env
            });

            if (token) {
                console.log("FCM Token:", token);
                await saveTokenToFirestore(userId, token);
            } else {
                console.log("No registration token available. Request permission to generate one.");
            }
        } else {
            console.log("Unable to get permission to notify.");
        }
    } catch (error) {
        console.error("An error occurred while retrieving token. ", error);
    }
}

// Save the token to Firestore
async function saveTokenToFirestore(userId, token) {
    const userRef = doc(db, "users", userId);
    try {
        await setDoc(userRef, { fcmToken: token }, { merge: true });
        console.log("FCM Token saved to Firestore for user:", userId);
    } catch (error) {
        console.error("Error saving FCM token to Firestore:", error);
    }
}

// Handle foreground messages
export function setupForegroundNotificationListener() {
    onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        const { title, body, icon } = payload.notification;

        // Show a custom toast or browser notification if the app is in focus
        // For now, we'll use a simple browser notification if checking permission again or a custom UI
        if (Notification.permission === "granted") {
            // Note: Standard browser Notification API might not show if tab is focused, 
            // so depending on OS/Browser, we might need a custom HTML toast.
            // Let's try standard first, often works or falls back.
            new Notification(title, {
                body: body,
                icon: icon || '/assets/brand_icon_optimized.webp'
            });
        }
    });
}
