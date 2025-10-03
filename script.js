const servicesData = {
  groups: [
    {
      group: "Hair cutting",
      icon: "✂️",
      image: "attached_assets/stock_images/professional_hair_st_3fab25e9.jpg",
      services: [
        { name: "Plain Haircut", price: 100, offerPrice: 99 },
        { name: "U-Cut", price: 150, offerPrice: 99 },
        { name: "V-Cut", price: 150, offerPrice: 99 },
        { name: "Deep U-Cut", price: 200, offerPrice: 99 },
        { name: "Deep V-Cut", price: 200, offerPrice: 99 },
        { name: "Step Cut", price: 300, offerPrice: 99 },
        { name: "Layer Cut", price: 500, offerPrice: 99 },
        { name: "Butterfly Cut", price: 500, offerPrice: 99 },
        { name: "Bob Cut", price: 400, offerPrice: 99 },
        { name: "Baby Cut", price: 200, offerPrice: 99 },
        { name: "Advance Haircut", price: 600, offerPrice: 99 },
        { name: "Feather Cut", price: 450, offerPrice: 99 },
        { name: "Pixie Cut", price: 500, offerPrice: 99 }
      ]
    },
    {
      group: "Clean up",
      icon: "✨",
      image: "attached_assets/stock_images/beautiful_woman_gett_9dc7243a.jpg",
      services: [
        { name: "Fruit Cleanup", price: 500, offerPrice: 250 },
        { name: "Diamond Cleanup", price: 800, offerPrice: 499 },
        { name: "Gold Cleanup", price: 1000, offerPrice: 599 },
        { name: "Charcoal Cleanup", price: 700, offerPrice: 399 }
      ]
    },
    {
      group: "Facial",
      icon: "💆",
      image: "attached_assets/stock_images/beautiful_woman_gett_6dc3de2b.jpg",
      services: [
        { name: "Lotus Professional Facial", price: 1500, offerPrice: 699 },
        { name: "03+ Facial", price: 1500, offerPrice: 699 },
        { name: "Fruit Facial", price: 1200, offerPrice: 599 },
        { name: "Gold Facial", price: 2000, offerPrice: 999 },
        { name: "Diamond Facial", price: 2500, offerPrice: 1299 },
        { name: "Anti-Aging Facial", price: 2200, offerPrice: 1199 }
      ]
    },
    {
      group: "Hairs & Treatment",
      icon: "💇",
      image: "attached_assets/stock_images/professional_hair_st_673b25ad.jpg",
      services: [
        { name: "Keratin", price: 2500, offerPrice: 1499 },
        { name: "Straightening/Smoothening", price: 3000, offerPrice: 1999 },
        { name: "Botox", price: 3500, offerPrice: 2499 },
        { name: "Rebounding", price: 3500, offerPrice: 2400 },
        { name: "Nanoplastia", price: 7000, offerPrice: 2999 },
        { name: "Hair Spa", price: 1500, offerPrice: 799 },
        { name: "Protein Treatment", price: 2000, offerPrice: 1199 },
        { name: "Anti-Dandruff Treatment", price: 1800, offerPrice: 999 }
      ]
    },
    {
      group: "Premium services",
      icon: "👑",
      image: "attached_assets/stock_images/luxury_spa_massage_w_43d50481.jpg",
      services: [
        { name: "Head Massage", price: 250, offerPrice: 199 },
        { name: "Deep Nourish HairSpa", price: 1500, offerPrice: 799 },
        { name: "Full Body Massage", price: 5000, offerPrice: 999 },
        { name: "Blow Dry", price: 500, offerPrice: 199 },
        { name: "Aroma Therapy", price: 3000, offerPrice: 1499 },
        { name: "Hot Stone Massage", price: 3500, offerPrice: 1799 },
        { name: "Thai Massage", price: 4000, offerPrice: 1999 }
      ]
    },
    {
      group: "Hair colour",
      icon: "🎨",
      image: "attached_assets/stock_images/hair_coloring_treatm_f184b598.jpg",
      services: [
        { name: "Global Hair Colour", price: 1199, offerPrice: null },
        { name: "Global Highlight", price: 1299, offerPrice: null },
        { name: "Highlight Perstrik", price: 149, offerPrice: null },
        { name: "Balayage", price: 2500, offerPrice: 1999 },
        { name: "Ombre", price: 2200, offerPrice: 1799 },
        { name: "Root Touch-Up", price: 599, offerPrice: 399 }
      ]
    },
    {
      group: "Makeup & Styling",
      icon: "💄",
      image: "attached_assets/stock_images/glamorous_woman_luxu_658b74ed.jpg",
      services: [
        { name: "Party Makeup", price: 2000, offerPrice: 1499 },
        { name: "Bridal Makeup", price: 8000, offerPrice: 5999 },
        { name: "HD Makeup", price: 3500, offerPrice: 2499 },
        { name: "Airbrush Makeup", price: 4000, offerPrice: 2999 },
        { name: "Pre-Bridal Package", price: 15000, offerPrice: 9999 }
      ]
    },
    {
      group: "Nails & Beauty",
      icon: "💅",
      image: "attached_assets/stock_images/attractive_model_wit_bcb81b4f.jpg",
      services: [
        { name: "Manicure", price: 500, offerPrice: 299 },
        { name: "Pedicure", price: 600, offerPrice: 349 },
        { name: "Gel Nails", price: 1500, offerPrice: 999 },
        { name: "Nail Art", price: 800, offerPrice: 499 },
        { name: "Threading", price: 100, offerPrice: 50 },
        { name: "Waxing Full Arms", price: 400, offerPrice: 299 },
        { name: "Waxing Full Legs", price: 600, offerPrice: 399 }
      ]
    }
  ]
};

const reviewsData = [
  {
    reviewer_name: "Nikita Kumari",
    reviewer_details: "1 review",
    rating_hearts: 5,
    review_date: "a month ago",
    review_text: "I recently visited BlancBeu Family beauty salon for a haircut and highlights, and I'm very impressed with the overall experience. The salon is beautiful and well-maintained!"
  },
  {
    reviewer_name: "Parwati Lohar",
    reviewer_details: "2 reviews",
    rating_hearts: 5,
    review_date: "9 month ago",
    review_text: "It was my first time visiting this salon, and I was nervous - but they made me feel so comfortable! The beautician listened to me patiently and suggested the perfect style."
  },
  {
    reviewer_name: "Rajendra Kumar Lohra",
    reviewer_details: "2 reviews",
    rating_hearts: 5,
    review_date: "a month ago",
    review_text: "My wife loves this place. She got her haircut and facial done that was awesome all service is wow! I've never been so happy with them. I'd highly recommend!"
  },
  {
    reviewer_name: "Ujala Oraon",
    reviewer_details: "4 reviews",
    rating_hearts: 5,
    review_date: "5 days ago",
    review_text: "Best service... I done my cleanup.. Thank you blanc beu"
  },
  {
    reviewer_name: "Fehran Saifi",
    reviewer_details: "1 review",
    rating_hearts: 5,
    review_date: "a month ago",
    review_text: "Highly recommended, all services are premium and result was very good in behaviour.. maine waha global highlight karwaya 😍😍😍❤️"
  },
  {
    reviewer_name: "Aditi Singh",
    reviewer_details: "5 reviews",
    rating_hearts: 5,
    review_date: "2 months ago",
    review_text: "Such a great place! I was glad to have your pampering sessions, recently visited there, felt so comfortable..."
  }
];

let currentSlide = 0;
let carouselInterval;
let isPlaying = false;

function initCarousel() {
  const dots = document.getElementById('carouselDots');
  const slides = document.querySelectorAll('.carousel-slide');
  
  console.log(`🎠 Carousel initialized with ${slides.length} slides`);
  
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(index);
    dots.appendChild(dot);
  });
  
  startAutoPlay();
}

function startAutoPlay() {
  console.log('▶️ Starting carousel auto-play');
  carouselInterval = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function moveCarousel(direction) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  
  console.log(`🔄 Moving carousel: current=${currentSlide}, direction=${direction}`);
  
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  
  console.log(`✅ New slide: ${currentSlide}`);
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  
  clearInterval(carouselInterval);
  startAutoPlay();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  
  currentSlide = index;
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  
  clearInterval(carouselInterval);
  startAutoPlay();
}

function renderServices() {
  const container = document.getElementById('servicesContainer');
  
  servicesData.groups.forEach(group => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'service-category';
    
    const headerHTML = `
      <div class="category-header">
        <div class="category-info">
          <h3 class="category-title">${group.icon} ${group.group}</h3>
        </div>
        <img src="${group.image}" alt="${group.group}" class="category-image">
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

function createRosePetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.textContent = '🌹';
  petal.style.left = Math.random() * 100 + '%';
  petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
  petal.style.animationDelay = Math.random() * 2 + 's';
  return petal;
}

function startRosePetals() {
  const container = document.getElementById('rosePetals');
  container.classList.add('active');
  
  for (let i = 0; i < 30; i++) {
    container.appendChild(createRosePetal());
  }
  
  setInterval(() => {
    if (isPlaying && container.children.length < 50) {
      container.appendChild(createRosePetal());
    }
  }, 500);
}

function stopRosePetals() {
  const container = document.getElementById('rosePetals');
  container.classList.remove('active');
  setTimeout(() => {
    container.innerHTML = '';
  }, 1000);
}

function initSurpriseButton() {
  const btn = document.getElementById('surpriseBtn');
  const music = document.getElementById('bgMusic');
  
  btn.addEventListener('click', () => {
    if (!isPlaying) {
      music.play();
      isPlaying = true;
      btn.classList.add('playing');
      btn.innerHTML = '<span class="surprise-icon">🎵</span><span class="surprise-text">Playing... ✨</span>';
      startRosePetals();
    } else {
      music.pause();
      isPlaying = false;
      btn.classList.remove('playing');
      btn.innerHTML = '<span class="surprise-icon">🎉</span><span class="surprise-text">Surprise me ✨</span>';
      stopRosePetals();
    }
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

function showTC() {
  const modal = document.getElementById('tcModal');
  modal.style.display = 'block';
}

function closeTC() {
  const modal = document.getElementById('tcModal');
  modal.style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('tcModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

function initScrollBehavior() {
  let lastScroll = 0;
  const header = document.getElementById('mainHeader');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      header.classList.remove('hidden');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add('hidden');
    } else if (currentScroll < lastScroll) {
      header.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  renderServices();
  renderReviews();
  initSurpriseButton();
  initSmoothScroll();
  initScrollBehavior();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('✨ PWA Service Worker registered:', registration))
      .catch(error => console.log('PWA Service Worker registration failed:', error));
  });
}
