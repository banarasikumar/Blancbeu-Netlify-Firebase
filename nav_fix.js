/*
================================================================================
BLANCBEU SALON - YOUTUBE-STYLE HEADER & NAVIGATION CONTROLLER
================================================================================
Features:
1. Header auto-hide on scroll down, show on scroll up (YouTube-style)
2. Tab scroll position memory (persists during session)
3. Active tab click scrolls to top
4. Fresh app launch starts at top with Home tab

IMPORTANT: This app uses #appContent as the scrollable container, NOT window.
*/

(function () {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        SCROLL_THRESHOLD: 8,      // Minimum scroll delta to trigger hide/show (prevents jitter)
        HEADER_SHOW_ZONE: 60,     // Always show header when within this distance from top
        TAB_STORAGE_PREFIX: 'blancbeu_tab_scroll_'
    };

    // ==========================================
    // STATE
    // ==========================================
    let lastScrollY = 0;
    let currentTab = 'home';
    let lastNonNotificationTab = 'home'; // Track where to return to
    let scrollTicking = false;
    let isTabSwitching = false;

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    let header = null;
    let bottomNav = null;
    let navItems = null;
    let contentArea = null;  // This is the SCROLLABLE container

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        header = document.getElementById('mainHeader');
        bottomNav = document.querySelector('.app-shell-bottom-nav') || document.getElementById('bottomNav');
        navItems = document.querySelectorAll('.nav-item');
        contentArea = document.getElementById('appContent');

        if (!header) {
            console.error('❌ YouTube Nav Fix: #mainHeader not found');
            return;
        }

        if (!contentArea) {
            console.error('❌ YouTube Nav Fix: #appContent not found');
            return;
        }

        // Disable browser's scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Clear stored scroll positions on fresh app load
        clearStoredScrollPositions();

        // Start at top
        contentArea.scrollTop = 0;
        lastScrollY = 0;

        // Bind event listeners
        bindScrollHandler();
        bindNavClickHandlers();
        bindNotifyButton();

        // Handle initial hash (Deep Linking) immediately
        handleInitialHash();

        // FORCE INITIAL CHECK with a slight delay to ensure DOM paint
        setTimeout(() => {
            handleScroll(true);
        }, 100);

        console.log('✅ YouTube-Style Navigation Controller Initialized (using #appContent scroll)');
    }



    // ==========================================
    // SCROLL POSITION STORAGE
    // ==========================================
    function saveScrollPosition(tabName, position) {
        try {
            sessionStorage.setItem(CONFIG.TAB_STORAGE_PREFIX + tabName, position.toString());
        } catch (e) { }
    }

    function getScrollPosition(tabName) {
        try {
            const stored = sessionStorage.getItem(CONFIG.TAB_STORAGE_PREFIX + tabName);
            return stored ? parseInt(stored, 10) : 0;
        } catch (e) {
            return 0;
        }
    }

    function clearStoredScrollPositions() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(CONFIG.TAB_STORAGE_PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => sessionStorage.removeItem(key));
        } catch (e) { }
    }

    // ==========================================
    // HEADER VISIBILITY (YouTube-style)
    // ==========================================
    function showHeader() {
        if (header) {
            header.classList.remove('hidden');
            document.body.classList.remove('header-hidden');
        }
    }

    function hideHeader() {
        if (header) {
            header.classList.add('hidden');
            document.body.classList.add('header-hidden');
        }
    }

    // ==========================================
    // PHYSICAL SCROLL HEADER LOGIC
    // ==========================================
    let currentTranslateY = 0;
    const HEADER_HEIGHT = 80;

    function handleScroll(force = false) {
        if ((isTabSwitching && !force) || !contentArea || !header) return;

        // Check if auth modal is open - if so, ensure header is visible
        const authModal = document.getElementById('authModal');
        if (authModal && window.getComputedStyle(authModal).display !== 'none') {
            header.style.transform = 'translateY(0)';
            currentTranslateY = 0;
            return;
        }

        const currentScrollY = contentArea.scrollTop;

        // Prevent negative scroll handling (overscroll bounce)
        if (currentScrollY < 0) return;

        // Calculate how much we scrolled since last frame
        const delta = currentScrollY - lastScrollY;

        // Update the translation based on scroll direction
        // Scrolling DOWN (delta > 0) -> Move header UP (negative translate)
        // Scrolling UP (delta < 0)   -> Move header DOWN (positive translate)
        currentTranslateY -= delta;

        // Clamp the translation:
        // 1. Cannot go lower than 0 (fully visible) - stops it from floating down
        // 2. Cannot go higher than -HEADER_HEIGHT (fully hidden)
        if (currentTranslateY > 0) currentTranslateY = 0;
        if (currentTranslateY < -HEADER_HEIGHT) currentTranslateY = -HEADER_HEIGHT;

        // Apply physical transformation
        header.style.transform = `translateY(${currentTranslateY}px)`;

        // IMMERSIVE HEADER LOGIC (Transparency over hero)
        // STRICT CHECK: Only apply on Home page when near the top
        // Verify against DOM to ensure we are truly on home page
        const activePage = document.querySelector('.app-page.active');
        let isHomePageActive = activePage && activePage.getAttribute('data-page') === 'home';

        // Fallback: If DOM is not ready or transitioning, rely on internal state
        if ((!activePage || isTabSwitching) && currentTab === 'home') {
            isHomePageActive = true;
        }

        if (isHomePageActive && currentScrollY < 100) {
            header.classList.add('immersive');
            if (bottomNav) bottomNav.classList.add('immersive');
        } else {
            header.classList.remove('immersive');
            if (bottomNav) bottomNav.classList.remove('immersive');
        }

        // SYNC STICKY CONTROLS
        const stickyTop = currentTranslateY; // Ranges from 0 to -80
        document.documentElement.style.setProperty('--sticky-top', `${stickyTop}px`);

        lastScrollY = currentScrollY;
    }

    function bindScrollHandler() {
        // Listen on the CONTENT AREA, not window
        contentArea.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });
    }

    // ==========================================
    // TAB NAVIGATION
    // ==========================================
    // GLOBAL EXPORT for other scripts (like booking.js)
    window.navigateToPage = function (pageId) {
        console.log(`Global navigation requested to: ${pageId}`);
        switchToTab(pageId);
    };

    function switchToTab(targetTabId, isActiveTabClick = false) {
        if (!targetTabId) return;

        // CASE A: Clicking the ACTIVE tab
        if (targetTabId === currentTab) {
            // CHECK IF ACTUALLY VISIBLE
            // If the element is not active, we must force switch (Fix for Booking Page issue)
            const targetPage = document.querySelector(`[data-page="${targetTabId}"]`);
            const isVisible = targetPage && targetPage.classList.contains('active');

            if (isVisible) {
                // It is visible, so just scroll to top
                if (isActiveTabClick) {
                    contentArea.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    showHeader();
                }
                return;
            } else {
                // It matches currentTab but is NOT visible? 
                // This means internal state drift (e.g. booking.js hid it manually). 
                // Force proceed to CASE B.
                console.warn(`[NavFix] State mismatch: ${targetTabId} is current but hidden. Forcing re-render.`);
                currentTab = null; // Reset currentTab to force clean switch
            }
        }

        // CASE B: Switching to a DIFFERENT tab (or fixing state)
        if (targetTabId !== currentTab) {
            isTabSwitching = true;

            // 1. Save current tab's scroll position
            saveScrollPosition(currentTab, contentArea.scrollTop);

            // 2. Update nav item active states
            navItems.forEach(nav => {
                const navPage = nav.getAttribute('data-page');
                if (navPage === targetTabId) {
                    nav.classList.add('active');
                } else {
                    nav.classList.remove('active');
                }
            });

            // 3. Hide all pages, show target page
            const allPages = contentArea.querySelectorAll('[data-page]');

            allPages.forEach(page => {
                const pId = page.getAttribute('data-page');
                if (pId === targetTabId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });

            // Also handle .app-page elements by ID (Redundant but safe)
            const appPages = document.querySelectorAll('.app-page');
            appPages.forEach(page => {
                if (page.id === targetTabId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });

            // 4. Update current tab state
            const previousTab = currentTab;

            // Track history for toggle back feature
            if (previousTab !== 'notifications' && previousTab !== null) {
                lastNonNotificationTab = previousTab;
            }

            currentTab = targetTabId;

            // Update URL hash without finding scrolling (history API)
            // This allows users to copy the URL and share specific tabs
            if (history.replaceState) {
                history.replaceState(null, null, `#${targetTabId}`);
            } else {
                window.location.hash = targetTabId;
            }

            // 5. Restore scroll position and show header
            requestAnimationFrame(() => {
                const savedPosition = getScrollPosition(targetTabId);
                contentArea.scrollTop = savedPosition;

                // FORCE RESET HEADER TO TOP ON TAB SWITCH
                // We don't want to inherit the hidden state from the previous tab
                header.style.transform = 'translateY(0px)';
                currentTranslateY = 0;
                document.documentElement.style.setProperty('--sticky-top', '80px');

                // Force immediate check of header transparency/state
                handleScroll(true);

                // If the restored position is deep, the header might need to be hidden?
                // User requirement: "when any tab page it on the topmost ... then it should be displyed"
                // Actually, user said: "it does not even need to check the scroll position... 
                // it shoud be displed above the page on top of the page by default."
                // So resetting to 0 is correct.

                lastScrollY = savedPosition;

                setTimeout(() => {
                    isTabSwitching = false;
                }, 50);

                console.log(`📱 Tab: ${previousTab} → ${targetTabId} | Scroll: ${savedPosition}px`);

                // Update Service Cart Visibility (Fix for sticky cart bar on home)
                if (window.updateServiceCartVisibility) {
                    window.updateServiceCartVisibility();
                }

                // FIX: Refresh Bookings if navigating to mybookings
                if (targetTabId === 'mybookings' && window.refreshBookings) {
                    console.log("🔄 Navigating to Bookings -> Refreshing Data...");
                    window.refreshBookings();
                }
            });
        }
    }

    function bindNavClickHandlers() {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetTabId = item.getAttribute('data-page');

                // Allow external links
                const href = item.getAttribute('href');
                if (href && (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:'))) {
                    return;
                }

                e.preventDefault();
                const isActiveTabClick = item.classList.contains('active');
                switchToTab(targetTabId, isActiveTabClick);
            });
        });
    }

    function handleInitialHash() {
        // Immediate check, no timeout
        const hash = window.location.hash.substring(1);
        console.log('🔍 [NavFix] Initial Hash Check:', hash);

        if (hash) {
            const targetTab = document.querySelector(`.nav-item[data-page="${hash}"]`);
            if (targetTab) {
                console.log("Deep linking to tab:", hash);
                switchToTab(hash);
            }
        } else {
            console.log('🏠 [NavFix] No hash found, defaulting to HOME');
            // No hash -> Default to Home
            switchToTab('home');
        }
    }

    // Listen for hash changes (Manual URL updates)
    window.addEventListener('hashchange', handleInitialHash);

    // ==========================================
    // NOTIFY BUTTON
    // ==========================================
    function bindNotifyButton() {
        const notifyBtn = document.getElementById('notifyBtn');
        if (!notifyBtn) return;

        notifyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = notifyBtn.getAttribute('data-page') || 'notifications';

            if (targetPageId === currentTab) {
                // TOGGLE FEATURE: If already on notifications, go back
                if (targetPageId === 'notifications') {
                    console.log(`🔙 Toggling Notifications OFF -> Returning to ${lastNonNotificationTab}`);
                    switchToTab(lastNonNotificationTab || 'home');

                    // Remove active state from notify button
                    notifyBtn.classList.remove('active');
                }
                return;
            }

            // Create visual active state for the button
            if (targetPageId === 'notifications') {
                notifyBtn.classList.add('active');
            } else {
                notifyBtn.classList.remove('active');
            }

            saveScrollPosition(currentTab, contentArea.scrollTop);
            currentTab = targetPageId;

            navItems.forEach(nav => nav.classList.remove('active'));

            // Hide all, show target
            const allPages = contentArea.querySelectorAll('[data-page]');
            allPages.forEach(p => p.classList.remove('active'));

            const targetPages = contentArea.querySelectorAll(`[data-page="${targetPageId}"]`);
            targetPages.forEach(p => p.classList.add('active'));

            // Also by ID
            const appPages = document.querySelectorAll('.app-page');
            appPages.forEach(page => page.classList.remove('active'));
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) targetPage.classList.add('active');

            requestAnimationFrame(() => {
                contentArea.scrollTop = 0;
                showHeader();
                lastScrollY = 0;
            });
        });
    }

    // ==========================================
    // CONTINUOUS SCROLL SAVING
    // ==========================================
    let saveScrollTimeout = null;

    function setupScrollSaving() {
        contentArea.addEventListener('scroll', () => {
            if (isTabSwitching) return;

            clearTimeout(saveScrollTimeout);
            saveScrollTimeout = setTimeout(() => {
                saveScrollPosition(currentTab, contentArea.scrollTop);
            }, 200);
        }, { passive: true });
    }

    // ==========================================
    // INIT ON DOM READY
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupScrollSaving();
        });
    } else {
        init();
        setupScrollSaving();
    }

})();
