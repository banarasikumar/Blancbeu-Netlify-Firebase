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
      image: "assets/service_images/professional_hair_st_3fab25e9.webp",
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
      image: "assets/service_images/beautiful_woman_gett_9dc7243a.webp",
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
      image: "assets/service_images/facial_new.webp",
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
      image: "assets/service_images/professional_hair_st_673b25ad.webp",
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
      image: "assets/service_images/premium_hair_spa_nourish.webp",
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
      image: "assets/service_images/hair_colour_vibrant_pink.webp",
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
      image: "assets/service_images/makeup_styling_new.webp",
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
      image: "assets/service_images/nails_beauty_vibrant.webp",
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

function initCarousel() {
  const dots = document.getElementById('carouselDots');
  const slides = document.querySelectorAll('.carousel-slide');
  
  if (!dots || slides.length === 0) return;
  
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
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  
  console.log('▶️ Starting carousel auto-play');
  carouselInterval = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function moveCarousel(direction) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  
  if (slides.length === 0 || !slides[currentSlide] || !dots[currentSlide]) return;
  
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
  
  if (slides.length === 0 || !slides[currentSlide] || !dots[currentSlide]) return;
  
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
  if (!container) return;
  
  servicesData.groups.forEach(group => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'service-category';
    
    const headerHTML = `
      <div class="category-header">
        <div class="category-info">
          <h3 class="category-title">${group.icon} ${group.group}</h3>
        </div>
        <img src="${group.image}" alt="${group.group}" class="category-image" loading="lazy" decoding="async">
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
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function showTC() {
  window.location.href = '/terms.html';
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
    this.currentThemeColor = null;
    this.currentColorScheme = null;
    this.pollingInterval = null;
    
    this.init();
    this.startForcedThemePolling();
    this.setupMetaTagObserver();
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
  
  setupMetaTagObserver() {
    // Watch for any changes to meta tags and immediately correct them
    const config = { attributes: true, subtree: true, attributeFilter: ['content'] };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.tagName === 'META') {
          const name = mutation.target.getAttribute('name');
          if (name === 'theme-color' && this.currentThemeColor) {
            // Meta tag was changed, force our color back
            const currentContent = mutation.target.getAttribute('content');
            if (currentContent !== this.currentThemeColor) {
              mutation.target.setAttribute('content', this.currentThemeColor);
            }
          }
        }
      });
    });
    
    observer.observe(document.head, config);
  }
  
  startForcedThemePolling() {
    // Poll every 500ms to ensure system UI colors stay correct
    this.pollingInterval = setInterval(() => {
      this.enforceCurrentTheme();
    }, 500);
  }
  
  enforceCurrentTheme() {
    if (this.currentThemeColor) {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor && metaThemeColor.getAttribute('content') !== this.currentThemeColor) {
        metaThemeColor.setAttribute('content', this.currentThemeColor);
        void metaThemeColor.offsetHeight; // Force reflow
      }
      
      // Enforce color-scheme
      if (this.html.style.colorScheme !== this.currentColorScheme) {
        this.html.style.colorScheme = this.currentColorScheme;
      }
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
  
  updateSystemUIColor(colorValue, isLightMode) {
    // Store current theme for polling enforcement
    this.currentThemeColor = colorValue;
    this.currentColorScheme = isLightMode ? 'light' : 'dark';
    
    // Update meta tags immediately
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colorValue);
      void metaThemeColor.offsetHeight;
    }
    
    const metaById = document.getElementById('metaThemeColor');
    if (metaById) {
      metaById.setAttribute('content', colorValue);
      void metaById.offsetHeight;
    }
    
    document.documentElement.style.colorScheme = this.currentColorScheme;
    document.documentElement.style.setProperty('color-scheme', this.currentColorScheme, 'important');
    
    const appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleStatusBar) {
      appleStatusBar.setAttribute('content', isLightMode ? 'black' : 'black-translucent');
      void appleStatusBar.offsetHeight;
    }
    
    // Use retry waves for dynamic updates
    const updateWave = (delay) => {
      setTimeout(() => {
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', colorValue);
          void metaThemeColor.offsetHeight;
        }
        if (metaById) {
          metaById.setAttribute('content', colorValue);
          void metaById.offsetHeight;
        }
        document.documentElement.style.colorScheme = this.currentColorScheme;
        document.documentElement.style.setProperty('color-scheme', this.currentColorScheme, 'important');
      }, delay);
    };
    
    updateWave(50);
    updateWave(150);
    updateWave(300);
    updateWave(600);
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
    
    // Update system UI colors for light mode with retry mechanism
    this.updateSystemUIColor('#ffffff', true);
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
    
    // Update system UI colors for dark mode with retry mechanism
    this.updateSystemUIColor('#0a0a0a', false);
  }
}

function openDevModal() {
  const modal = document.getElementById('devModal');
  const modalBody = document.getElementById('devModalBody');
  if (modal) {
    // Reset modal body to show default "Coming Soon" content
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="dev-icon">🚀</div>
        <h2>✨ Coming Soon ✨</h2>
        <p class="dev-message">The App is under development</p>
        <p class="dev-subtitle">We're working to bring you amazing features! Stay tuned.</p>
        <div class="dev-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <button class="dev-action-btn" onclick="closeDevModal()">Got it!</button>
      `;
    }
    modal.style.display = 'flex';
    modal.style.animation = 'fadeInBackdrop 0.3s ease-out';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
}

function showTC() {
  const modal = document.getElementById('devModal');
  const modalBody = document.getElementById('devModalBody');
  const template = document.getElementById('tcModalTemplate');
  
  if (modal && modalBody && template) {
    const tcContent = template.content.cloneNode(true);
    modalBody.innerHTML = '';
    modalBody.appendChild(tcContent);
    modal.style.display = 'flex';
    modal.style.animation = 'fadeInBackdrop 0.3s ease-out';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
}

function closeDevModal() {
  const modal = document.getElementById('devModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
}

function openAccountModal() {
  console.log('🎯 openAccountModal() called');
  const modal = document.getElementById('accountModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    console.log('✅ Account Modal opened successfully');
  } else {
    console.error('❌ accountModal not found');
  }
}

function closeAccountModal() {
  const modal = document.getElementById('accountModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
}

function saveAccountChanges() {
  const name = document.getElementById('accountName').value;
  const phone = document.getElementById('accountPhone').value;
  const email = document.getElementById('accountEmail').value;
  
  localStorage.setItem('accountName', name);
  localStorage.setItem('accountPhone', phone);
  localStorage.setItem('accountEmail', email);
  
  console.log('✅ Account changes saved!');
  alert('✨ Changes saved successfully!');
}

function logoutAccount() {
  localStorage.removeItem('accountName');
  localStorage.removeItem('accountPhone');
  localStorage.removeItem('accountEmail');
  console.log('🚪 Logged out');
  closeAccountModal();
}

document.addEventListener('DOMContentLoaded', () => {
  const notificationsBtn = document.querySelector('[data-page="notifications"]');
  const bookingsBtn = document.querySelector('[data-page="bookings"]');
  const accountBtn = document.querySelector('[data-page="account"]');
  const termsBtn = document.querySelector('[data-page="terms"]');
  const termsButtons = document.querySelectorAll('[data-page="terms"]');
  const devModal = document.getElementById('devModal');

  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDevModal();
    });
  }

  if (bookingsBtn) {
    bookingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDevModal();
    });
  }

  if (accountBtn) {
    accountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAccountModal();
    });
  }

  termsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showTC();
    });
  });

  if (devModal) {
    devModal.addEventListener('click', (e) => {
      if (e.target === devModal) {
        closeDevModal();
        document.body.style.overflow = 'auto';
      }
    });
  }
});

// Initialize Update Checker FIRST (before anything else)
initUpdateChecker();

// Register Service Worker for PWA caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(registration => {
      console.log('✅ Service Worker registered for PWA offline-first caching');
      // Check for updates every 30 seconds
      setInterval(() => {
        registration.update();
      }, 30000);
    })
    .catch(error => console.log('Service Worker registration failed:', error));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeController();
  });
} else {
  new ThemeController();
}
