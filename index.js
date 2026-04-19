// Landing Page Scripts

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = getUser();

    // Render dynamic navbar
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
        navContainer.innerHTML = renderNavbar('home');
    }

    // Small intersection observer for reveal animations
    const features = document.querySelectorAll('.feature-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    features.forEach(card => observer.observe(card));
});
