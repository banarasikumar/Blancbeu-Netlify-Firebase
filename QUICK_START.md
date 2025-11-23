# ► BLANCBEU - 5-MINUTE QUICK START

## Try It Right Now (Demo Mode)

Open the app at: http://localhost:5000

Everything works in **DEMO MODE** without needing Twilio or Firebase!

### Test Phone Login
1. Click any tab (Notifications, My Bookings, Account)
2. Auth modal appears
3. Enter any phone: `+91 98765 43210`
4. Click "Send OTP"
5. Demo code appears in alert - copy it
6. Paste code in OTP field
7. Click "Verify OTP"
8. **You're logged in!** ✓

### Test Google Login
1. Click "Google" tab in auth modal
2. Click "Sign in with Google" button
3. (In demo: Will show Firebase error - that's expected without Firebase project)

### Test WhatsApp Login
1. Click "WhatsApp" tab in auth modal
2. Enter phone: `+91 98765 43210`
3. Click "Send Code on WhatsApp"
4. Demo code appears - copy it
5. Paste code in WhatsApp field
6. Click "Verify Code"
7. **You're logged in!** ✓

### All 4 Tabs After Login
- **Home** - Auto-rotating carousel ✓
- **Notifications** - Alert messages with actions ✓
- **My Bookings** - Appointment list ✓
- **Account** - User profile ✓

---

## Production Deployment (30 minutes)

### 1. Get Services (5 min)
- Twilio account: https://www.twilio.com/console (free $15 trial)
- Firebase project: https://console.firebase.google.com
- Netlify account: https://app.netlify.com (free)

### 2. Deploy Frontend (5 min)
```bash
netlify deploy --prod --dir /home/runner/workspace
```

### 3. Create Firebase Project (5 min)
1. Create project "blancbeu-salon"
2. Enable Authentication
3. Enable Firestore Database
4. Get your API Key, Project ID, etc.
5. Update firebase-config.js

### 4. Deploy Backend (5 min)
```bash
cd /home/runner/firebase-backend
firebase init
firebase deploy --only functions
```

### 5. Configure Secrets (5 min)
In Firebase Console → Functions → Runtime settings:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### 6. Test Production (5 min)
- Visit your Netlify URL
- Test each login method
- Check Firebase logs for errors

---

## What's Included

✅ **Frontend** - Premium salon app with 4 tabs
✅ **Authentication** - Phone, Google, WhatsApp
✅ **Backend** - 9 Cloud Functions
✅ **Database** - Firestore schema ready
✅ **PWA** - Installable on mobile/desktop
✅ **Documentation** - Everything explained
✅ **Demo Mode** - Works without external services

---

## Need Help?

- Auth not working? Check browser console (F12)
- OTP not sending? Make sure Twilio is configured
- Firebase errors? Check firebase-config.js credentials
- Still stuck? See AUTHENTICATION_SETUP.md for detailed guide

---

## Architecture

```
User Phone Number
        ↓
[Send OTP] → Twilio SMS → [Verify OTP]
        ↓
   Backend Verifies
        ↓
Session Token Returned
        ↓
User Logged In + localStorage
```

---

**Status:** READY TO DEPLOY
**Time to Live:** ~30 minutes
**Cost:** Free tier covers everything

Built for Blancbeu Premium Beauty & Wellness Salon ◆
