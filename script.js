const servicesData = {
  "generatedAt": "2025-10-02T13:44:21.632Z",
  "groups": [
    {
      "group": "Hair cutting",
      "icon": "✂️",
      "services": [
        { "name": "Plain Haircut", "price": 100, "offerPrice": 99 },
        { "name": "U-cut", "price": 150, "offerPrice": 99 },
        { "name": "V-cut", "price": 150, "offerPrice": 99 },
        { "name": "Deep U-cut", "price": 200, "offerPrice": 99 },
        { "name": "Deep v-cut", "price": 200, "offerPrice": 99 },
        { "name": "Step cut", "price": 300, "offerPrice": 99 },
        { "name": "Layer cut", "price": 500, "offerPrice": 99 },
        { "name": "Butterfly cut", "price": 500, "offerPrice": 99 },
        { "name": "Bob cut", "price": 400, "offerPrice": 99 },
        { "name": "Baby cut", "price": 200, "offerPrice": 99 },
        { "name": "Advance haircut", "price": 600, "offerPrice": 99 }
      ]
    },
    {
      "group": "Clean up",
      "icon": "✨",
      "services": [
        { "name": "Fruit cleanup", "price": 500, "offerPrice": 250 }
      ]
    },
    {
      "group": "Facial",
      "icon": "💆",
      "services": [
        { "name": "Lotus professional facial", "price": 1500, "offerPrice": 699 },
        { "name": "03+ Facial", "price": 1500, "offerPrice": 699 }
      ]
    },
    {
      "group": "Hairs & Treatment",
      "icon": "💇",
      "services": [
        { "name": "Keratin", "price": 2500, "offerPrice": 1499 },
        { "name": "Straightening/Smoothening", "price": 3000, "offerPrice": 1999 },
        { "name": "Botox", "price": 3500, "offerPrice": 2499 },
        { "name": "Rebounding", "price": 3500, "offerPrice": 2400 },
        { "name": "Nanoplastia", "price": 7000, "offerPrice": 2999 }
      ]
    },
    {
      "group": "Premium services",
      "icon": "👑",
      "services": [
        { "name": "Head massage", "price": 250, "offerPrice": 199 },
        { "name": "Deep Nourish HairSpa", "price": 1500, "offerPrice": 799 },
        { "name": "Full body Massage", "price": 5000, "offerPrice": 999 },
        { "name": "Blow dry", "price": 500, "offerPrice": 199 }
      ]
    },
    {
      "group": "Hair colour",
      "icon": "🎨",
      "services": [
        { "name": "Global hair colour", "price": 1199, "offerPrice": null },
        { "name": "Global highlight", "price": 1299, "offerPrice": null },
        { "name": "Highlight perstrik", "price": 149, "offerPrice": null }
      ]
    }
  ]
};

const reviewsData = [
  {
    "reviewer_name": "Nikita Kumari",
    "reviewer_details": "1 review",
    "rating_hearts": 5,
    "review_date": "a month ago",
    "review_text": "I recently visited BlancBeu Family beauty salon for a haircut and highlights, and I'm very impressed with the overall experience. The salon is beautiful and well-maintained!"
  },
  {
    "reviewer_name": "Parwati Lohar",
    "reviewer_details": "2 reviews",
    "rating_hearts": 5,
    "review_date": "9 month ago",
    "review_text": "It was my first time visiting this salon, and I was nervous - but they made me feel so comfortable! The beautician listened to me patiently and suggested the perfect style.",
    "edited": true
  },
  {
    "reviewer_name": "Rajendra Kumar Lohra",
    "reviewer_details": "2 reviews",
    "rating_hearts": 5,
    "review_date": "a month ago",
    "review_text": "My wife loves this place. She got her haircut and facial done that was awesome all service is wow! I've never been so happy with them. I'd highly recommend!"
  },
  {
    "reviewer_name": "Ujala Oraon",
    "reviewer_details": "4 reviews",
    "rating_hearts": 5,
    "review_date": "5 days ago",
    "review_text": "Best service... I done my cleanup.. Thank you blanc beu"
  },
  {
    "reviewer_name": "Fehran Saifi",
    "reviewer_details": "1 review",
    "rating_hearts": 5,
    "review_date": "a month ago",
    "review_text": "Highly recommended, all services are premium and result was very good in behaviour.. maine waha global highlight karwaya 😍😍😍❤️",
    "translation_available": true
  },
  {
    "reviewer_name": "Aditi Singh",
    "reviewer_details": "5 reviews",
    "rating_hearts": 5,
    "review_date": "2 months ago",
    "review_text": "Such a great place! I was glad to have your pampering sessions, recently visited there, felt so comfortable..."
  }
];

const priorityOrder = ["Hair cutting", "Clean up", "Facial", "Hairs & Treatment", "Premium services", "Hair colour"];

function renderServices() {
  const container = document.getElementById('servicesContainer');
  const sortedGroups = servicesData.groups.sort((a, b) => {
    return priorityOrder.indexOf(a.group) - priorityOrder.indexOf(b.group);
  });

  sortedGroups.forEach(group => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'service-category';
    
    const headerHTML = `
      <div class="category-header">
        <span class="category-icon">${group.icon || '💎'}</span>
        <h3 class="category-title">${group.group}</h3>
      </div>
    `;
    
    const servicesHTML = group.services.map(service => {
      const hasOffer = service.offerPrice !== null;
      const discount = hasOffer ? Math.round((1 - service.offerPrice / service.price) * 100) : 0;
      
      return `
        <div class="service-card">
          <div class="service-name">${service.name}</div>
          <div class="service-prices">
            ${hasOffer ? `<span class="service-original-price">₹${service.price}</span>` : ''}
            <span class="service-offer-price">₹${service.offerPrice || service.price}</span>
            ${hasOffer && discount > 0 ? `<span class="service-discount">${discount}% OFF</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
    
    categoryDiv.innerHTML = headerHTML + `<div class="services-grid">${servicesHTML}</div>`;
    container.appendChild(categoryDiv);
  });
}

function renderReviews() {
  const container = document.getElementById('reviewsContainer');
  
  reviewsData.forEach(review => {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    const stars = '★'.repeat(review.rating_hearts || 5);
    
    reviewCard.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <h4>${review.reviewer_name}</h4>
          <p class="reviewer-details">${review.reviewer_details}</p>
        </div>
        <div class="rating">
          ${stars.split('').map(star => `<span class="star">${star}</span>`).join('')}
        </div>
      </div>
      <p class="review-text">${review.review_text}</p>
      <p class="review-date">${review.review_date}</p>
    `;
    
    container.appendChild(reviewCard);
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.className = newTheme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', newTheme);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderReviews();
  initThemeToggle();
  initSmoothScroll();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('✨ PWA Service Worker registered:', registration))
      .catch(error => console.log('PWA Service Worker registration failed:', error));
  });
}
