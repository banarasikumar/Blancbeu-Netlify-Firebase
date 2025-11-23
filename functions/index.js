const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// ==================== NOTIFICATIONS API ====================

exports.getNotifications = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });

      const notifications = await db
        .collection('users')
        .doc(userId)
        .collection('notifications')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const data = notifications.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.createNotification = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, type, title, message, actionUrl, actionLabel } = req.body;
      
      const notification = {
        type,
        title,
        message,
        actionUrl: actionUrl || null,
        actionLabel: actionLabel || null,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db
        .collection('users')
        .doc(userId)
        .collection('notifications')
        .add(notification);

      res.json({ success: true, message: 'Notification created' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.markNotificationAsRead = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, notificationId } = req.body;

      await db
        .collection('users')
        .doc(userId)
        .collection('notifications')
        .doc(notificationId)
        .update({ read: true });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ==================== BOOKINGS API ====================

exports.getBookings = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, status } = req.query;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });

      let query = db
        .collection('users')
        .doc(userId)
        .collection('bookings');

      if (status && status !== 'all') {
        query = query.where('status', '==', status);
      }

      const bookings = await query
        .orderBy('appointmentDate', 'desc')
        .get();

      const data = bookings.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.createBooking = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, serviceName, servicePrice, appointmentDate, appointmentTime, notes } = req.body;

      const booking = {
        serviceName,
        servicePrice,
        appointmentDate,
        appointmentTime,
        notes: notes || '',
        status: 'upcoming',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db
        .collection('users')
        .doc(userId)
        .collection('bookings')
        .add(booking);

      res.json({ success: true, bookingId: docRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.updateBooking = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, bookingId, ...updateData } = req.body;

      updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

      await db
        .collection('users')
        .doc(userId)
        .collection('bookings')
        .doc(bookingId)
        .update(updateData);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.cancelBooking = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, bookingId } = req.body;

      await db
        .collection('users')
        .doc(userId)
        .collection('bookings')
        .doc(bookingId)
        .update({
          status: 'cancelled',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ==================== ACCOUNT/PROFILE API ====================

exports.getUserProfile = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });

      const doc = await db.collection('users').doc(userId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, data: { id: userId, ...doc.data() } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.updateUserProfile = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, email, phone, avatar, rewardPoints } = req.body;

      await db.collection('users').doc(userId).update({
        email,
        phone,
        avatar: avatar || null,
        rewardPoints: rewardPoints || 0,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.getUserStats = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });

      const bookingsSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection('bookings')
        .where('status', '==', 'completed')
        .get();

      const stats = {
        rewardPoints: 280,
        servicesUsed: bookingsSnapshot.size,
        rating: 4.8,
        totalSpent: 0
      };

      bookingsSnapshot.docs.forEach(doc => {
        stats.totalSpent += doc.data().servicePrice || 0;
      });

      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ==================== SERVICES API ====================

exports.getServices = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const category = req.query.category;
      
      let query = db.collection('services');
      
      if (category) {
        query = query.where('category', '==', category);
      }

      const services = await query.get();

      const data = services.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ==================== FAVORITES API ====================

exports.addFavorite = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, serviceId, serviceName } = req.body;

      await db
        .collection('users')
        .doc(userId)
        .collection('favorites')
        .doc(serviceId)
        .set({
          serviceId,
          serviceName,
          addedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.removeFavorite = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, serviceId } = req.body;

      await db
        .collection('users')
        .doc(userId)
        .collection('favorites')
        .doc(serviceId)
        .delete();

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.getFavorites = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });

      const favorites = await db
        .collection('users')
        .doc(userId)
        .collection('favorites')
        .get();

      const data = favorites.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ==================== REVIEWS API ====================

exports.addReview = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, serviceId, rating, comment } = req.body;

      const review = {
        userId,
        serviceId,
        rating,
        comment,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('reviews').add(review);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

exports.getReviews = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const serviceId = req.query.serviceId;
      
      let query = db.collection('reviews');
      if (serviceId) {
        query = query.where('serviceId', '==', serviceId);
      }

      const reviews = await query
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      const data = reviews.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});
