const admin = require("firebase-admin");
// Netlify Rebuild Trigger: 2026-01-19T16:10:00

// Initialize Firebase Admin (Singleton pattern)
if (admin.apps.length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT", e);
            // Fallback or re-throw
        }
    } else {
        admin.initializeApp();
    }
}

const db = admin.firestore();

exports.handler = async (event, context) => {
    // Support GET (link click) and POST
    // If GET, token is in queryStringParameters
    // If POST, token in body

    let token;

    if (event.httpMethod === "GET") {
        token = event.queryStringParameters.token;
    } else if (event.httpMethod === "POST") {
        try {
            const body = JSON.parse(event.body);
            token = body.token;
        } catch (e) {
            // ignore
        }
    }

    if (!token) {
        return {
            statusCode: 400,
            body: "Missing token",
        };
    }

    try {
        // 1. Find token
        const snapshot = await db.collection("magic_links")
            .where("token", "==", token)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return {
                statusCode: 403,
                body: "Invalid token",
            };
        }

        const doc = snapshot.docs[0];
        const docData = doc.data();

        // 2. Validate
        if (docData.used) {
            return {
                statusCode: 403,
                body: "Token already used",
            };
        }

        const now = admin.firestore.Timestamp.now();
        if (now > docData.expiresAt) {
            return {
                statusCode: 403,
                body: "Token expired",
            };
        }

        // 3. Mark used
        await doc.ref.update({ used: true });

        // 4. Check if user is newly created (check for profile completion)
        let isNewUser = false;
        try {
            const userDoc = await db.collection("users").doc(docData.uid).get();
            if (!userDoc.exists || !userDoc.data()?.profileCompleted) {
                isNewUser = true;
            }
        } catch (e) {
            // If we can't check, assume new user to be safe
            isNewUser = true;
            console.log("Could not check user profile, assuming new user");
        }

        // 5. Create Custom Auth Token
        const customToken = await admin.auth().createCustomToken(docData.uid);

        // 6. Redirect to App with Token and new user flag
        const redirectUrl = `/?token=${customToken}${isNewUser ? '&isNewUser=true' : ''}`;

        return {
            statusCode: 302,
            headers: {
                "Location": redirectUrl,
                "Cache-Control": "no-cache"
            },
            body: ""
        };

    } catch (error) {
        console.error("Consume Error:", error);
        return {
            statusCode: 500,
            body: "Internal Server Error",
        };
    }
};
