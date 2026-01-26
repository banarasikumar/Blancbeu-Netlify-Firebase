const admin = require("firebase-admin");
const crypto = require("crypto");

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
            // Fallback
            admin.initializeApp();
        }
    } else {
        console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT is missing. Backend auth operations (custom token creation) will FAIL.");
        admin.initializeApp();
    }
}

const db = admin.firestore();

module.exports = async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        const { whatsapp_number } = req.body;

        if (!whatsapp_number) {
            return res.status(400).json({ error: "Missing WhatsApp number." });
        }

        // 2. Map WhatsApp number to UID
        let cleanNumber = whatsapp_number.replace(/\D/g, ""); // Remove non-digits
        const uid = `wa:+${cleanNumber}`;

        // 3. Create Firebase user if not exists
        try {
            await admin.auth().getUser(uid);
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                await admin.auth().createUser({
                    uid: uid,
                    displayName: `User ${cleanNumber}`,
                });
            } else {
                throw error;
            }
        }

        // 4. Generate secure magic token
        const token = crypto.randomBytes(32).toString("hex");
        // 10 mins expiration
        const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000);

        // 5. Store token in Firestore
        await db.collection("magic_links").add({
            token: token,
            uid: uid,
            expiresAt: expiresAt,
            used: false,
        });

        // 6. Return magic login link
        // Construct absolute URL for the consume endpoint
        const host = req.headers.host || "blancbeu.vercel.app";
        const protocol = req.headers["x-forwarded-proto"] || "https";

        // Vercel functions are serving from /api/consume usually, but we will access it via /f/consume if we set up rewrites, or /api/consume directly.
        // Let's stick to the /api standard for Vercel unless rewrites are active.
        // However, existing clients might expect /f/. 
        // Our plan includes a vercel.json rewrite from /f/* -> /api/*.
        // So we can return /f/consume to match existing behavior or update to /api/consume.
        // Better to use /api/consume or rely on the rewrite. 
        // Let's use /api/consume so it works natively, but typically we want it to look "nice".
        // Let's use the Rewrite path /f/consume for consistency with previous Netlify setup if we add the rewrite.

        // Actually, to be safe and compatible with Vercel structure let's point to /api/consume
        // BUT wait, if we want to support the user clicking a link, /api/consume is fine.
        // If we really want to keep /f/consume, we need the rewrite.
        // I will assume we will add the rewrite.

        const magicLink = `${protocol}://${host}/api/consume?token=${token}`;

        return res.status(200).json({ link: magicLink });

    } catch (error) {
        console.error("Verify Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
