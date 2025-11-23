// CAROUSEL
const track = document.getElementById('track');
const dots = document.getElementById('dots');
let currentSlide = 0;
const totalSlides = 5;

function initCarousel() {
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(i);
    dots.appendChild(dot);
  }
  autoplay();
}

function updateCarousel() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(n) {
  currentSlide = n;
  updateCarousel();
  clearInterval(autoplayInterval);
  autoplay();
}

let autoplayInterval;
function autoplay() {
  autoplayInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }, 5000);
}

// PAGE NAVIGATION
function switchPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`).closest('.nav') || 
    document.querySelector(`.nav-btn[data-page="${page}"]`)?.classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.getAttribute('data-page') === page) b.classList.add('active');
  });
}

// THEME
document.getElementById('themeBtn').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// SERVICES
const services = [
  { icon: '✂️', name: 'Haircut', price: '₹300' },
  { icon: '💆', name: 'Facial', price: '₹1.5K' },
  { icon: '💅', name: 'Nails', price: '₹400' },
  { icon: '💄', name: 'Makeup', price: '₹2K' },
];

const servicesContainer = document.getElementById('services');
services.forEach(s => {
  const el = document.createElement('div');
  el.className = 'service';
  el.innerHTML = `
    <div class="icon">${s.icon}</div>
    <div class="name">${s.name}</div>
    <div class="price">${s.price}</div>
  `;
  servicesContainer.appendChild(el);
});

// NOTIFICATIONS
const notificationsData = [
  { icon: '🎉', title: 'Special Offer', desc: 'Haircuts @₹99! Book now', time: '2h ago' },
  { icon: '💝', title: 'Rewards', desc: '50 points earned', time: '1d ago' },
  { icon: '⭐', title: 'Review', desc: 'Rate your visit', time: '3d ago' },
  { icon: '🎁', title: 'Festive', desc: '50% off packages', time: '5d ago' },
];

const notificationsContainer = document.getElementById('notifications');
notificationsData.forEach(n => {
  const el = document.createElement('div');
  el.className = 'notif';
  el.innerHTML = `
    <div class="icon">${n.icon}</div>
    <div style="flex:1">
      <h3>${n.title}</h3>
      <p>${n.desc}</p>
      <div class="time">${n.time}</div>
    </div>
  `;
  notificationsContainer.appendChild(el);
});

// BOOKINGS
let bookingFilter = 'upcoming';

const bookingsData = {
  upcoming: [
    { date: '28', month: 'Nov', title: 'Haircut', time: '2:30 PM', service: 'Premium', price: '₹599' },
    { date: '02', month: 'Dec', title: 'Facial', time: '11:00 AM', service: 'Gold', price: '₹2999' },
  ],
  completed: [
    { date: '15', month: 'Nov', title: 'Makeup', time: '6:00 PM', service: 'Bridal', price: '₹3000' },
  ],
  cancelled: [
    { date: '10', month: 'Nov', title: 'Nails', time: '3:00 PM', service: 'Manicure', price: '₹400' },
  ],
};

function filterBookings(filter) {
  bookingFilter = filter;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  renderBookings();
}

function renderBookings() {
  const bookings = document.getElementById('bookings');
  bookings.innerHTML = '';
  const items = bookingsData[bookingFilter] || [];
  items.forEach(b => {
    const el = document.createElement('div');
    el.className = 'booking';
    el.innerHTML = `
      <div class="date">
        <div class="day">${b.date}</div>
        <div class="month">${b.month}</div>
      </div>
      <div class="info">
        <h3>${b.title}</h3>
        <div class="time">⏰ ${b.time}</div>
        <div class="service">✂️ ${b.service}</div>
        <div class="price">${b.price}</div>
      </div>
    `;
    bookings.appendChild(el);
  });
}

// AUTH MODAL
function showAuthModal() {
  document.getElementById('authModal').classList.remove('hidden');
}

function closeAuthModal(e) {
  if (e && e.target !== document.getElementById('authModal')) return;
  document.getElementById('authModal').classList.add('hidden');
}

function logout() {
  localStorage.removeItem('user');
  location.reload();
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  renderBookings();
  switchPage('home');
});
