// Firebase API Service Layer for Blancbeu
// All API calls to Firebase Cloud Functions

const FUNCTIONS_URL = 'https://us-central1-blancbeu-salon.cloudfunctions.net';
let currentUserId = localStorage.getItem('blancbeuUserId') || 'demo-user-123';

// Set user ID (call after authentication)
export function setUserId(userId) {
  currentUserId = userId;
  localStorage.setItem('blancbeuUserId', userId);
}

// ==================== NOTIFICATIONS ====================
export async function getNotifications() {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/getNotifications?userId=${currentUserId}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return getMockNotifications();
  }
}

export async function createNotification(notification) {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/createNotification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, ...notification })
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false };
  }
}

// ==================== BOOKINGS ====================
export async function getBookings(status = 'all') {
  try {
    const statusParam = status !== 'all' ? `&status=${status}` : '';
    const response = await fetch(`${FUNCTIONS_URL}/getBookings?userId=${currentUserId}${statusParam}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return getMockBookings();
  }
}

export async function createBooking(booking) {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/createBooking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, ...booking })
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false };
  }
}

export async function cancelBooking(bookingId) {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/cancelBooking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, bookingId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { success: false };
  }
}

// ==================== ACCOUNT ====================
export async function getUserProfile() {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/getUserProfile?userId=${currentUserId}`);
    const data = await response.json();
    return data.data || getMockProfile();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return getMockProfile();
  }
}

export async function getUserStats() {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/getUserStats?userId=${currentUserId}`);
    const data = await response.json();
    return data.data || { rewardPoints: 280, servicesUsed: 12, rating: 4.8 };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { rewardPoints: 280, servicesUsed: 12, rating: 4.8 };
  }
}

export async function updateUserProfile(profile) {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/updateUserProfile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, ...profile })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false };
  }
}

// ==================== SERVICES ====================
export async function getServices(category = null) {
  try {
    const categoryParam = category ? `?category=${category}` : '';
    const response = await fetch(`${FUNCTIONS_URL}/getServices${categoryParam}`);
    const data = await response.json();
    return data.data || getMockServices();
  } catch (error) {
    console.error('Error fetching services:', error);
    return getMockServices();
  }
}

// ==================== FAVORITES ====================
export async function addFavorite(serviceId, serviceName) {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/addFavorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, serviceId, serviceName })
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding favorite:', error);
    return { success: false };
  }
}

export async function removeFavorite(serviceId) {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/removeFavorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, serviceId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error removing favorite:', error);
    return { success: false };
  }
}

export async function getFavorites() {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/getFavorites?userId=${currentUserId}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

// ==================== REVIEWS ====================
export async function addReview(serviceId, rating, comment) {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/addReview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, serviceId, rating, comment })
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false };
  }
}

export async function getReviews(serviceId = null) {
  try {
    const serviceParam = serviceId ? `?serviceId=${serviceId}` : '';
    const response = await fetch(`${FUNCTIONS_URL}/getReviews${serviceParam}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// ==================== MOCK DATA (Fallback) ====================
function getMockNotifications() {
  return [
    { id: 1, type: 'offer', title: 'Special Offer: Haircuts @₹99!', message: 'Limited time offer on all haircut styles. Book now!', time: '2 hours ago' },
    { id: 2, type: 'reward', title: 'Loyalty Reward Unlocked!', message: 'You've earned 50 reward points. Use them for discounts!', time: '1 day ago' },
    { id: 3, type: 'review', title: 'Rate Your Recent Visit', message: 'Tell us about your experience at BlancBeu', time: '3 days ago' },
    { id: 4, type: 'festival', title: 'Festive Special: 50% OFF!', message: 'Celebrate with us - Get 50% off on beauty packages', time: '5 days ago' }
  ];
}

function getMockBookings() {
  return [
    { id: 1, service: 'Haircut + Styling', time: '2:30 PM - 3:30 PM', date: '28 Nov', price: '₹599', status: 'upcoming' },
    { id: 2, service: 'Facial Treatment', time: '11:00 AM - 12:00 PM', date: '25 Nov', price: '₹799', status: 'completed' }
  ];
}

function getMockProfile() {
  return {
    name: 'Beauty Lover',
    email: 'user@example.com',
    phone: '+91 98765 43210',
    avatar: '👩‍🦰'
  };
}

function getMockServices() {
  return [
    { id: 1, name: 'Premium Haircut', price: 599, category: 'Hair' },
    { id: 2, name: 'Facial Treatment', price: 799, category: 'Skincare' },
    { id: 3, name: 'Manicure', price: 399, category: 'Nails' },
    { id: 4, name: 'Pedicure', price: 499, category: 'Nails' },
    { id: 5, name: 'Hair Color', price: 1299, category: 'Hair' }
  ];
}
