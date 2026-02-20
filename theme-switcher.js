
/*
================================================================================
THEME SWITCHER LOGIC — 4 THEMES
================================================================================
*/

console.log('[Theme Switcher] Initializing...');

function toggleThemeMenu() {
    const menu = document.getElementById('theme-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const switcher = document.getElementById('theme-switcher');
    const menu = document.getElementById('theme-menu');
    if (switcher && !switcher.contains(e.target) && menu) {
        menu.classList.remove('active');
    }
});

function setTheme(themeName) {
    console.log(`[Theme Switcher] Setting theme to: ${themeName}`);

    // 1. Set Attribute on DocumentElement (html) for CSS variables
    document.documentElement.setAttribute('data-theme', themeName);

    // 2. Save Persistence
    localStorage.setItem('selected_theme', themeName);

    // 3. Update Meta Theme Color (for mobile browser tint)
    updateMetaThemeColor(themeName);

    // 4. Update active state in menu
    updateActiveThemeOption(themeName);

    // 5. Close Menu
    const menu = document.getElementById('theme-menu');
    if (menu) menu.classList.remove('active');
}

function updateMetaThemeColor(themeName) {
    const metaThemeColor = document.getElementById('metaThemeColor');
    let color = '#000000'; // Fallback

    switch (themeName) {
        case 'velvet': color = '#FBF9F7'; break;
        case 'pop': color = '#FFF9EE'; break;
        case 'olive': color = '#F7F9F6'; break;
        case 'blackgold': color = '#0A0A0A'; break;
    }

    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', color);
    }
}

function updateActiveThemeOption(themeName) {
    const options = document.querySelectorAll('.theme-option');
    options.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.getAttribute('data-theme') === themeName) {
            opt.classList.add('selected');
        }
    });
}

// Initialize Theme on Load
(function initTheme() {
    const savedTheme = localStorage.getItem('selected_theme') || 'velvet';
    setTheme(savedTheme);
})();

// Expose functions globally for HTML onclick attributes
window.toggleThemeMenu = toggleThemeMenu;
window.setTheme = setTheme;
