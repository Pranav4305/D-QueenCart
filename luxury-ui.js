document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = window.location.pathname.includes('admin.html');

    // ─── Custom Cursor (dot inside circle) ────────────────────────────────────
    // Only on non-touch / desktop devices
    if (window.matchMedia('(pointer: fine)').matches) {
        // 1. Inject CSS
        const cursorStyle = document.createElement('style');
        cursorStyle.textContent = `
            #lux-cursor-dot {
                position: fixed;
                width: 8px;
                height: 8px;
                background: #1a3a32;
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
                transition: transform 0.08s ease, width 0.2s ease, height 0.2s ease, background 0.2s ease;
                will-change: top, left;
            }
            #lux-cursor-ring {
                position: fixed;
                width: 36px;
                height: 36px;
                border: 1.5px solid rgba(26, 58, 50, 0.7);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99998;
                transform: translate(-50%, -50%);
                transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;
                will-change: top, left;
                opacity: 0;
            }
            body.lux-cursor-ready,
            body.lux-cursor-ready *,
            body.lux-cursor-ready a,
            body.lux-cursor-ready button,
            body.lux-cursor-ready input,
            body.lux-cursor-ready select,
            body.lux-cursor-ready textarea,
            body.lux-cursor-ready label {
                cursor: none !important;
            }
            body.lux-cursor-ready #lux-cursor-ring {
                opacity: 1;
            }
            body.lux-cursor-hover #lux-cursor-dot {
                width: 12px;
                height: 12px;
                background: #2a5a4a;
            }
            body.lux-cursor-hover #lux-cursor-ring {
                width: 52px;
                height: 52px;
                border-color: rgba(26, 58, 50, 0.9);
            }
            body.lux-cursor-click #lux-cursor-dot {
                transform: translate(-50%, -50%) scale(0.6);
            }
            body.lux-cursor-click #lux-cursor-ring {
                width: 28px;
                height: 28px;
            }
        `;
        document.head.appendChild(cursorStyle);

        // 2. Create elements
        const dot  = document.createElement('div');
        dot.id = 'lux-cursor-dot';
        const ring = document.createElement('div');
        ring.id = 'lux-cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        // 3. Track mouse — dot follows instantly, ring lags slightly
        let mx = -100, my = -100;  // start off-screen
        let rx = -100, ry = -100;
        let rafId;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
            document.body.classList.add('lux-cursor-ready');
        });

        // Smooth lag for ring
        function animateRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            rafId = requestAnimationFrame(animateRing);
        }
        animateRing();

        // 4. Hover expand — detect interactive elements
        const hoverTargets = 'a, button, input, select, textarea, label, [role="button"], .product-card, .cat-card, .btn-hero, .btn-shop, .btn-nav';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.add('lux-cursor-hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.remove('lux-cursor-hover');
            }
        });

        // 5. Click feedback
        document.addEventListener('mousedown', () => document.body.classList.add('lux-cursor-click'));
        document.addEventListener('mouseup',   () => document.body.classList.remove('lux-cursor-click'));

        // 6. Hide when leaving window
        document.addEventListener('mouseleave', () => {
            dot.style.opacity  = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity  = '1';
            ring.style.opacity = '1';
        });
    }
    // ─────────────────────────────────────────────────────────────────────────

    if (!isAdmin) {
        // 1. Inject Lenis Smooth Scrolling
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js';
        script.onload = () => {
            const lenis = new Lenis({
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                smoothTouch: false,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        };
        document.head.appendChild(script);

        // 2. High-End Scroll Reveals 
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('lux-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        // Target elements to animate
        const animateSelectors = [
            '.product-card', '.cat-card', '.stat-card', '.chart-card', '.card', 
            '.page-title', '.page-sub', '#cartItemsContainer .cart-item', '.order-summary'
        ];
        
        // Set up delayed stagger within containers
        setTimeout(() => {
            document.querySelectorAll(animateSelectors.join(', ')).forEach((el, index) => {
                el.classList.add('lux-hidden');
                // Stagger animation based on horizontal position or index
                const delay = (index % 4) * 0.1;
                el.style.transitionDelay = `${delay}s`;
                revealObserver.observe(el);
            });
        }, 100);

        // 3. Magnetic Hover Effects on Buttons
        const buttons = document.querySelectorAll('.btn-hero, .btn-shop, .btn-checkout, .btn-submit, .btn-nav, .primary');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Subtle magnetic pull
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        });

        // 4. Custom Hover interactions for product cards (Gloss effect)
        document.querySelectorAll('.product-card, .cat-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Dynamic glare effect based on mouse pos
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });
        });
    }



    // 6. Mobile Menu Toggle Logic
    initMobileMenu();

    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.querySelector('.nav-links');
        const navOverlay = document.getElementById('navOverlay');

        if (!menuToggle || !navLinks) {
            console.warn('Mobile menu elements not found:', { menuToggle, navLinks });
            return;
        }

        console.log('Mobile menu initialized');

        function openMenu() {
            menuToggle.classList.add('active');
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (navOverlay) navOverlay.classList.add('active');
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            if (navOverlay) navOverlay.classList.remove('active');
        }

        // Toggle menu on click
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

});

