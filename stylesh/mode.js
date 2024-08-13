document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load the theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        toggle.checked = savedTheme === 'light-mode';
    } else {
        // Set default theme to dark-mode
        body.classList.add('dark-mode');
        toggle.checked = false; // checkbox should be unchecked for dark-mode
        localStorage.setItem('theme', 'dark-mode');
    }

    // Toggle theme on checkbox change
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark-mode');
        }
    });
});

