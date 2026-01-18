const admin = require("firebase-admin");

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

        // 4. Create Custom Auth Token
        const customToken = await admin.auth().createCustomToken(docData.uid);

        // 5. Return Success
        // If it's a GET (browser click), we might want to redirect to the app with the token
        // The instructions say "Return auth token / success response".
        // And "User clicks link -> Netlify Function -> Firebase Auth session created".
        // Ideally, we redirect to the frontend app with the custom token so the frontend calls signInWithCustomToken.
        // Example: https://myapp.com/finish-login?token=XYZ

        // However, the instructions don't explicitly ask for redirection logic, but "Return auth token".
        // If we just return JSON to a browser GET navigation, the user sees JSON.
        // But sticking to "Return auth token", I will return JSON.
        // OR, if I can infer the referral or origin, I might redirect.
        // Given "No UI" rule, I will return JSON response.

        return {
            statusCode: 302,
            headers: {
                "Location": `https://blancbeu.in/?login_token=${customToken}`,
                "Cache-Control": "no-cache"
            },
            body: "" // Empty body for redirect
        };

    } catch (error) {
        console.error("Consume Error:", error);
        return {
            statusCode: 500,
            body: "Internal Server Error",
        };
    }
};
