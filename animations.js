/**
 * Souvik Basu Portfolio - Premium Animations Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initCardGlows();
    initHeroMesh();
    initSocialMagnetButtons();
    initCounterTicker();
});

/**
 * 1. Scroll-Driven Reveal Observer
 */
function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Unobserve once revealed to save performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * 2. 3D Cursor Glow Cards
 */
function initCardGlows() {
    const glowCards = document.querySelectorAll('.serv-content .card, .projects-gallery .project-item, .blog-card, .tech-card');

    glowCards.forEach(card => {
        // Add indicator class
        card.classList.add('glow-card');

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Apply a slight 3D rotation tilt
            const cardWidth = rect.width;
            const cardHeight = rect.height;
            const centerX = cardWidth / 2;
            const centerY = cardHeight / 2;
            const rotateX = ((centerY - y) / centerY) * 5; // Max 5 deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.setProperty('--mouse-x', `-1000px`);
            card.style.setProperty('--mouse-y', `-1000px`);
        });
    });
}

/**
 * 3. Hero Radial Mesh Glow
 */
function initHeroMesh() {
    const heroSection = document.querySelector('.home');
    if (!heroSection) return;

    // Create glow mesh backdrop div dynamically
    const meshGlow = document.createElement('div');
    meshGlow.className = 'hero-mesh-glow';
    heroSection.appendChild(meshGlow);

    // Initial glow coordinates
    meshGlow.style.setProperty('--hero-glow-x', '50%');
    meshGlow.style.setProperty('--hero-glow-y', '50%');

    heroSection.addEventListener('mousemove', e => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        meshGlow.style.setProperty('--hero-glow-x', `${x}px`);
        meshGlow.style.setProperty('--hero-glow-y', `${y}px`);
    });
}

/**
 * 4. Social Media Magnet Buttons
 */
function initSocialMagnetButtons() {
    const magnetBtns = document.querySelectorAll('.social-link-btn, .filter-btn, .menu-btn');

    magnetBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Magnet pull strength (divide delta by a factor to damp it)
            btn.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0) scale(1.1)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
        });
    });
}

/**
 * 5. Counter Ticker (Count Up)
 */
function initCounterTicker() {
    const counters = document.querySelectorAll('.achievements .box .counter');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const valueText = target.innerText;
                const finalVal = parseInt(valueText.replace(/[^\d]/g, ''), 10);
                const hasPlus = valueText.includes('+');
                
                let startVal = 0;
                const duration = 1500; // Animation length in ms
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out quadratic
                    const easeProgress = progress * (2 - progress);
                    const currentVal = Math.floor(easeProgress * finalVal);
                    
                    target.innerText = currentVal + (hasPlus ? '+' : '');

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = valueText; // Final string confirmation
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(target); // Animate only once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}
