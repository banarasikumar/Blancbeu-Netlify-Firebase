const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 1. Send Notification when Booking Status Changes
// Trigger: Firestore update on bookings/{bookingId}
exports.onBookingUpdate = functions.firestore
    .document("bookings/{bookingId}")
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();

        // Check if status has changed
        if (newValue.status === previousValue.status) {
            return null;
        }

        const userId = newValue.userId;
        if (!userId) {
            console.log("No userId in booking, cannot send notification.");
            return null;
        }

        // Get User's FCM Token
        const userDoc = await admin.firestore().collection("users").doc(userId).get();
        if (!userDoc.exists) {
            console.log("User not found:", userId);
            return null;
        }

        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken) {
            console.log("No FCM Token for user:", userId);
            return null;
        }

        // Prepare Notification Payload
        const payload = {
            notification: {
                title: "Booking Update 📅",
                body: `Your booking status is now: ${newValue.status.toUpperCase()}.`,
                icon: 'https://blancbeu-60b2a.web.app/assets/brand_icon_optimized.webp' // Use absolute URL if possible
            },
            token: fcmToken
        };

        // Send Notification
        try {
            await admin.messaging().send(payload);
            console.log("Notification sent successfully to:", userId);
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    });

// 2. Allow Admin to Send Custom Notification
// Callable Function or HTTP Trigger
exports.sendAdminNotification = functions.https.onCall(async (data, context) => {
    // Optional: Check if caller is admin
    // if (!context.auth || !context.auth.token.admin) {
    //    throw new functions.https.HttpsError('permission-denied', 'Only admins can send notifications.');
    // }

    const { userId, title, body } = data;

    if (!userId || !title || !body) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing userId, title, or body.');
    }

    // Get Token
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (!userDoc.exists || !userDoc.data().fcmToken) {
        throw new functions.https.HttpsError('not-found', 'User or FCM Token not found.');
    }

    const fcmToken = userDoc.data().fcmToken;

    const payload = {
        notification: {
            title: title,
            body: body,
            icon: 'https://blancbeu-60b2a.web.app/assets/brand_icon_optimized.webp'
        },
        token: fcmToken
    };

    try {
        await admin.messaging().send(payload);
        return { success: true, message: "Notification sent!" };
    } catch (error) {
        console.error("Error sending admin notification:", error);
        throw new functions.https.HttpsError('internal', 'Failed to send notification.');
    }
});
