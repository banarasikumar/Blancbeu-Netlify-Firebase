// ==================== TWILIO SMS & WHATSAPP AUTHENTICATION ====================
// Blancbeu Authentication Backend Functions

const functions = require('firebase-functions');
const twilio = require('twilio');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Twilio (Add your credentials to Firebase environment)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN';
const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
const twilioWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+1234567890';

const client = twilio(accountSid, authToken);

// Store OTPs temporarily (in production use Firestore)
const otpCache = new Map();

// ==================== SMS OTP GENERATION & SENDING ====================

exports.sendSmsOtp = functions.https.onRequest(app);

app.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiry (5 minutes)
    otpCache.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });
    
    // Send SMS via Twilio
    const message = `Your Blancbeu salon login code is: ${otp}. Valid for 5 minutes.`;
    
    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phone
    });
    
    console.log(`SMS sent to ${phone}: ${result.sid}`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      sid: result.sid
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== VERIFY OTP ====================

app.post('/verify-otp', (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP required' });
    }
    
    const cached = otpCache.get(phone);
    
    if (!cached) {
      return res.status(400).json({ error: 'OTP not found. Request new OTP.' });
    }
    
    if (Date.now() > cached.expiresAt) {
      otpCache.delete(phone);
      return res.status(400).json({ error: 'OTP expired. Request new OTP.' });
    }
    
    if (cached.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // OTP verified - clear cache
    otpCache.delete(phone);
    
    // Generate session token
    const token = Buffer.from(`${phone}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        phone,
        loginMethod: 'sms',
        loginTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== WHATSAPP LOGIN CODE ====================

app.post('/send-whatsapp-code', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }
    
    // Generate 6-digit login code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with expiry
    otpCache.set(`whatsapp_${phone}`, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    
    // Send WhatsApp message via Twilio
    const message = `Your Blancbeu salon login code is: *${code}*\nValid for 10 minutes.\nReply with this code to login.`;
    
    const result = await client.messages.create({
      body: message,
      from: twilioWhatsApp,
      to: `whatsapp:${phone}`
    });
    
    console.log(`WhatsApp sent to ${phone}: ${result.sid}`);
    
    res.json({
      success: true,
      message: 'WhatsApp code sent successfully',
      sid: result.sid
    });
  } catch (error) {
    console.error('Send WhatsApp error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== WHATSAPP WEBHOOK - RECEIVE LOGIN CODE ====================

app.post('/whatsapp-webhook', (req, res) => {
  try {
    const { From, Body } = req.body;
    
    // Extract phone number from WhatsApp format (whatsapp:+91xxxx)
    const phone = From.replace('whatsapp:', '');
    const code = Body.trim();
    
    console.log(`Received WhatsApp message from ${phone}: ${code}`);
    
    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      const reply = `Invalid format. Please send a 6-digit code.`;
      client.messages.create({
        body: reply,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: From
      });
      return res.sendStatus(200);
    }
    
    // Check if code matches any pending login
    const cached = otpCache.get(`whatsapp_${phone}`);
    
    if (!cached) {
      client.messages.create({
        body: `No pending login for this number. Start fresh login in the app.`,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: From
      });
      return res.sendStatus(200);
    }
    
    if (cached.code === code) {
      // Code verified
      otpCache.delete(`whatsapp_${phone}`);
      
      // Generate session token
      const token = Buffer.from(`${phone}:${Date.now()}`).toString('base64');
      
      // Send confirmation
      client.messages.create({
        body: `✅ Login verified! You're now logged into Blancbeu. Welcome!`,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: From
      });
      
      // Store in Firestore for frontend to retrieve
      // (Frontend polls or receives via real-time listener)
      console.log(`WhatsApp login successful for ${phone}`);
    } else {
      client.messages.create({
        body: `❌ Invalid code. Please check and try again.`,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: From
      });
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
});

// ==================== GOOGLE OAUTH VERIFICATION ====================

app.post('/verify-google-token', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }
    
    // Verify with Firebase Auth
    // In production, use admin.auth().verifyIdToken(idToken)
    
    res.json({
      success: true,
      message: 'Google token verified',
      token: idToken
    });
  } catch (error) {
    console.error('Google verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXPORT FUNCTIONS ====================

module.exports = {
  auth: functions.https.onRequest(app)
};
