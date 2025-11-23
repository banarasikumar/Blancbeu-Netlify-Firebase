# ► BLANCBEU AUTHENTICATION SETUP GUIDE

## Complete Setup for Phone, Google, and WhatsApp Login

---

## ► QUICK OVERVIEW

Blancbeu supports three authentication methods:
1. **Phone OTP** - Via SMS (Twilio)
2. **Google OAuth** - Via Firebase
3. **WhatsApp** - Via WhatsApp Business API (Twilio)

---

## ► PART 1: PHONE LOGIN (SMS OTP) - TWILIO SETUP

### Step 1: Get Twilio Account
1. Sign up at https://www.twilio.com/console
2. Get your credentials:
   - Account SID
   - Auth Token
   - Phone Number (e.g., +1234567890)

### Step 2: Set Environment Variables
```bash
# In Firebase Cloud Functions environment:
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 3: How It Works
1. User enters phone number
2. Frontend calls backend: POST `/send-otp` with phone number
3. Backend uses Twilio to send SMS with 6-digit OTP
4. User enters OTP they received
5. Frontend calls backend: POST `/verify-otp` with phone + OTP
6. Backend verifies OTP and returns session token
7. User logged in ✓

### Step 4: Test in Demo Mode
- Currently works in demo mode without Twilio
- Just enter any phone number
- Demo OTP shown in alert
- For production: Configure Twilio credentials

---

## ► PART 2: GOOGLE LOGIN - FIREBASE SETUP

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create new project: "blancbeu-salon"
3. Enable Authentication

### Step 2: Configure Google OAuth
1. In Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Go to Project Settings → Service Accounts
4. Generate new private key
5. Update firebase-config.js with credentials

### Step 3: Add Google to Frontend
Firebase SDK already loaded in index.html
Just need valid credentials in firebase-config.js

### Step 4: How It Works
1. User clicks "Sign in with Google"
2. Google OAuth popup appears
3. User logs in with Google account
4. Firebase returns ID token
5. User logged in ✓

---

## ► PART 3: WHATSAPP LOGIN - TWILIO SETUP

### Step 1: Twilio WhatsApp Sandbox
1. Go to Twilio Console → Messaging → Try it Out → Send an SMS
2. Scroll down to WhatsApp
3. Enable WhatsApp Sandbox
4. Scan QR code with WhatsApp
5. Send "join YOUR_CODE" to activate

### Step 2: WhatsApp Business API Number
1. Request production number from Twilio
2. Get WhatsApp Business Account verified
3. Update environment variable:
   ```bash
   TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
   ```

### Step 3: Set Webhook URL
1. Go to Twilio Console → Messaging → Settings → WhatsApp
2. Set Webhook for incoming messages:
   ```
   https://your-firebase-functions-url/whatsapp-webhook
   ```
3. This receives user messages sent to your WhatsApp number

### Step 4: How It Works

**User Sends:**
1. User receives code on WhatsApp
2. User sends code to your WhatsApp number
3. Backend webhook receives message
4. Backend validates code and logs user in
5. User logged in ✓

**Frontend:**
1. User enters phone number
2. Frontend calls: POST `/send-whatsapp-code`
3. Backend sends WhatsApp message with login code
4. User checks WhatsApp and sends code to your number
5. Backend webhook processes incoming message
6. Frontend polls or receives real-time notification
7. User automatically logged in ✓

---

## ► DEPLOYMENT STEPS

### Step 1: Deploy Backend Functions
```bash
cd /home/runner/firebase-backend

# Configure Firebase
firebase init
firebase login

# Deploy functions
firebase deploy --only functions

# Check deployment
firebase functions:log
```

### Step 2: Set Environment Variables
```bash
# In Firebase Console → Functions → Runtime settings
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### Step 3: Update Firebase Config
In firebase-config.js:
```javascript
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "blancbeu-salon.firebaseapp.com",
  projectId: "blancbeu-salon",
  storageBucket: "blancbeu-salon.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  functionsUrl: "https://us-central1-blancbeu-salon.cloudfunctions.net"
};
```

### Step 4: Deploy Frontend
```bash
# With backend URL configured
netlify deploy --prod --dir /home/runner/workspace
```

---

## ► TESTING AUTHENTICATION

### Test Phone OTP
1. Open app at your Netlify URL
2. Go to any tab that requires login (Notifications, Bookings, Account)
3. Auth modal appears
4. Select "Phone" tab
5. Enter phone: +91 98765 43210
6. Click "Send OTP"
7. Enter demo OTP (shown in alert or logs)
8. Click "Verify OTP"
9. You're logged in!

### Test Google Login
1. Click "Google" tab in auth modal
2. Click "Sign in with Google" button
3. Google popup appears
4. Sign in with Google account
5. You're logged in!

### Test WhatsApp Login
1. Click "WhatsApp" tab in auth modal
2. Enter phone: +91 98765 43210
3. Click "Send Code on WhatsApp"
4. (In production: Receive code on WhatsApp)
5. Enter code
6. Click "Verify Code"
7. You're logged in!

---

## ► TROUBLESHOOTING

### "OTP not sending"
- Check Twilio credentials in environment variables
- Verify Twilio account has credits
- Check phone number format (include country code)

### "Firebase login not working"
- Verify firebase-config.js has correct credentials
- Check Google OAuth enabled in Firebase
- Check browser console for errors

### "WhatsApp not receiving messages"
- Verify Twilio WhatsApp number is active
- Check Twilio WhatsApp sandbox is enabled
- Verify webhook URL is public and configured
- Check phone number format

### "User not staying logged in"
- Check localStorage is enabled
- Verify auth.js is loading
- Check for console errors

---

## ► PRODUCTION SECURITY CHECKLIST

- ✓ Never expose Twilio credentials in frontend code
- ✓ Use Firebase environment variables for secrets
- ✓ Enable CORS only for your domain
- ✓ Validate all phone numbers server-side
- ✓ Rate limit OTP requests (max 3 per 10 minutes)
- ✓ Expire OTPs after 5 minutes
- ✓ Log all authentication events
- ✓ Enable 2FA for admin accounts
- ✓ Use HTTPS only
- ✓ Monitor failed login attempts

---

## ► NEXT STEPS

1. **Get Twilio Account** - Free trial includes $15 credit
2. **Create Firebase Project** - Free tier includes 100k auth users/month
3. **Deploy Backend** - Takes 5 minutes
4. **Configure Environment Variables** - 2 minutes per service
5. **Test Each Method** - 10 minutes total
6. **Deploy Frontend** - 5 minutes
7. **Go Live** - You're ready! 🎉

---

## ► COSTS

| Service | Free Tier | Per Month |
|---------|-----------|-----------|
| Twilio SMS | $15 trial | ~$0.0075/SMS |
| WhatsApp | Included | Included |
| Firebase Auth | 100k users | Free ($0) |
| Firebase Functions | 2M invocations | Free ($0) |

---

**Total Setup Time: ~30 minutes**
**Total Cost: ~$0-50/month for SMS volume**

Built with refined elegance for Blancbeu Premium Beauty & Wellness Salon
