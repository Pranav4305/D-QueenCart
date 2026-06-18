document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = window.location.pathname.includes('admin.html');

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
        
        if (!menuToggle || !navLinks) {
            console.warn('Mobile menu elements not found:', { menuToggle, navLinks });
            return;
        }

        console.log('Mobile menu initialized');

        // Toggle menu on click
        menuToggle.addEventListener('click', (e) => {
            console.log('Menu toggle clicked');
            e.preventDefault();
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                console.log('Clicked outside - closing menu');
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Link clicked - closing menu');
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

});

