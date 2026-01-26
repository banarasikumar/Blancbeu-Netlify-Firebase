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
        }
    } else {
        admin.initializeApp();
    }
}

const db = admin.firestore();

module.exports = async function handler(req, res) {
    // Support GET (link click) and POST
    // If GET, token is in query
    // If POST, token in body

    let token;

    if (req.method === "GET") {
        token = req.query.token;
    } else if (req.method === "POST") {
        token = req.body.token;
    } else {
        return res.status(405).send("Method Not Allowed");
    }

    if (!token) {
        return res.status(400).send("Missing token");
    }

    try {
        // 1. Find token
        const snapshot = await db.collection("magic_links")
            .where("token", "==", token)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(403).send("Invalid token");
        }

        const doc = snapshot.docs[0];
        const docData = doc.data();

        // 2. Validate
        if (docData.used) {
            return res.status(403).send("Token already used");
        }

        const now = admin.firestore.Timestamp.now();
        if (now > docData.expiresAt) {
            return res.status(403).send("Token expired");
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
        // Vercel apps usually run on root or a specific domain. 
        // We assume the app is on the same domain (relative redirect).
        const redirectUrl = `/?token=${customToken}${isNewUser ? '&isNewUser=true' : ''}`;

        return res.redirect(302, redirectUrl);

    } catch (error) {
        console.error("Consume Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}
