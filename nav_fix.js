/*
================================================================================
BLANCBEU SALON - NAVIGATION & SCROLL FIX
================================================================================
Handles:
1. Header Scroll Behavior (Auto-hide/Show)
2. Tab Switching with Scroll Memory
3. Active Tab Click (Scroll to Top)
*/

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const header = document.getElementById('mainHeader');
    const navItems = document.querySelectorAll('.nav-item');
    const appPages = document.querySelectorAll('.app-page');
    
    // State
    let lastScrollTop = 0;
    let currentTab = 'home'; // Default start tab
    const tabScrollPositions = {
        'home': 0,
        'services': 0,
        'bookings': 0,
        'chat': 0,
        'account': 0,
        'notifications': 0,
        'reviews': 0 // if it exists as a separate page
    };

    // Initialize - Reset scroll on load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ==========================================
    // 1. HEADER SCROLL BEHAVIOR
    // ==========================================
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Prevent negative scrolling (iOS bounce)
        if (scrollTop < 0) return;

        // Determine direction
        if (scrollTop > lastScrollTop && scrollTop > 60) {
            // SCROLL DOWN -> HIDE HEADER
            header.classList.add('hidden');
        } else {
            // SCROLL UP -> SHOW HEADER
            // Also show if at very top
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });

    // ==========================================
    // 2. TAB SWITCHING LOGIC
    // ==========================================
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetPageId = item.getAttribute('data-page');
            if (!targetPageId) return;

            // CASE A: CLICKING ACTIVE TAB
            if (targetPageId === currentTab) {
                // Scroll to top smoothly
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            // CASE B: SWITCHING TABS
            
            // 1. Save current scroll position
            tabScrollPositions[currentTab] = window.scrollY;

            // 2. Update UI (Active States)
            
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked item
            item.classList.add('active');

            // Hide all pages
            appPages.forEach(page => {
                page.classList.remove('active');
                // Ensure display none/block is handled by CSS .active class
                // Usually: .app-page { display: none; } .app-page.active { display: block; }
            });

            // Show target page
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            // 3. Update State
            currentTab = targetPageId;

            // 4. Restore Scroll Position for new tab
            // Use setTimeout to ensure DOM render before scrolling
            setTimeout(() => {
                const savedScroll = tabScrollPositions[targetPageId] || 0;
                window.scrollTo({
                    top: savedScroll,
                    behavior: 'auto' // Instant restore, no smooth scroll for tab switch
                });
                
                // 5. Ensure Header is Visible
                header.classList.remove('hidden');
                // Reset lastScrollTop to avoid immediate hide on next small scroll
                lastScrollTop = savedScroll; 
            }, 0);
        });
    });

    // Handle "Notify" button (which acts like a tab switcher to notifications)
    const notifyBtn = document.getElementById('notifyBtn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', (e) => {
            const targetPageId = notifyBtn.getAttribute('data-page'); // 'notifications'
            // Treat as tab switch, but we don't have a bottom nav item to highlight maybe?
            // Or we check if there is a nav item for it.
            // For now, simple manual switch:
            
            if (currentTab === targetPageId) return;

            tabScrollPositions[currentTab] = window.scrollY;
            currentTab = targetPageId;

            appPages.forEach(page => page.classList.remove('active'));
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) targetPage.classList.add('active');

            // Deactivate bottom nav items since we are on a page not in bottom nav (maybe?)
             navItems.forEach(nav => nav.classList.remove('active'));

             setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
                header.classList.remove('hidden');
                lastScrollTop = 0;
            }, 0);
        });
    }

    console.log('✅ Navigation Fix Loaded: Header Scroll & Tab Memory Active');
});
