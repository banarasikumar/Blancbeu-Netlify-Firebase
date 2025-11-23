// ========================================
// iOS Native Interactions & Gestures
// Spring animations, haptic feedback, touch handling
// ======================================== */

// iOS Spring Animation Configuration
const iOSSpring = {
  tension: 70,
  friction: 10,
  mass: 1
};

// Haptic Feedback Simulation (visual)
function triggerHaptic(type = 'light') {
  if (navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: [20, 10, 20],
      heavy: [50, 30, 50]
    };
    navigator.vibrate(patterns[type] || 10);
  }
}

// Tab item click with iOS spring animation
function setupTabInteractions() {
  const tabItems = document.querySelectorAll('.nav-item, .tab-item');
  
  tabItems.forEach(item => {
    item.addEventListener('touchstart', (e) => {
      triggerHaptic('light');
      e.target.closest('.nav-item, .tab-item')?.classList.add('haptic-feedback');
    });
    
    item.addEventListener('touchend', (e) => {
      e.target.closest('.nav-item, .tab-item')?.classList.remove('haptic-feedback');
    });
  });
}

// iOS-style momentum scrolling
function enableMomentumScrolling() {
  const scrollableElements = document.querySelectorAll('main, .tab-page');
  scrollableElements.forEach(el => {
    el.style.webkitOverflowScrolling = 'touch';
  });
}

// Pull-to-refresh simulation (iOS style)
let pullDistance = 0;
let isPulling = false;
const pullThreshold = 80;

function setupPullToRefresh() {
  let startY = 0;
  
  document.addEventListener('touchstart', (e) => {
    if (document.documentElement.scrollTop === 0) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    pullDistance = Math.max(0, currentY - startY);
    
    if (pullDistance > 0 && pullDistance < pullThreshold * 1.5) {
      const pullRefreshEl = document.querySelector('.pull-to-refresh');
      if (pullRefreshEl) {
        pullRefreshEl.style.opacity = Math.min(pullDistance / pullThreshold, 1);
        pullRefreshEl.style.transform = `scale(${Math.min(pullDistance / pullThreshold, 1)})`;
      }
    }
  });
  
  document.addEventListener('touchend', () => {
    if (pullDistance > pullThreshold) {
      refreshPage();
    }
    pullDistance = 0;
    isPulling = false;
    const pullRefreshEl = document.querySelector('.pull-to-refresh');
    if (pullRefreshEl) {
      pullRefreshEl.style.opacity = 0;
      pullRefreshEl.style.transform = 'scale(0)';
    }
  });
}

// iOS safe area aware viewport
function setupSafeAreaViewport() {
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no');
  }
}

// Smooth page transitions (iOS slide animation)
function setupPageTransitions() {
  const tabPages = document.querySelectorAll('.tab-page');
  
  tabPages.forEach((page, index) => {
    page.style.animation = `slideIn${index} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
  });
}

// Modal animations (iOS sheet style)
function setupModalAnimations() {
  const modals = document.querySelectorAll('.modal, .auth-modal, .tc-modal');
  
  modals.forEach(modal => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const isVisible = modal.style.display !== 'none' && modal.offsetParent !== null;
          if (isVisible) {
            modal.style.animation = 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
          }
        }
      });
    });
    
    observer.observe(modal, { attributes: true });
  });
}

// iOS keyboard management
function setupKeyboardManagement() {
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      // Delay to ensure keyboard animation completes
      setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    });
  });
}

// Status bar color management
function setupStatusBar() {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#000000');
    if (metaAppleStatusBar) metaAppleStatusBar.setAttribute('content', 'black-translucent');
  } else {
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
    if (metaAppleStatusBar) metaAppleStatusBar.setAttribute('content', 'default');
  }
}

// Prevent bounce scroll on iOS
function preventIOSBounce() {
  document.addEventListener('touchmove', (e) => {
    if (e.target.closest('input, textarea, select, button, a')) {
      return;
    }
    
    const scrollableParent = e.target.closest('main, [style*="overflow"]');
    if (!scrollableParent) {
      e.preventDefault();
    }
  }, { passive: false });
}

// Refresh page with iOS animation
function refreshPage() {
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
    spinner.style.opacity = '1';
    setTimeout(() => {
      location.reload();
    }, 800);
  }
}

// Button feedback on iOS
function setupButtonFeedback() {
  const buttons = document.querySelectorAll('button, .btn, .auth-btn');
  
  buttons.forEach(button => {
    button.addEventListener('touchstart', () => {
      triggerHaptic('light');
      button.style.opacity = '0.7';
    });
    
    button.addEventListener('touchend', () => {
      button.style.opacity = '1';
    });
  });
}

// Initialize all iOS interactions
function initializeIOSInteractions() {
  try {
    setupTabInteractions();
    enableMomentumScrolling();
    setupPullToRefresh();
    setupSafeAreaViewport();
    setupPageTransitions();
    setupModalAnimations();
    setupKeyboardManagement();
    setupStatusBar();
    preventIOSBounce();
    setupButtonFeedback();
    
    console.log('🍎 iOS Native Interactions initialized');
  } catch (e) {
    console.error('iOS interactions init error:', e);
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeIOSInteractions);
} else {
  setTimeout(initializeIOSInteractions, 100);
}

// Export for global use
window.triggerHaptic = triggerHaptic;
window.refreshPage = refreshPage;
window.initializeIOSInteractions = initializeIOSInteractions;
