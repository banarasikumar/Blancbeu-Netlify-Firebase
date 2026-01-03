
// ================================================================================
// NAVIGATION HANDLER FOR NEW NOTIFY BUTTON
// ================================================================================
document.addEventListener('DOMContentLoaded', () => {
    const notifyBtn = document.getElementById('notifyBtn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Update Active Page
            document.querySelectorAll('.app-page').forEach(page => {
                page.classList.remove('active');
            });

            const notifyPage = document.getElementById('notifications');
            if (notifyPage) {
                notifyPage.classList.add('active');
                window.scrollTo(0, 0);
            }

            // 2. Update Bottom Nav State (Deselect all)
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });

            // 3. Update Header styling if needed (optional)
            // Close mobile menu if open (if applicable)
        });
    }

    // Ensure Services link works too (Hash based)
    // The default anchor behavior might work, but if there's a custom router, we might need this:
    const servicesLinks = document.querySelectorAll('a[href="#services"]');
    servicesLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Let default hash behavior happen for scrolling?
            // Or if it's supposed to be a page:
            // Check if there is a specific #services PAGE vs SECTION
            // The implementation plan assumes #services is a SECTION on the home page or separate page.
            // Looking at HTML, there is <section id="services" ...> INSIDE <main>.
            // Wait, <section id="home"> contains hero/etc.
            // <section id="services"> is a sibling of #offers, #gallery inside <main>.
            // BUT #home is class="app-page active".
            // Are #services, #gallery separate PAGES or sections inside Home?
            // HTML line 234: <main ...>
            // Line 245: <section id="home" class="app-page active">
            // Line 1064: <section id="notifications" class="app-page">
            // This implies ONLY #home and #notifications are top-level "pages".
            // Where is #services?
            // Use grep to check if #services is INSIDE #home or sibling.
        });
    });
});
