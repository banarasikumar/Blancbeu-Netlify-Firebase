/*
================================================================================
BLANCBEU SALON - HISTORY API ROUTER & NAVIGATION CONTROLLER
================================================================================
Features:
1. Modern History API Routing (Clean URLs)
2. Hybrid Routing: Supports standalone Pages and Sections within Pages (e.g., #offers on Home)
3. Header auto-hide on scroll down, show on scroll up (YouTube-style)
4. Tab scroll position memory (persists during session)
5. Active tab click scrolls to top
6. Deep linking support

IMPORTANT: This app uses #appContent as the scrollable container.
*/

(function () {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        SCROLL_THRESHOLD: 8,      // Minimum scroll delta to trigger hide/show
        HEADER_SHOW_ZONE: 60,     // Always show header when within this distance from top
        TAB_STORAGE_PREFIX: 'blancbeu_tab_scroll_',
        SCROLL_OFFSET: 80         // Offset for fixed header when scrolling to sections
    };

    // ==========================================
    // ROUTE MAPPING
    // ==========================================
    // Maps clean URLs to { tab, section? }
    const ROUTES = {
        '/': { tab: 'home' },
        '/index.html': { tab: 'home' },
        '/home': { tab: 'home' },

        // Home Sections
        '/offers': { tab: 'home', section: 'offers' },
        '/gallery': { tab: 'home', section: 'gallery' },
        '/reviews': { tab: 'home', section: 'reviews' },
        '/about': { tab: 'home', section: 'about' },
        '/faq': { tab: 'home', section: 'faq' },

        // Standalone Pages
        '/services': { tab: 'services' },
        '/mybookings': { tab: 'mybookings' },
        '/account': { tab: 'account' },
        '/chat': { tab: 'chat' },
        '/notifications': { tab: 'notifications' },
        '/login': { tab: 'login' },
        '/booking': { tab: 'booking' },
        '/profile-details': { tab: 'profile-details' }
    };

    // ==========================================
    // STATE
    // ==========================================
    let lastScrollY = 0;
    let currentTab = 'home';
    let lastNonNotificationTab = 'home';
    let scrollTicking = false;
    let isTabSwitching = false;

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    let header = null;
    let bottomNav = null;
    let navItems = null; // NodeList of all nav links
    let contentArea = null;

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        header = document.getElementById('mainHeader');
        bottomNav = document.querySelector('.app-shell-bottom-nav') || document.getElementById('bottomNav');
        navItems = document.querySelectorAll('nav a, .bottom-nav a'); // Select both top and bottom nav links
        contentArea = document.getElementById('appContent');

        if (!header || !contentArea) {
            console.error('❌ Router: Required elements not found');
            return;
        }

        // Disable browser's scroll restoration to handle it manually per-tab
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Bind Events
        bindScrollHandler();
        bindLinkInterception();
        bindPopState(); // Handle Back/Forward buttons
        bindNotifyButton();
        bindBrandIconClickHandler();

        // Handle Initial Route
        handleLocation();

        console.log('✅ History API Router Initialized (Hybrid Mode)');
    }

    // ==========================================
    // ROUTING LOGIC
    // ==========================================
    function getRouteInfo(pathname) {
        // Normalize path
        let cleanPath = pathname;
        if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
            cleanPath = cleanPath.slice(0, -1);
        }

        // Match known route
        if (ROUTES[cleanPath]) {
            return ROUTES[cleanPath];
        }

        // Fallback: If unknown path, default to Home
        // In a real app we might want a 404, but for SPA migration safety:
        return { tab: 'home' };
    }

    function handleLocation() {
        const path = window.location.pathname;
        const route = getRouteInfo(path);

        console.log(`📍 Route: ${path} ->`, route);

        // If we have a hash in the URL (legacy deep link or direct anchor), respect it if allowed
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            // If the hash matches a page ID, switch to it (Legacy)
            // Or if it matches a section, we might need to handle it.
            // But priority goes to Path Logic first.
        }

        switchToTab(route.tab, route.section);
    }

    function bindPopState() {
        window.addEventListener('popstate', () => {
            handleLocation();
        });
    }

    // Intercept all clicks on <a href="...">
    function bindLinkInterception() {
        document.addEventListener('click', (e) => {
            // Find closest anchor tag
            const link = e.target.closest('a');

            if (!link) return;
            const href = link.getAttribute('href');

            // Bypass logic
            if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            if (link.hasAttribute('data-no-route')) return;

            // Prevent default
            e.preventDefault();

            // Special Case: Click on Active Tab/Section -> Scroll Top or Scroll to Section
            const targetPath = href;

            // Navigate
            navigateTo(targetPath);
        });
    }

    function navigateTo(url) {
        // If it looks like an anchor link (#something), treat as section on CURRENT page if valid?
        // No, we migrated to Clean URLs. But some internal links might still start with # ?
        // We should support clean URLs primarily.

        if (url.startsWith('#')) {
            // Handle legacy hash navigation internally without changing URL path if possible?
            // Or map it.
            // For now, assume url is a path like '/services'
        }

        // Push state if different
        if (window.location.pathname !== url) {
            history.pushState(null, null, url);
        }

        handleLocation();
    }

    // Export for Global Usage
    window.navigateToPage = function (pageIdOrPath) {
        // Backward compatibility for calls like navigateToPage('booking')
        if (pageIdOrPath.startsWith('/')) {
            navigateTo(pageIdOrPath);
        } else {
            // Check if it's a known TAB alias
            // Find key in ROUTES where tab === pageIdOrPath
            // This is loose matching, ideal for legacy calls
            const routeEntry = Object.entries(ROUTES).find(([key, config]) => config.tab === pageIdOrPath && !config.section);

            if (routeEntry) {
                navigateTo(routeEntry[0]);
            } else {
                // If checking for a section-page combo?
                // For now, fallback to just switching UI (UI-only switch, no URL update)
                // This is risky but maintains app function if mapping missing
                console.warn(`Router: No direct URL map for ID '${pageIdOrPath}'. Switching Tab directly.`);
                switchToTab(pageIdOrPath);
            }
        }
    };

    // ==========================================
    // TAB SWITCHING & UI LOGIC
    // ==========================================
    function switchToTab(targetTabId, targetSectionId = null) {
        if (!targetTabId) return;

        const isSameTab = (currentTab === targetTabId);

        // 1. Save scroll of outgoing tab (if changing tabs)
        if (!isSameTab && currentTab) {
            try {
                sessionStorage.setItem(CONFIG.TAB_STORAGE_PREFIX + currentTab, contentArea.scrollTop.toString());
            } catch (e) { }
        }

        isTabSwitching = true;

        // 2. Update Nav UI (Active States)
        updateNavUI(targetTabId, targetSectionId);

        // 3. Toggle Pages Visibility
        if (!isSameTab) {
            togglePageVisibility(targetTabId);
        }

        // 4. Update State Variables
        if (!isSameTab) {
            const previousTab = currentTab;
            if (previousTab !== 'notifications' && previousTab !== null) {
                lastNonNotificationTab = previousTab;
            }
            currentTab = targetTabId;
        }

        // 5. Scroll Management
        requestAnimationFrame(() => {
            // Reset Header
            header.style.transform = 'translateY(0px)';
            currentTranslateY = 0;

            if (targetSectionId) {
                // SCROLL TO SECTION
                const sectionEl = document.getElementById(targetSectionId);
                if (sectionEl) {
                    // Calculate position
                    // We need to account for sticky header or not? 
                    // Usually appContent.scrollTop = section.offsetTop
                    // Since contentArea is the scroll container
                    contentArea.scrollTo({
                        top: sectionEl.offsetTop - CONFIG.SCROLL_OFFSET, // Leave space for header
                        behavior: 'smooth'
                    });
                } else {
                    console.warn(`Section #${targetSectionId} not found on tab ${targetTabId}`);
                }
            } else {
                // SCROLL TO TOP or RESTORE
                if (isSameTab) {
                    // If clicking same tab without section, scroll to top
                    contentArea.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // Restore position
                    const savedScroll = sessionStorage.getItem(CONFIG.TAB_STORAGE_PREFIX + targetTabId);
                    contentArea.scrollTop = savedScroll ? parseInt(savedScroll) : 0;
                }
            }

            // Header Class Logic (Login vs Normal)
            updateHeaderStyle(targetTabId);

            // Hooks
            handleTabHooks(targetTabId);

            setTimeout(() => { isTabSwitching = false; }, 100);
        });
    }

    function togglePageVisibility(targetTabId) {
        const allPages = contentArea.querySelectorAll('.app-page'); // Use class selector for speed
        let targetExists = false;

        allPages.forEach(page => {
            // Check both data-page and ID
            if (page.getAttribute('data-page') === targetTabId || page.id === targetTabId) {
                page.classList.add('active');
                targetExists = true;
            } else {
                page.classList.remove('active');
            }
        });

        if (!targetExists) {
            // Try fetching by ID directly if class lookup failed (fallback)
            const pageById = document.getElementById(targetTabId);
            if (pageById) pageById.classList.add('active');
            else console.error(`Page not found: ${targetTabId}`);
        }
    }

    function updateNavUI(targetTabId, targetSectionId) {
        // Determine active path relative to setup
        // We highlight the nav item that matches the current Route best
        const path = window.location.pathname; // This matches what triggered it

        // Loop all nav links
        if (navItems) {
            navItems.forEach(link => {
                const linkHref = link.getAttribute('href');
                const linkPage = link.getAttribute('data-page');

                // Match exact href (best for deep links like /offers)
                if (linkHref === path) {
                    link.classList.add('active');
                }
                // Or match by tab ID if no href match (fallback for bottom nav /services vs /services/sub)
                else if (linkPage === targetTabId && !targetSectionId) {
                    // Only highlight general tab if we aren't deep linked to a section?
                    // actually, if we are on /services, we want Services highlight.
                    link.classList.add('active');
                }
                else {
                    link.classList.remove('active');
                }
            });
        }
    }

    function updateHeaderStyle(targetTabId) {
        if (targetTabId === 'login') {
            header.classList.add('force-solid-header');
            header.classList.remove('immersive');
            document.body.classList.add('login-mode');
            if (bottomNav) bottomNav.style.display = 'none';
        } else {
            header.classList.remove('force-solid-header');
            document.body.classList.remove('login-mode');
            if (bottomNav) bottomNav.style.display = '';
        }
        handleScroll(true); // Immersive check
    }

    function handleTabHooks(targetTabId) {
        // Dispatch global event for decoupled listeners
        const event = new CustomEvent('routeChange', { detail: { page: targetTabId } });
        window.dispatchEvent(event);

        if (window.updateServiceCartVisibility) window.updateServiceCartVisibility();
        if (targetTabId === 'mybookings' && window.refreshBookings) window.refreshBookings();
        if (targetTabId === 'services' && window.onServicesPageVisible) window.onServicesPageVisible();
        if (targetTabId === 'booking' && window.onBookingPageVisible) window.onBookingPageVisible();
    }

    // ==========================================
    // SCROLL HANDLER (YouTube Style)
    // ==========================================
    let currentTranslateY = 0;
    const HEADER_HEIGHT = 80;

    function handleScroll(force = false) {
        if ((isTabSwitching && !force) || !contentArea || !header) return;

        // Login Exception
        if (currentTab === 'login') {
            header.style.transform = 'translateY(0)';
            return;
        }

        const currentScrollY = contentArea.scrollTop;
        if (currentScrollY < 0) return; // Bounce ignore

        const delta = currentScrollY - lastScrollY;
        currentTranslateY -= delta;

        // Clamp
        if (currentTranslateY > 0) currentTranslateY = 0;
        if (currentTranslateY < -HEADER_HEIGHT) currentTranslateY = -HEADER_HEIGHT;

        header.style.transform = `translateY(${currentTranslateY}px)`;

        // Immersive Check (Home only, near top)
        if (currentTab === 'home' && currentScrollY < 100) {
            // header.classList.add('immersive');
            // if (bottomNav) bottomNav.classList.add('immersive');
        } else {
            header.classList.remove('immersive');
            if (bottomNav) bottomNav.classList.remove('immersive');
        }

        document.documentElement.style.setProperty('--sticky-top', `${currentTranslateY}px`);
        lastScrollY = currentScrollY;
    }

    function bindScrollHandler() {
        contentArea.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    scrollTicking = false;

                    // Save Debounced
                    clearTimeout(window.saveScrollInfoTimeout);
                    window.saveScrollInfoTimeout = setTimeout(() => {
                        try {
                            sessionStorage.setItem(CONFIG.TAB_STORAGE_PREFIX + currentTab, contentArea.scrollTop.toString());
                        } catch (e) { }
                    }, 200);
                });
                scrollTicking = true;
            }
        }, { passive: true });
    }

    function showHeader() {
        if (header) {
            header.style.transform = 'translateY(0px)';
            currentTranslateY = 0;
        }
    }

    // ==========================================
    // NOTIFY BUTTON
    // ==========================================
    function bindNotifyButton() {
        const notifyBtn = document.getElementById('notifyBtn');
        if (!notifyBtn) return;

        notifyBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (currentTab === 'notifications') {
                // Back to previous
                const prevRoute = Object.keys(ROUTES).find(key => ROUTES[key].tab === lastNonNotificationTab && !ROUTES[key].section) || '/';
                navigateTo(prevRoute);
            } else {
                navigateTo('/notifications');
            }
        });
    }

    // ==========================================
    // BRAND ICON
    // ==========================================
    function bindBrandIconClickHandler() {
        const brandIconWrapper = document.querySelector('.brand-icon-wrapper');
        if (brandIconWrapper) {
            brandIconWrapper.style.cursor = 'pointer';
            brandIconWrapper.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/');
            });
        }
    }

    // ==========================================
    // BOOTSTRAP
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
