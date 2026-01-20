const admin = require("firebase-admin");
const crypto = require("crypto");

// Initialize Firebase Admin (Singleton pattern)
if (admin.apps.length === 0) {
    // Use environment variables for credentials in production
    // For local development, it might need setup, but instruction implies Env Vars
    // "Initialize Admin SDK using environment variables (no service account JSON in repo)"
    // The 'firebase-admin' automatically checks FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS
    // Or we can manually parse it if provided as a raw JSON string in env

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT", e);
            // Fallback or re-throw
            // admin.initializeApp(); // Fallback to default google auth (e.g. metadata server)
        }
    } else {
        admin.initializeApp();
    }
}

const db = admin.firestore();

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const { whatsapp_number, timestamp } = body;

        // Message validation removed as per new requirement
        // const EXPECTED_MESSAGE = "Hi BlancBeu, please help me log in.";

        if (!whatsapp_number) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing WhatsApp number." }),
            };
        }

        // 2. Map WhatsApp number to UID
        // Input format from external app is expected to be a clean number or with country code?
        // Instruction says: "Map WhatsApp number to Firebase UID: wa:+<countrycode><number>"
        // Assuming input 'whatsapp_number' includes country code but maybe not '+' or maybe it does.
        // Let's sanitize. If input is "917004574629", we make it "wa:+917004574629".
        // If input is "+917004574629", we make it "wa:+917004574629".

        let cleanNumber = whatsapp_number.replace(/\D/g, ""); // Remove non-digits
        // Determine country code if missing? Assuming input comes with CC from WhatsApp webhook usually.
        // Verification step: The prompt assumes "Map WhatsApp number...".
        // We will assume the external app sends the full normalized number.
        // Let's prepend '+' if not present in the original logic, but here we just need digits.

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
        const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000); // 10 mins

        // 5. Store token in Firestore
        await db.collection("magic_links").add({
            token: token,
            uid: uid,
            expiresAt: expiresAt,
            used: false,
        });

        // 6. Return magic login link
        // "Return magic login link in HTTP response"
        // We need the base URL. In Netlify Functions, we can infer it or use a configured one.
        // For now, constructing a relative link or absolute if headers available.
        // Netlify usually provides 'headers.host'.
        const host = event.headers.host || "blancbeu-60b2a.web.app"; // Fallback to firebase generic, but really should be the Netlify domain
        const protocol = event.headers["x-forwarded-proto"] || "https";

        // The "consume" function endpoint
        const magicLink = `${protocol}://${host}/f/consume?token=${token}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ link: magicLink }),
        };

    } catch (error) {
        console.error("Verify Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
