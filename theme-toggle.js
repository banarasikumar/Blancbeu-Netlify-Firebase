// Theme Toggle Logic
// document.addEventListener('DOMContentLoaded', () => {
//     const themeBtn = document.getElementById('themeToggle');
//     if (themeBtn) {
//         themeBtn.addEventListener('click', () => {
//             document.body.classList.toggle('light-mode');
//             const isLight = document.body.classList.contains('light-mode');
//             localStorage.setItem('theme', isLight ? 'light' : 'dark');
//             document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
//         });

//         // Initialize state based on localStorage or OS preference
//         const savedTheme = localStorage.getItem('theme');
//         if (savedTheme === 'light') {
//             document.body.classList.add('light-mode');
//             document.documentElement.setAttribute('data-theme', 'light');
//         }
//     }
// });
