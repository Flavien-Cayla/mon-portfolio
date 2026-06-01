document.addEventListener('DOMContentLoaded', () => {
    // Fix for fixed elements (cursor glow) breaking due to body transform animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1600);

    // Cursor Glow Effect
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15; // Snappier
        cursorY += dy * 0.15;

        cursorGlow.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    // Title Animation: Split letters
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        // We need to preserve the structure "Flavien <span class='gradient-text'>CAYLA</span>"
        // Get the nodes
        const nodes = Array.from(heroTitle.childNodes);
        heroTitle.innerHTML = ''; // Clear content

        let totalDelay = 0;

        nodes.forEach(node => {
            if (node.nodeType === 3) { // Text node (Flavien)
                const text = node.textContent;
                // Add letters
                text.split('').forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.classList.add('char-anim');
                    span.style.animationDelay = `${0.5 + (totalDelay * 0.05)}s`;
                    heroTitle.appendChild(span);
                    totalDelay++;
                });
            } else if (node.nodeType === 1) { // Element node (Span CAYLA)
                const text = node.textContent;
                // For the gradient text to work with animations, we might need to apply the class to each letter 
                // OR handle the nesting carefully. 
                // The issue is likely that 'transparent' text color with 3D transforms breaks the parent's background-clip.
                // Let's apply the gradient class to each letter BUT we need to adjust the CSS for gradient-text to work on inline-block.

                // Strategy: Create a container for layout, but apply animating class to children.
                // Actually, let's try just keeping the wrapper but ensuring it has the right display property, 
                // and maybe avoid 3D transforms if that's the culprit, OR apply the class to children.

                // SAFEST FIX: Apply class to children. The gradient will look slightly different (per letter) but it will appear.
                // To mitigate the "per letter gradient" look, we could try to simulate a continuous gradient, but that's complex.
                // Let's stick to per-letter gradient for visibility first.

                text.split('').forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.classList.add('char-anim');
                    // Add the class from the parent (e.g., gradient-text)
                    if (node.className) {
                        span.classList.add(node.className);
                    }
                    span.style.animationDelay = `${0.5 + (totalDelay * 0.05)}s`;
                    heroTitle.appendChild(span);
                    totalDelay++;
                });
            }
        });

        // 3D Tilt Effect on Title
        heroTitle.addEventListener('mousemove', (e) => {
            const rect = heroTitle.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 15 degrees)
            const rotateX = ((y - centerY) / centerY) * -15; // Invert Y for natural feel
            const rotateY = ((x - centerX) / centerX) * 15;

            // Apply transform
            heroTitle.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Add shadow depth based on rotation
            const shadowX = rotateY * -1;
            const shadowY = rotateX;
            heroTitle.style.textShadow = `${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.5)`;
        });

        heroTitle.addEventListener('mouseleave', () => {
            // Reset position
            heroTitle.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            heroTitle.style.textShadow = 'none';
            heroTitle.style.transition = 'transform 0.5s ease, text-shadow 0.5s ease';

            // Remove transition after it finishes to assume quick mousemove response
            setTimeout(() => {
                heroTitle.style.transition = '';
            }, 500);
        });
    }

    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            }
        });
    });

    // Tilt Effect for Cards
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Scroll Animation (Fade In)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .section-title, .cv-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    // Load More Projects
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenProjects = document.querySelectorAll('.hidden-project');
            hiddenProjects.forEach((project, index) => {
                project.style.display = 'block';
                // Add animation for appearance
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    project.style.transition = 'all 0.6s ease';
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                }, 50 + (index * 100));
            });

            // Hide button after clicking (or change text if you prefer toggle)
            loadMoreBtn.style.display = 'none';
        });
    }

    // Button Explosion Effect
    const buttons = document.querySelectorAll('.btn, .btn-contact, .project-links a, .download-btn, #load-more-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            // If it's a hash link, let it scroll but still explode
            // If it's a download/external link, maybe delay slightly? 
            // For now, we just explode immediately.

            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Create particles
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                document.body.appendChild(particle);

                // Random colors from the palette (Purple Theme)
                const colors = ['#a855f7', '#ec4899', '#7c3aed', '#ffffff'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.backgroundColor = randomColor;

                // Position at button center
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;

                // Random direction
                const tx = (Math.random() - 0.5) * 200; // -100 to 100
                const ty = (Math.random() - 0.5) * 200; // -100 to 100

                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);

                // Remove particle after animation
                particle.addEventListener('animationend', () => {
                    particle.remove();
                });
            }

            // Hide button
            this.classList.add('btn-hidden');

            // Reappear after 5 seconds
            setTimeout(() => {
                this.classList.remove('btn-hidden');
            }, 5000);
        });
    });
});

/* Contact Popup Feature */
function showContact(info) {
    // Check if popup exists, if not create it
    let popup = document.getElementById('contact-popup');
    let overlay = document.querySelector('.popup-overlay');

    if (!popup) {
        // Create Overlay
        overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        document.body.appendChild(overlay);

        // Create Popup
        popup = document.createElement('div');
        popup.id = 'contact-popup';
        document.body.appendChild(popup);

        // Close on overlay click
        overlay.addEventListener('click', hidePopup);
    }

    // Choose icon based on content
    let iconClass = info.includes('@') ? 'fas fa-envelope' : 'fas fa-phone';

    popup.innerHTML = `<i class="${iconClass}"></i>${info}`;

    // Show
    setTimeout(() => {
        overlay.classList.add('active');
        popup.classList.add('active');
    }, 10);
}

function hidePopup() {
    const popup = document.getElementById('contact-popup');
    const overlay = document.querySelector('.popup-overlay');
    if (popup && overlay) {
        popup.classList.remove('active');
        overlay.classList.remove('active');
    }
}
