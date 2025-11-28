// ===== Smart Cache Update System =====
let lastKnownVersion = null;

async function initUpdateChecker() {
  try {
    // Get stored version from localStorage
    const storedVersion = localStorage.getItem('blancbeu_version');
    const storedTimestamp = localStorage.getItem('blancbeu_timestamp');
    
    // Fetch latest version from server (always from network)
    const versionResponse = await fetch('/version.json?t=' + Date.now(), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    
    if (versionResponse.ok) {
      const serverVersion = await versionResponse.json();
      const serverTimestamp = serverVersion.timestamp;
      
      lastKnownVersion = serverVersion;
      
      // Check if this is first load or if server has newer version
      const isFirstLoad = !storedVersion || !storedTimestamp;
      const hasNewerVersion = serverTimestamp > parseInt(storedTimestamp || 0);
      
      if (isFirstLoad) {
        console.log('🎉 First time load - caching version', serverVersion.version);
        localStorage.setItem('blancbeu_version', serverVersion.version);
        localStorage.setItem('blancbeu_timestamp', serverTimestamp);
      } else if (hasNewerVersion) {
        console.warn('🔄 Newer version detected! Clearing cache and reloading...');
        console.log('Old version:', storedVersion, '| New version:', serverVersion.version);
        
        // Clear all cache and cookies
        await clearAllCacheAndCookies();
        
        // Update stored version
        localStorage.setItem('blancbeu_version', serverVersion.version);
        localStorage.setItem('blancbeu_timestamp', serverTimestamp);
        
        // Notify service worker to clear cache
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CLEAR_CACHE'
          });
        }
        
        // Force reload with fresh content
        window.location.reload(true);
      } else {
        console.log('✅ Cache is fresh - version', storedVersion);
        localStorage.setItem('blancbeu_version', serverVersion.version);
      }
    }
  } catch (error) {
    console.log('ℹ️ Could not check for updates:', error.message);
    // Continue app loading even if version check fails
  }
}

async function clearAllCacheAndCookies() {
  try {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Clear localStorage (except version info and theme preference which we need to preserve)
    const versionData = {
      version: localStorage.getItem('blancbeu_version'),
      timestamp: localStorage.getItem('blancbeu_timestamp'),
      theme: localStorage.getItem('theme')
    };
    localStorage.clear();
    localStorage.setItem('blancbeu_version', versionData.version);
    localStorage.setItem('blancbeu_timestamp', versionData.timestamp);
    if (versionData.theme) {
      localStorage.setItem('theme', versionData.theme);
    }
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all caches (for service worker)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    console.log('✨ All cache and cookies cleared!');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

const servicesData = {
  groups: [
    {
      group: "Hair cutting",
      icon: "✂️",
      category: "hair",
      image: "assets/service_images/professional_hair_st_3fab25e9.webp",
      services: [
        { name: "Plain Haircut", price: 100, offerPrice: 99, duration: 30, memberDiscount: 10 },
        { name: "U-Cut", price: 150, offerPrice: 99, duration: 30, memberDiscount: 10 },
        { name: "V-Cut", price: 150, offerPrice: 99, duration: 30, memberDiscount: 10 },
        { name: "Deep U-Cut", price: 200, offerPrice: 99, duration: 40, memberDiscount: 10 },
        { name: "Deep V-Cut", price: 200, offerPrice: 99, duration: 40, memberDiscount: 10 },
        { name: "Step Cut", price: 300, offerPrice: 99, duration: 45, memberDiscount: 10 },
        { name: "Layer Cut", price: 500, offerPrice: 99, duration: 45, memberDiscount: 10 },
        { name: "Butterfly Cut", price: 500, offerPrice: 99, duration: 45, memberDiscount: 10 },
        { name: "Bob Cut", price: 400, offerPrice: 99, duration: 40, memberDiscount: 10 },
        { name: "Baby Cut", price: 200, offerPrice: 99, duration: 30, memberDiscount: 10 },
        { name: "Advance Haircut", price: 600, offerPrice: 99, duration: 50, memberDiscount: 10 },
        { name: "Feather Cut", price: 450, offerPrice: 99, duration: 45, memberDiscount: 10 },
        { name: "Pixie Cut", price: 500, offerPrice: 99, duration: 40, memberDiscount: 10 }
      ]
    },
    {
      group: "Clean up",
      icon: "✨",
      category: "skincare",
      image: "assets/service_images/beautiful_woman_gett_9dc7243a.webp",
      services: [
        { name: "Fruit Cleanup", price: 500, offerPrice: 250, duration: 45, memberDiscount: 10 },
        { name: "Diamond Cleanup", price: 800, offerPrice: 499, duration: 50, memberDiscount: 10 },
        { name: "Gold Cleanup", price: 1000, offerPrice: 599, duration: 60, memberDiscount: 10 },
        { name: "Charcoal Cleanup", price: 700, offerPrice: 399, duration: 55, memberDiscount: 10 }
      ]
    },
    {
      group: "Facial",
      icon: "💆",
      category: "skincare",
      image: "assets/service_images/facial_new.webp",
      services: [
        { name: "Lotus Professional Facial", price: 1500, offerPrice: 699, duration: 50, memberDiscount: 10 },
        { name: "03+ Facial", price: 1500, offerPrice: 699, duration: 50, memberDiscount: 10 },
        { name: "Fruit Facial", price: 1200, offerPrice: 599, duration: 45, memberDiscount: 10 },
        { name: "Gold Facial", price: 2000, offerPrice: 999, duration: 60, memberDiscount: 10 },
        { name: "Diamond Facial", price: 2500, offerPrice: 1299, duration: 60, memberDiscount: 10 },
        { name: "Anti-Aging Facial", price: 2200, offerPrice: 1199, duration: 60, memberDiscount: 10 }
      ]
    },
    {
      group: "Hairs & Treatment",
      icon: "💇",
      category: "hair",
      image: "assets/service_images/professional_hair_st_673b25ad.webp",
      services: [
        { name: "Keratin", price: 2500, offerPrice: 1499, duration: 90, memberDiscount: 10 },
        { name: "Straightening/Smoothening", price: 3000, offerPrice: 1999, duration: 120, memberDiscount: 10 },
        { name: "Botox", price: 3500, offerPrice: 2499, duration: 90, memberDiscount: 10 },
        { name: "Rebounding", price: 3500, offerPrice: 2400, duration: 90, memberDiscount: 10 },
        { name: "Nanoplastia", price: 7000, offerPrice: 2999, duration: 120, memberDiscount: 10 },
        { name: "Hair Spa", price: 1500, offerPrice: 799, duration: 60, memberDiscount: 10 },
        { name: "Protein Treatment", price: 2000, offerPrice: 1199, duration: 75, memberDiscount: 10 },
        { name: "Anti-Dandruff Treatment", price: 1800, offerPrice: 999, duration: 60, memberDiscount: 10 }
      ]
    },
    {
      group: "Premium services",
      icon: "👑",
      category: "spa",
      image: "assets/service_images/premium_hair_spa_nourish.webp",
      services: [
        { name: "Head Massage", price: 250, offerPrice: 199, duration: 30, memberDiscount: 10 },
        { name: "Deep Nourish HairSpa", price: 1500, offerPrice: 799, duration: 60, memberDiscount: 10 },
        { name: "Full Body Massage", price: 5000, offerPrice: 999, duration: 90, memberDiscount: 10 },
        { name: "Blow Dry", price: 500, offerPrice: 199, duration: 25, memberDiscount: 10 },
        { name: "Aroma Therapy", price: 3000, offerPrice: 1499, duration: 60, memberDiscount: 10 },
        { name: "Hot Stone Massage", price: 3500, offerPrice: 1799, duration: 75, memberDiscount: 10 },
        { name: "Thai Massage", price: 4000, offerPrice: 1999, duration: 90, memberDiscount: 10 }
      ]
    },
    {
      group: "Hair colour",
      icon: "🎨",
      category: "hair",
      image: "assets/service_images/hair_colour_vibrant_pink.webp",
      services: [
        { name: "Global Hair Colour", price: 1199, offerPrice: null, duration: 90, memberDiscount: 10 },
        { name: "Global Highlight", price: 1299, offerPrice: null, duration: 90, memberDiscount: 10 },
        { name: "Highlight Perstrik", price: 149, offerPrice: null, duration: 30, memberDiscount: 10 },
        { name: "Balayage", price: 2500, offerPrice: 1999, duration: 120, memberDiscount: 10 },
        { name: "Ombre", price: 2200, offerPrice: 1799, duration: 120, memberDiscount: 10 },
        { name: "Root Touch-Up", price: 599, offerPrice: 399, duration: 45, memberDiscount: 10 }
      ]
    },
    {
      group: "Makeup & Styling",
      icon: "💄",
      category: "makeup",
      image: "assets/service_images/makeup_styling_new.webp",
      services: [
        { name: "Party Makeup", price: 2000, offerPrice: 1499, duration: 45, memberDiscount: 10 },
        { name: "Bridal Makeup", price: 8000, offerPrice: 5999, duration: 120, memberDiscount: 10 },
        { name: "HD Makeup", price: 3500, offerPrice: 2499, duration: 60, memberDiscount: 10 },
        { name: "Airbrush Makeup", price: 4000, offerPrice: 2999, duration: 60, memberDiscount: 10 },
        { name: "Pre-Bridal Package", price: 15000, offerPrice: 9999, duration: 180, memberDiscount: 10 }
      ]
    },
    {
      group: "Nails & Beauty",
      icon: "💅",
      category: "nails",
      image: "assets/service_images/nails_beauty_vibrant.webp",
      services: [
        { name: "Manicure", price: 500, offerPrice: 299, duration: 35, memberDiscount: 10 },
        { name: "Pedicure", price: 600, offerPrice: 349, duration: 40, memberDiscount: 10 },
        { name: "Gel Nails", price: 1500, offerPrice: 999, duration: 50, memberDiscount: 10 },
        { name: "Nail Art", price: 800, offerPrice: 499, duration: 45, memberDiscount: 10 },
        { name: "Threading", price: 100, offerPrice: 50, duration: 20, memberDiscount: 10 },
        { name: "Waxing Full Arms", price: 400, offerPrice: 299, duration: 30, memberDiscount: 10 },
        { name: "Waxing Full Legs", price: 600, offerPrice: 399, duration: 40, memberDiscount: 10 }
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

// ===== TASK 1.0: SERVICE FILTERING & SEARCH =====
let currentFilters = { category: 'all', search: '' };

function renderServices(filterCategory = 'all', searchQuery = '') {
  const container = document.getElementById('servicesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  let totalServicesShown = 0;
  
  // Filter groups based on category
  const filteredGroups = filterCategory === 'all' 
    ? servicesData.groups 
    : servicesData.groups.filter(g => g.category === filterCategory);
  
  filteredGroups.forEach(group => {
    // Filter services by search query
    const filteredServices = searchQuery === ''
      ? group.services
      : group.services.filter(service => 
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
    if (filteredServices.length === 0) return;
    
    totalServicesShown += filteredServices.length;
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'service-category';
    categoryDiv.setAttribute('data-category', group.category);
    
    const headerHTML = `
      <div class="category-header">
        <div class="category-info">
          <h3 class="category-title">${group.icon} ${group.group}</h3>
        </div>
        <img src="${group.image}" alt="${group.group}" class="category-image" loading="lazy" decoding="async">
      </div>
    `;
    
    const servicesHTML = filteredServices.map(service => {
      const hasOffer = service.offerPrice !== null;
      const finalPrice = service.offerPrice || service.price;
      const discount = hasOffer ? Math.round((1 - service.offerPrice / service.price) * 100) : 0;
      const memberPrice = Math.floor(finalPrice * (1 - (service.memberDiscount || 0) / 100));
      const duration = service.duration || 30;
      
      return `
        <div class="service-card">
          <div class="service-header">
            <h3 class="service-name">${service.name}</h3>
            <div class="service-duration-badge">⏱️ ${duration}min</div>
          </div>
          
          <div class="service-price-display">
            <div class="price-main">₹${finalPrice}</div>
            ${hasOffer && discount > 0 ? `<span class="service-discount-badge">${discount}% OFF</span>` : ''}
          </div>
          
          ${hasOffer ? `<div class="service-original-price-small">Was ₹${service.price}</div>` : ''}
          
          <div class="service-member-info">
            <span class="member-price-tag">Member: ₹${memberPrice}</span>
            <span class="member-save">Save ₹${finalPrice - memberPrice}</span>
          </div>
          
          <button class="service-book-btn" onclick="alert('Booking feature - Coming soon!')">Book Now</button>
        </div>
      `;
    }).join('');
    
    categoryDiv.innerHTML = headerHTML + `<div class="services-grid">${servicesHTML}</div>`;
    container.appendChild(categoryDiv);
  });
  
  // Update result counter
  updateServiceCounter(totalServicesShown);
}

function updateServiceCounter(count) {
  const counter = document.getElementById('servicesCount');
  if (!counter) return;
  
  if (count === 0) {
    counter.textContent = '❌ No services found';
  } else if (currentFilters.category === 'all' && currentFilters.search === '') {
    counter.textContent = `Showing all ${count} services`;
  } else {
    let filterDesc = '';
    if (currentFilters.category !== 'all') {
      const cat = servicesData.groups.find(g => g.category === currentFilters.category);
      filterDesc = `in ${cat.group}`;
    }
    if (currentFilters.search !== '') {
      filterDesc = filterDesc ? `${filterDesc} matching "${currentFilters.search}"` : `matching "${currentFilters.search}"`;
    }
    counter.textContent = `Found ${count} service${count !== 1 ? 's' : ''} ${filterDesc}`;
  }
}

function initServiceFiltering() {
  // Category filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentFilters.category = btn.getAttribute('data-category');
      renderServices(currentFilters.category, currentFilters.search);
      
      // Show/hide clear button
      const clearBtn = document.getElementById('clearFilters');
      if (clearBtn) {
        clearBtn.style.display = (currentFilters.category !== 'all' || currentFilters.search !== '') ? 'inline-block' : 'none';
      }
    });
  });
  
  // Search input with debouncing
  const searchInput = document.getElementById('serviceSearch');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilters.search = e.target.value.trim();
        renderServices(currentFilters.category, currentFilters.search);
        
        // Show/hide clear button
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
          clearBtn.style.display = (currentFilters.category !== 'all' || currentFilters.search !== '') ? 'inline-block' : 'none';
        }
      }, 300);
    });
  }
  
  // Clear filters button
  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentFilters = { category: 'all', search: '' };
      filterButtons.forEach(b => b.classList.remove('active'));
      filterButtons[0].classList.add('active');
      if (searchInput) searchInput.value = '';
      renderServices('all', '');
      clearBtn.style.display = 'none';
    });
  }
}

function renderReviews() {
  const container = document.getElementById('reviewsContainer');
  
  // Skip if container doesn't exist (reviews converted to testimonial carousel)
  if (!container) return;
  
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

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return; // Skip empty anchors
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function showTC() {
  const modal = document.getElementById('tcModal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeTC() {
  const modal = document.getElementById('tcModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
  const modal = document.getElementById('tcModal');
  if (event.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

class ScrollBehaviorManager {
  constructor() {
    this.lastScroll = 0;
    this.scrollThreshold = 5;
    this.header = null;
    this.bottomNav = null;
    this.fireworksResumeTimer = null;
    this.isScrolling = false;
    this.fireworksWerePausedByScroll = false;
    this.ticking = false; // For requestAnimationFrame throttling
  }

  init() {
    this.header = document.getElementById('mainHeader');
    this.bottomNav = document.getElementById('bottomNav');
    
    if (!this.header) {
      console.warn('❌ Header element not found - navbar auto-hide disabled');
    }
    
    if (!this.bottomNav) {
      console.warn('❌ Bottom nav element not found - bottom nav auto-hide disabled');
    }
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
  }

  onScroll() {
    // Use requestAnimationFrame for smooth, throttled scroll handling
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.handleScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    this.updateNavbarVisibility(currentScroll);
    
    this.handleFireworksScroll();
    
    this.lastScroll = currentScroll;
  }

  updateNavbarVisibility(currentScroll) {
    if (currentScroll <= 0) {
      if (this.header) this.header.classList.remove('hidden');
      if (this.bottomNav) this.bottomNav.classList.remove('hidden');
      return;
    }

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = (currentScroll + windowHeight) >= (documentHeight - 50);
    
    if (isAtBottom) {
      if (this.bottomNav) this.bottomNav.classList.remove('hidden');
    }

    const scrollDiff = currentScroll - this.lastScroll;
    
    if (Math.abs(scrollDiff) < this.scrollThreshold) {
      return;
    }

    if (scrollDiff > 0 && currentScroll > 100) {
      // Scrolling down - hide both header and bottom nav together
      if (this.header) {
        this.header.classList.add('hidden');
      }
      if (this.bottomNav && !isAtBottom) {
        this.bottomNav.classList.add('hidden');
      }
    } else if (scrollDiff < 0) {
      // Scrolling up - show both header and bottom nav together
      if (this.header) {
        this.header.classList.remove('hidden');
      }
      if (this.bottomNav) {
        this.bottomNav.classList.remove('hidden');
      }
    }
  }

  handleFireworksScroll() {
    if (typeof togglePause !== 'function' || typeof store === 'undefined') {
      return;
    }

    if (!this.isScrolling) {
      this.isScrolling = true;
      
      const wasAlreadyPaused = store.state && store.state.paused;
      
      if (!wasAlreadyPaused) {
        this.fireworksWerePausedByScroll = true;
        togglePause(true);
      } else {
        this.fireworksWerePausedByScroll = false;
      }
    }

    clearTimeout(this.fireworksResumeTimer);
    
    // Resume fireworks after 0.5 seconds of no scrolling
    this.fireworksResumeTimer = setTimeout(() => {
      this.isScrolling = false;
      if (this.fireworksWerePausedByScroll) {
        togglePause(false);
        this.fireworksWerePausedByScroll = false;
      }
    }, 500);
  }
}

function initScrollBehavior() {
  const scrollManager = new ScrollBehaviorManager();
  scrollManager.init();
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  renderServices();
  initServiceFiltering();
  renderReviews();
  initSmoothScroll();
  initScrollBehavior();
});

let deferredPrompt;
let installButton;

function updateInstallButtonVisibility() {
  const navInstallBtn = document.getElementById('installBtn');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true ||
                       document.referrer.includes('android-app://') ||
                       sessionStorage.getItem('isStandalone') === 'true' ||
                       sessionStorage.getItem('appInstalled') === 'true';
  
  if (navInstallBtn) {
    if (isStandalone || !deferredPrompt) {
      navInstallBtn.style.display = 'none';
      console.log('🔒 Install button hidden - app is installed or cannot be installed');
    } else {
      navInstallBtn.style.display = 'flex';
      console.log('📲 Install button visible - app can be installed');
    }
  }
}

function initPWA() {
  const navInstallBtn = document.getElementById('installBtn');
  
  // Initial check - hide button if already installed
  updateInstallButtonVisibility();
  
  // Monitor display mode changes
  const displayModeQuery = window.matchMedia('(display-mode: standalone)');
  displayModeQuery.addListener(() => updateInstallButtonVisibility());
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📲 PWA Install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show nav install button only if not standalone
    if (!checkIfStandalone() && navInstallBtn) {
      navInstallBtn.style.display = 'flex';
      console.log('✅ Showing install button - prompt is available');
    }
    showInstallPromotion();
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA was installed successfully');
    sessionStorage.setItem('appInstalled', 'true');
    sessionStorage.setItem('isStandalone', 'true');
    deferredPrompt = null;
    
    // Hide install button
    updateInstallButtonVisibility();
    hideInstallPromotion();
  });
  
  // Nav button click handler
  if (navInstallBtn) {
    navInstallBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        try {
          await deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response: ${outcome}`);
          if (outcome === 'accepted') {
            sessionStorage.setItem('appInstalled', 'true');
            sessionStorage.setItem('isStandalone', 'true');
          }
          deferredPrompt = null;
          updateInstallButtonVisibility();
        } catch (error) {
          console.error('Install error:', error);
        }
      }
    });
  }

  const isStandalone = checkIfStandalone();
  
  if (!isStandalone && !deferredPrompt) {
    setTimeout(() => {
      showBrowserSpecificInstallPrompt();
    }, 5000);
  }
}

function showInstallPromotion() {
  const isStandalone = checkIfStandalone();
  if (isStandalone || sessionStorage.getItem('installPromptDismissed') === 'true') {
    return;
  }

  if (!installButton) {
    installButton = document.createElement('button');
    installButton.className = 'install-app-button';
    installButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
      </svg>
      <span>Install App</span>
    `;
    installButton.onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        if (outcome === 'accepted') {
          sessionStorage.setItem('appInstalled', 'true');
        } else {
          sessionStorage.setItem('installPromptDismissed', 'true');
        }
        deferredPrompt = null;
        hideInstallPromotion();
      } else {
        showBrowserSpecificInstructions();
      }
    };
    document.body.appendChild(installButton);
  }
  
  setTimeout(() => {
    if (installButton) {
      installButton.classList.add('show');
    }
  }, 3000);
}

function showBrowserSpecificInstallPrompt() {
  const isStandalone = checkIfStandalone();
  if (isStandalone || sessionStorage.getItem('installPromptDismissed') === 'true') {
    return;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isFirefox = /Firefox/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  if (isIOS || isSafari || isFirefox) {
    showInstallPromotion();
  }
}

function showBrowserSpecificInstructions() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isFirefox = /Firefox/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  let message = '';
  
  if (isIOS || isSafari) {
    message = 'To install this app:\n\n1. Tap the Share button (box with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right corner';
  } else if (isFirefox) {
    message = 'To install this app:\n\n1. Tap the menu button (three dots)\n2. Tap "Install"\n3. Follow the prompts to add to home screen';
  } else {
    message = 'To install this app:\n\nPlease use your browser\'s menu to add this website to your home screen.';
  }
  
  alert(message);
}

function hideInstallPromotion() {
  if (installButton) {
    installButton.classList.remove('show');
    setTimeout(() => {
      if (installButton && installButton.parentNode) {
        installButton.parentNode.removeChild(installButton);
        installButton = null;
      }
    }, 300);
  }
}

function checkIfStandalone() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true ||
                       document.referrer.includes('android-app://');
  
  if (isStandalone) {
    console.log('🎉 App is running in standalone (installed) mode');
    sessionStorage.setItem('appInstalled', 'true');
    sessionStorage.setItem('isStandalone', 'true');
    showSplashScreen();
    updateInstallButtonVisibility();
  }
  
  return isStandalone;
}

function showSplashScreen() {
  const splash = document.getElementById('pwaSplash');
  if (splash) {
    splash.classList.remove('hidden');
    
    setTimeout(() => {
      hideSplashScreen();
    }, 2500);
  }
}

function hideSplashScreen() {
  const splash = document.getElementById('pwaSplash');
  if (splash) {
    splash.classList.add('hidden');
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('✨ PWA Service Worker registered:', registration))
      .catch(error => console.log('PWA Service Worker registration failed:', error));
    
    initPWA();
  });
}

// ========================================
// iOS-Style Bottom Navigation Controller
// ========================================

class BottomNavController {
  constructor() {
    this.bottomNav = document.getElementById('bottomNav');
    this.navItems = document.querySelectorAll('.nav-item');
    this.ticking = false;
    this.sections = [];
    
    this.init();
  }
  
  init() {
    if (!this.bottomNav) {
      console.log('❌ Bottom nav element not found');
      return;
    }
    
    console.log('✅ Bottom nav controller initialized (scrollspy only)');
    
    // Initialize sections for scrollspy
    this.initSections();
    
    // Set up scroll listener for scrollspy ONLY (not for hide/show)
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    
    // Handle hash changes
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
    
    // Handle nav item clicks
    this.navItems.forEach(item => {
      item.addEventListener('click', this.handleNavClick.bind(this));
    });
    
    // Initial active state
    this.updateActiveState();
  }
  
  initSections() {
    const sectionIds = ['home', 'offers', 'services', 'gallery', 'reviews'];
    this.sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(section => section !== null)
      .map(section => ({
        id: section.id,
        element: section,
        offsetTop: section.offsetTop,
        offsetBottom: section.offsetTop + section.offsetHeight
      }));
  }
  
  handleScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateActiveState();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
  
  updateActiveState() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    // Find current section
    let currentSection = this.sections[0]?.id || 'home';
    
    for (const section of this.sections) {
      if (scrollPosition >= section.offsetTop) {
        currentSection = section.id;
      }
    }
    
    // Update active nav item
    this.navItems.forEach(item => {
      const page = item.getAttribute('data-page');
      if (page === currentSection) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  handleHashChange() {
    const hash = window.location.hash.slice(1);
    this.setActivePage(hash || 'home');
  }
  
  handleNavClick(event) {
    const item = event.currentTarget;
    const page = item.getAttribute('data-page');
    
    // Don't prevent default for external links (like WhatsApp)
    if (item.getAttribute('href').startsWith('http')) {
      return;
    }
    
    // Smooth scroll to section
    const section = document.getElementById(page);
    if (section) {
      event.preventDefault();
      const offsetTop = section.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update URL hash without jumping
      history.pushState(null, '', `#${page}`);
      this.setActivePage(page);
    }
  }
  
  setActivePage(page) {
    this.navItems.forEach(item => {
      const itemPage = item.getAttribute('data-page');
      if (itemPage === page) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

// Initialize bottom nav controller when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BottomNavController();
  });
} else {
  new BottomNavController();
}

// Visibility-based animation for offer cards
class OfferCardAnimationController {
  constructor() {
    this.offerCards = document.querySelectorAll('.offer-card');
    this.init();
  }

  init() {
    if (!this.offerCards.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        } else {
          entry.target.classList.remove('animate');
        }
      });
    }, observerOptions);

    this.offerCards.forEach(card => observer.observe(card));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new OfferCardAnimationController();
  });
} else {
  new OfferCardAnimationController();
}

class ThemeController {
  constructor() {
    this.themeToggleBtn = document.getElementById('themeToggle');
    this.fireworksOverlay = document.getElementById('fireworksOverlay');
    this.html = document.documentElement;
    this.body = document.body;
    
    this.init();
  }
  
  init() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      if (savedTheme === 'dark') {
        this.enableDarkMode();
      } else {
        this.enableLightMode();
      }
    } else {
      this.detectTimeOfDay();
    }
    
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }
  
  detectTimeOfDay() {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 6 && currentHour < 17) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }
  
  toggleTheme() {
    const currentTheme = this.html.getAttribute('data-theme');
    if (currentTheme === 'light') {
      this.enableDarkMode();
      localStorage.setItem('theme', 'dark');
    } else {
      this.enableLightMode();
      localStorage.setItem('theme', 'light');
    }
  }
  
  enableLightMode() {
    // Set data-theme attribute to trigger CSS variable changes
    this.html.setAttribute('data-theme', 'light');
    // Keep light-mode class for legacy animations
    this.body.classList.add('light-mode');
    
    if (this.fireworksOverlay) {
      this.fireworksOverlay.classList.remove('active');
      this.fireworksOverlay.style.display = 'none';
    }
    
    if (typeof togglePause === 'function') {
      togglePause(true);
    }
    
    if (typeof toggleSound === 'function') {
      toggleSound(false);
    }
    
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#fef5e7');
  }
  
  enableDarkMode() {
    // Set data-theme attribute to trigger CSS variable changes
    this.html.removeAttribute('data-theme');
    // Remove light-mode class
    this.body.classList.remove('light-mode');
    
    if (this.fireworksOverlay) {
      this.fireworksOverlay.classList.add('active');
      this.fireworksOverlay.style.display = '';
    }
    
    if (typeof togglePause === 'function') {
      togglePause(false);
    }
    
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000000');
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeController();
  });
} else {
  new ThemeController();
}

// ===== APP SHELL NAVIGATION CONTROLLER =====
class AppShellNavigator {
    constructor() {
        this.currentPage = 'home';
        this.contentArea = document.getElementById('appContent');
        this.bottomNav = document.getElementById('bottomNav');
        this.pageScrollPositions = {}; // Store scroll position for each page in memory
        this.init();
    }
    
    init() {
        // Setup bottom nav click handlers
        const navItems = this.bottomNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const isExternalLink = item.href && item.href.includes('wa.me');
                if (!isExternalLink) {
                    e.preventDefault();
                    const page = item.getAttribute('data-page');
                    this.navigateTo(page);
                }
            });
        });
        
        // Handle hash navigation from desktop nav
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                this.navigateTo(hash);
            }
        });
        
        // Save scroll position when scrolling - use window scroll
        window.addEventListener('scroll', () => {
            this.pageScrollPositions[this.currentPage] = window.scrollY;
            console.log(`📍 Page scroll saved - ${this.currentPage}: ${window.scrollY}px`);
        }, { passive: true });
    }
    
    navigateTo(page) {
        if (!page || page === '') page = 'home'; // Default to home if page is empty
        
        // If same page clicked: just scroll to top (no page transition)
        if (page === this.currentPage) {
            window.scrollTo(0, 0);
            console.log(`⬆️ Same page, scrolling to top`);
            return;
        }
        
        // Save current page scroll position IMMEDIATELY
        this.pageScrollPositions[this.currentPage] = window.scrollY;
        console.log(`💾 Saved ${this.currentPage} at: ${this.pageScrollPositions[this.currentPage]}px`);
        
        // Hide ALL sections from current page
        const currentPages = this.contentArea.querySelectorAll(`[data-page="${this.currentPage}"]`);
        currentPages.forEach(el => el.classList.remove('active'));
        
        // Show ALL sections of new page
        const newPages = this.contentArea.querySelectorAll(`[data-page="${page}"]`);
        newPages.forEach(el => el.classList.add('active'));
        
        // Update bottom nav
        const navItems = this.bottomNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        this.currentPage = page;
        
        // Restore last saved scroll position for this page
        const savedPosition = this.pageScrollPositions[page] || 0;
        requestAnimationFrame(() => {
            window.scrollTo(0, savedPosition);
            console.log(`🔄 Restored ${page} to: ${savedPosition}px`);
        });
    }
}

// Initialize app shell after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.appShell = new AppShellNavigator();
        initNotificationsController();
        initBookingsController();
    });
} else {
    window.appShell = new AppShellNavigator();
    initNotificationsController();
    initBookingsController();
}

// ===== NOTIFICATIONS PAGE CONTROLLER =====
function initNotificationsController() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const notificationCards = document.querySelectorAll('.notification-card');
    const dismissBtns = document.querySelectorAll('.dismiss-btn');
    const actionBtns = document.querySelectorAll('.action-btn');
    const quickActionChips = document.querySelectorAll('.quick-action-chip');
    const settingsBtn = document.querySelector('.notifications-settings-btn');

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter notification cards and sections
            let visibleCount = 0;
            notificationCards.forEach(card => {
                const cardType = card.getAttribute('data-type');
                if (filter === 'all' || cardType === filter) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            checkEmptyState();
            console.log(`🔍 Filtered to '${filter}' - ${visibleCount} notifications visible`);
        });
    });

    // Dismiss notification
    dismissBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.notification-card');
            card.style.animation = 'slideOutNotification 0.3s ease-out forwards';
            setTimeout(() => {
                card.remove();
                checkEmptyState();
                console.log('🗑️ Notification dismissed');
            }, 300);
        });
    });

    // Action buttons feedback
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.classList.contains('dismiss-btn')) return;
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = ''; }, 200);
        });
    });

    // Quick action chips
    quickActionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const action = chip.getAttribute('data-action');
            if (action === 'mark-all-read') {
                notificationCards.forEach(card => {
                    card.setAttribute('data-unread', 'false');
                    card.style.animation = 'slideInNotification 0.3s ease-out';
                });
                console.log('✅ All marked as read');
            } else if (action === 'clear-all') {
                notificationCards.forEach(card => {
                    card.style.animation = 'slideOutNotification 0.3s ease-out forwards';
                    setTimeout(() => card.remove(), 300);
                });
                setTimeout(checkEmptyState, 300);
                console.log('🗑️ All notifications cleared');
            }
        });
    });

    // Settings button
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            alert('⚙️ Notification settings coming soon!');
        });
    }

    // Add animation keyframe
    if (!document.querySelector('style[data-notif-anim]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notif-anim', 'true');
        style.textContent = `
            @keyframes slideOutNotification {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }

    function checkEmptyState() {
        const allCards = document.querySelectorAll('.notification-card');
        const emptyState = document.querySelector('.notifications-container .empty-state');
        if (allCards.length === 0 && emptyState) {
            emptyState.style.display = 'block';
        } else if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    console.log('✅ Notifications controller initialized with enhanced features');
}

// ===== BOOKINGS PAGE CONTROLLER =====
function initBookingsController() {
    const bookingTabs = document.querySelectorAll('.booking-tab');
    const bookingCards = document.querySelectorAll('.booking-card');
    const actionBtns = document.querySelectorAll('.booking-action-btn');
    const filterBtn = document.querySelector('.bookings-filter-btn');

    // Tab filtering
    bookingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const status = tab.getAttribute('data-status');
            
            bookingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            let visibleCount = 0;
            bookingCards.forEach(card => {
                const cardStatus = card.getAttribute('data-status');
                if (status === 'all' || cardStatus === status) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            checkEmptyBookings();
            console.log(`📅 Filtered to '${status}' - ${visibleCount} bookings visible`);
        });
    });

    // Action buttons with visual feedback
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const btnText = btn.textContent;
            
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = ''; }, 200);

            if (btnText.includes('Cancel')) {
                if (confirm('Are you sure you want to cancel this booking?')) {
                    btn.closest('.booking-card').style.animation = 'slideOutNotification 0.3s ease-out forwards';
                    setTimeout(() => {
                        btn.closest('.booking-card').remove();
                        checkEmptyBookings();
                    }, 300);
                }
            } else if (btnText.includes('Reschedule')) {
                alert('📅 Reschedule feature coming soon!');
            } else if (btnText.includes('Rebook')) {
                alert('✅ Rebook feature coming soon!');
            } else if (btnText.includes('Details')) {
                alert('📋 Booking details coming soon!');
            }
        });
    });

    // Filter button
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            alert('🔍 Advanced filters coming soon!');
        });
    }

    function checkEmptyBookings() {
        const visibleCards = document.querySelectorAll('.booking-card[style*="display: flex"], .booking-card:not([style*="display: none"])');
        const emptyState = document.querySelector('.empty-state-bookings');
        
        if (visibleCards.length === 0 && emptyState) {
            emptyState.style.display = 'block';
        } else if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    console.log('✅ Bookings controller initialized');
}

// ===== CHAT PAGE FUNCTIONS =====
function openBlancbeuMaps() {
    window.open('https://maps.app.goo.gl/WYxp5QuhjXEiBaXE9', '_blank');
}

function openWhatsAppChat() {
    window.open('https://wa.me/919229915277', '_blank');
}


// ===== HERO TEXT ANIMATION ON LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    const heroLines = document.querySelectorAll('.hero-text-line');
    heroLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
        }, 200 + (index * 200));
    });
});

// ===== STATS COUNTER ANIMATION =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const targetValue = parseInt(element.getAttribute('data-value'));
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const increment = targetValue / (duration / 50);
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue).toLocaleString();
        }, 50);
    });
}

// Trigger animation when section comes into view
function setupCounterAnimation() {
    const trustSection = document.querySelector('.trust-section');
    
    if (!trustSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(trustSection);
}

document.addEventListener('DOMContentLoaded', setupCounterAnimation);

// ===== SERVICE CAROUSEL FUNCTIONALITY =====
let serviceCarouselPosition = 0;

function slideServiceCarousel(direction) {
    const carousel = document.getElementById('serviceCarouselTrack');
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.service-card-item');
    if (items.length === 0) return;
    
    const itemWidth = items[0].offsetWidth + 20; // 20px gap
    const containerWidth = carousel.parentElement.offsetWidth;
    const visibleItems = Math.floor(containerWidth / itemWidth);
    const maxPosition = Math.max(0, items.length - visibleItems);
    
    serviceCarouselPosition += direction;
    if (serviceCarouselPosition < 0) serviceCarouselPosition = 0;
    if (serviceCarouselPosition > maxPosition) serviceCarouselPosition = maxPosition;
    
    carousel.style.transform = `translateX(-${serviceCarouselPosition * itemWidth}px)`;
}

// Initialize service carousel on load
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('serviceCarouselTrack');
    if (carousel) {
        // Responsive carousel adjustment on resize
        window.addEventListener('resize', () => {
            const items = carousel.querySelectorAll('.service-card-item');
            const itemWidth = items[0].offsetWidth + 20;
            const containerWidth = carousel.parentElement.offsetWidth;
            const visibleItems = Math.floor(containerWidth / itemWidth);
            const maxPosition = Math.max(0, items.length - visibleItems);
            
            if (serviceCarouselPosition > maxPosition) {
                serviceCarouselPosition = maxPosition;
                carousel.style.transform = `translateX(-${serviceCarouselPosition * itemWidth}px)`;
            }
        });
    }
});

// ===== TESTIMONIAL CAROUSEL =====
let testimonialPosition = 0;

function slideTestimonial(direction) {
    const track = document.getElementById('testimonialTrack');
    if (!track) return;
    
    const items = track.querySelectorAll('.testimonial-card-item');
    testimonialPosition += direction;
    
    if (testimonialPosition < 0) testimonialPosition = items.length - 1;
    if (testimonialPosition >= items.length) testimonialPosition = 0;
    
    track.style.transform = `translateX(-${testimonialPosition * 100}%)`;
}

// Auto-advance testimonials every 8 seconds
document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        if (document.getElementById('testimonialTrack')) {
            slideTestimonial(1);
        }
    }, 8000);
});

// ===== TASK 3.0: LIVE AVAILABILITY CALENDAR =====
const therapists = ['Priya', 'Anjali', 'Kavya', 'Neha', 'Deepa', 'Riya'];
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];
let selectedDate = null;

function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const calPrev = document.getElementById('calPrev');
    const calNext = document.getElementById('calNext');
    const calMonth = document.getElementById('calMonth');
    const timeSlots = document.getElementById('timeSlots');
    const closeBtn = document.getElementById('closeTimeSlots');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    
    if (!calendarGrid) return;
    
    let calendarStart = 0; // Start from today
    
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const today = new Date();
        
        // Update month display
        calMonth.textContent = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Generate 14 date cards
        for (let i = calendarStart; i < calendarStart + 14; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            
            const dateCard = document.createElement('div');
            dateCard.className = 'calendar-date-card';
            
            // Randomize availability (80% available, 20% full)
            const available = Math.random() > 0.2;
            const slotsCount = available ? Math.floor(Math.random() * 5) + 3 : 0;
            
            if (!available) {
                dateCard.classList.add('unavailable');
            }
            
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            const isToday = i === 0;
            
            if (isToday) {
                dateCard.classList.add('today');
            }
            
            dateCard.innerHTML = `
                <div class="date-day">${dayName}</div>
                <div class="date-num">${dayNum}</div>
                <div class="slots-available">${slotsCount} slots</div>
            `;
            
            if (available) {
                dateCard.onclick = () => showTimeSlots(date, dayName, dayNum);
            }
            
            calendarGrid.appendChild(dateCard);
        }
    }
    
    calPrev.onclick = () => {
        calendarStart = Math.max(0, calendarStart - 7);
        renderCalendar();
    };
    
    calNext.onclick = () => {
        if (calendarStart + 14 < 14) {
            calendarStart += 7;
            renderCalendar();
        }
    };
    
    function showTimeSlots(date, dayName, dayNum) {
        selectedDate = date;
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        document.getElementById('selectedDateTitle').textContent = `Selected: ${dayName}, ${dayNum} ${monthName}`;
        
        timeSlotsGrid.innerHTML = '';
        
        // Generate available time slots for selected date
        timeSlots.forEach(time => {
            const isAvailable = Math.random() > 0.3;
            const slot = document.createElement('div');
            slot.className = isAvailable ? 'time-slot available' : 'time-slot unavailable';
            
            if (isAvailable) {
                const therapist = therapists[Math.floor(Math.random() * therapists.length)];
                slot.innerHTML = `
                    <div class="slot-time">${time}</div>
                    <div class="slot-therapist">with ${therapist}</div>
                `;
                slot.onclick = () => {
                    alert(`✅ Booking confirmed!\nTime: ${time}\nDate: ${dayName}, ${dayNum} ${monthName}\nTherapist: ${therapist}\n\nComing soon: Full booking system`);
                };
            } else {
                slot.innerHTML = `
                    <div class="slot-time">${time}</div>
                    <div class="slot-status">FULL</div>
                `;
            }
            
            timeSlotsGrid.appendChild(slot);
        });
        
        timeSlots.style.display = 'block';
        calendarGrid.parentElement.style.display = 'none';
    }
    
    closeBtn.onclick = () => {
        timeSlots.style.display = 'none';
        calendarGrid.parentElement.style.display = 'block';
    };
    
    renderCalendar();
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initCalendar();
    }, 500);
});

// ===== TASK 4.0: BEFORE & AFTER GALLERY =====
const transformations = [
    { category: 'hair', before: '🎨 Dull Hair', after: '✨ Radiant Hair' },
    { category: 'hair', before: '😟 Damaged Hair', after: '💇 Silky Smooth' },
    { category: 'makeup', before: '🙂 Natural Look', after: '💄 Glam Makeup' },
    { category: 'makeup', before: '😊 Day Look', after: '✨ Bridal Makeup' },
    { category: 'skincare', before: '😔 Dull Skin', after: '🌟 Radiant Skin' },
    { category: 'skincare', before: '😣 Problem Skin', after: '✨ Clear Skin' }
];

let currentComparison = 0;
let comparisonFilter = 'all';

function initBeforeAfter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const container = document.getElementById('comparisonContainer');
    
    if (!filterTabs) return;
    
    filterTabs.forEach(tab => {
        tab.onclick = (e) => {
            filterTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            comparisonFilter = e.target.dataset.category;
            currentComparison = 0;
            renderComparison();
        };
    });
    
    renderComparison();
}

function renderComparison() {
    const container = document.getElementById('comparisonContainer');
    const filtered = comparisonFilter === 'all' 
        ? transformations 
        : transformations.filter(t => t.category === comparisonFilter);
    
    if (filtered.length === 0) return;
    
    const item = filtered[currentComparison % filtered.length];
    
    container.innerHTML = `
        <div class="comparison-item">
            <div class="comparison-image before">
                <div class="placeholder-before">${item.before}</div>
                <span class="label">BEFORE</span>
            </div>
            <div class="comparison-slider-handle" style="left: 50%"></div>
            <div class="comparison-image after">
                <div class="placeholder-after">${item.after}</div>
                <span class="label">AFTER</span>
            </div>
        </div>
        <div class="comparison-counter">${currentComparison + 1} / ${filtered.length}</div>
    `;
}

function slideBefore(direction) {
    const filtered = comparisonFilter === 'all' 
        ? transformations 
        : transformations.filter(t => t.category === comparisonFilter);
    
    currentComparison = (currentComparison + direction + filtered.length) % filtered.length;
    renderComparison();
}

// ===== TASK 5.0: MEMBERSHIP TIERS =====
const tiers = [
    {
        name: 'Gold',
        price: '₹499',
        period: '/year',
        discount: '5% OFF',
        featured: false,
        benefits: [
            '✓ 5% discount on all services',
            '✓ Birthday special - 10% extra',
            '✓ Priority booking',
            '✓ Free hair spa every quarter',
            '✓ Member exclusive offers'
        ]
    },
    {
        name: 'Platinum',
        price: '₹999',
        period: '/year',
        discount: '10% OFF',
        featured: true,
        benefits: [
            '✓ 10% discount on all services',
            '✓ Birthday special - 15% extra',
            '✓ Priority booking + faster slots',
            '✓ Free facial monthly',
            '✓ Exclusive events & workshops',
            '✓ Complimentary head massage'
        ]
    },
    {
        name: 'Diamond',
        price: '₹1999',
        period: '/year',
        discount: '15% OFF',
        featured: false,
        benefits: [
            '✓ 15% discount on all services',
            '✓ Birthday special - 20% extra',
            '✓ VIP priority booking',
            '✓ Free bridal package (₹8000 value)',
            '✓ Exclusive events & private sessions',
            '✓ Personal stylist consultation',
            '✓ Gift vouchers yearly'
        ]
    }
];

function initMembership() {
    const grid = document.querySelector('.tier-cards-grid');
    if (!grid) return;
    
    grid.innerHTML = tiers.map((tier, idx) => `
        <div class="tier-card ${tier.featured ? 'featured' : ''}">
            ${tier.featured ? '<div class="popular-badge">⭐ MOST POPULAR</div>' : ''}
            <h3 class="tier-name">${tier.name}</h3>
            <div class="tier-price">
                <span class="price">${tier.price}</span>
                <span class="period">${tier.period}</span>
            </div>
            <div class="tier-discount">${tier.discount}</div>
            <ul class="tier-benefits">
                ${tier.benefits.map(b => `<li>${b}</li>`).join('')}
            </ul>
            <button class="tier-btn ${tier.featured ? 'featured-btn' : ''}">Join ${tier.name}</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initBeforeAfter();
        initMembership();
    }, 500);
});

// ===== TASK 6.0: STAFF SPOTLIGHT CAROUSEL =====
const staffData = [
    {
        name: 'Priya Sharma',
        title: 'Hair Specialist',
        experience: '12 Years',
        specialties: ['Hair Coloring', 'Cutting', 'Treatments'],
        rating: 4.9,
        reviews: 245,
        emoji: '💇‍♀️'
    },
    {
        name: 'Anjali Patel',
        title: 'Makeup Artist',
        experience: '10 Years',
        specialties: ['Bridal Makeup', 'HD Makeup', 'Airbrush'],
        rating: 4.95,
        reviews: 312,
        emoji: '💄'
    },
    {
        name: 'Kavya Desai',
        title: 'Skincare Expert',
        experience: '8 Years',
        specialties: ['Facials', 'Anti-Aging', 'Treatments'],
        rating: 4.8,
        reviews: 198,
        emoji: '💆‍♀️'
    },
    {
        name: 'Neha Gupta',
        title: 'Nail Technician',
        experience: '7 Years',
        specialties: ['Gel Nails', 'Nail Art', 'Manicure'],
        rating: 4.85,
        reviews: 267,
        emoji: '💅'
    },
    {
        name: 'Deepa Singh',
        title: 'Spa Therapist',
        experience: '11 Years',
        specialties: ['Massage', 'Aromatherapy', 'Body Spa'],
        rating: 4.92,
        reviews: 289,
        emoji: '🧖‍♀️'
    },
    {
        name: 'Riya Verma',
        title: 'Threading Specialist',
        experience: '6 Years',
        specialties: ['Threading', 'Waxing', 'Beauty'],
        rating: 4.88,
        reviews: 224,
        emoji: '✨'
    }
];

let staffCarouselPosition = 0;

function initStaffCarousel() {
    const carousel = document.getElementById('staffCarousel');
    const prevBtn = document.getElementById('staffPrev');
    const nextBtn = document.getElementById('staffNext');
    const dotsContainer = document.getElementById('staffDots');
    
    if (!carousel) return;
    
    // Render staff cards
    carousel.innerHTML = staffData.map(staff => `
        <div class="staff-card">
            <div class="staff-avatar">${staff.emoji}</div>
            <h3 class="staff-name">${staff.name}</h3>
            <p class="staff-title">${staff.title}</p>
            <span class="staff-experience">📅 ${staff.experience} Experience</span>
            
            <div class="staff-rating">
                <span class="stars">★ ${staff.rating}</span>
                <span class="reviews">(${staff.reviews})</span>
            </div>
            
            <div class="staff-specialties">
                ${staff.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
            </div>
            
            <button class="staff-book-btn" onclick="alert('Booking with ${staff.name} - Coming soon!')">Book with ${staff.name.split(' ')[0]}</button>
        </div>
    `).join('');
    
    // Render dots
    dotsContainer.innerHTML = staffData.map((_, idx) => 
        `<span class="dot ${idx === 0 ? 'active' : ''}" onclick="goToStaff(${idx})"></span>`
    ).join('');
    
    // Navigation
    prevBtn.onclick = () => slideStaff(-1);
    nextBtn.onclick = () => slideStaff(1);
    
    updateStaffCarousel();
}

function slideStaff(direction) {
    const itemsPerView = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
    const maxPosition = Math.max(0, staffData.length - itemsPerView);
    
    staffCarouselPosition += direction;
    if (staffCarouselPosition < 0) staffCarouselPosition = maxPosition;
    if (staffCarouselPosition > maxPosition) staffCarouselPosition = 0;
    
    updateStaffCarousel();
}

function goToStaff(index) {
    staffCarouselPosition = index;
    updateStaffCarousel();
}

function updateStaffCarousel() {
    const carousel = document.getElementById('staffCarousel');
    const dotsContainer = document.getElementById('staffDots');
    
    if (carousel) {
        const cardWidth = 300;
        const gap = 20;
        carousel.style.transform = `translateX(-${staffCarouselPosition * (cardWidth + gap)}px)`;
    }
    
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === staffCarouselPosition);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initStaffCarousel();
        // Auto-rotate every 8 seconds
        setInterval(() => slideStaff(1), 8000);
    }, 500);
});
