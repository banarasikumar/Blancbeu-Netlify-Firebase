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
    let scrollTicking = false;
    let isTabSwitching = false;

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    let header = null;
    let navItems = null;
    let contentArea = null;  // This is the SCROLLABLE container

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        header = document.getElementById('mainHeader');
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
        }
    }

    function hideHeader() {
        if (header) {
            header.classList.add('hidden');
        }
    }

    function handleScroll() {
        if (isTabSwitching || !contentArea) return;

        const currentScrollY = contentArea.scrollTop;

        // Prevent negative scroll
        if (currentScrollY < 0) return;

        // Always show header when near top (UNLESS FORCED HIDDEN)
        if (currentScrollY <= CONFIG.HEADER_SHOW_ZONE) {
            if (!header.classList.contains('force-hidden')) {
                showHeader();
            }
            lastScrollY = currentScrollY;
            return;
        }

        const scrollDelta = currentScrollY - lastScrollY;

        // Only act if scroll delta exceeds threshold
        if (Math.abs(scrollDelta) < CONFIG.SCROLL_THRESHOLD) {
            return;
        }

        if (scrollDelta > 0) {
            // ↓ SCROLLING DOWN → Hide header
            hideHeader();
        } else {
            // ↑ SCROLLING UP → Show header immediately
            header.classList.remove('force-hidden'); // Unlock forced state
            showHeader();
        }

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
    function switchToTab(targetTabId, isActiveTabClick = false) {
        if (!targetTabId) return;

        // CASE A: Clicking the ACTIVE tab → Scroll to top smoothly
        if (targetTabId === currentTab && isActiveTabClick) {
            contentArea.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            showHeader();
            return;
        }

        // CASE B: Switching to a DIFFERENT tab
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
                if (page.getAttribute('data-page') === targetTabId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });

            // Also handle .app-page elements by ID
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
            currentTab = targetTabId;

            // 5. Restore scroll position and show header
            requestAnimationFrame(() => {
                const savedPosition = getScrollPosition(targetTabId);
                contentArea.scrollTop = savedPosition;

                showHeader();
                lastScrollY = savedPosition;

                setTimeout(() => {
                    isTabSwitching = false;
                }, 50);

                console.log(`📱 Tab: ${previousTab} → ${targetTabId} | Scroll: ${savedPosition}px`);
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

    // ==========================================
    // NOTIFY BUTTON
    // ==========================================
    function bindNotifyButton() {
        const notifyBtn = document.getElementById('notifyBtn');
        if (!notifyBtn) return;

        notifyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = notifyBtn.getAttribute('data-page') || 'notifications';

            if (targetPageId === currentTab) return;

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
