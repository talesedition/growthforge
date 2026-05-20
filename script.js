document.addEventListener('DOMContentLoaded', function() {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll !== lastScroll) {
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                lastScroll = currentScroll;
            }
        }, { passive: true });
    }

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // Counter animation
    function animateCounter(element, target, suffix) {
        suffix = suffix || '';
        const duration = 1500;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (target - startValue) * easeOut;
            if (Number.isInteger(target)) {
                element.textContent = Math.round(current) + suffix;
            } else {
                element.textContent = current.toFixed(1) + suffix;
            }
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // Hero stats counter
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number[data-count]');
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        const suffix = counter.nextElementSibling ? counter.nextElementSibling.textContent : '';
                        animateCounter(counter, target, suffix);
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counterObserver.observe(statsSection);
    }

    // Results counters
    const resultCounters = document.querySelectorAll('.counter');
    if (resultCounters.length > 0) {
        const resultObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                    resultObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.3 });
        resultCounters.forEach(counter => resultObserver.observe(counter));
    }

    // Reveal animations
    const revealElements = document.querySelectorAll(
        '.solution-card, .service-card, .process-step, .team-card, .result-card, .pain-item, .niche-item'
    );
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -100px 0px' });
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    }

    // WhatsApp float button
    const whatsappFloat = document.getElementById('whatsappFloat');
    if (whatsappFloat) {
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.visibility = 'hidden';
        whatsappFloat.style.transition = 'opacity 0.3s, visibility 0.3s, transform 0.3s';
        let floatTicking = false;
        window.addEventListener('scroll', () => {
            if (!floatTicking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollTop > 500) {
                        whatsappFloat.style.opacity = '1';
                        whatsappFloat.style.visibility = 'visible';
                    } else {
                        whatsappFloat.style.opacity = '0';
                        whatsappFloat.style.visibility = 'hidden';
                    }
                    floatTicking = false;
                });
                floatTicking = true;
            }
        }, { passive: true });
    }

    // Niches carousel (mobile)
    (function initNichesCarousel() {
        if (!document.getElementById('nichesTrack')) return;
        const track = document.getElementById('nichesTrack');
        const dotsContainer = document.getElementById('nichesDots');
        if (!track || !dotsContainer) return;
        const items = track.querySelectorAll('.niche-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        let autoScrollInterval;
        let isInteracting = false;
        let resumeTimeout;
        const isMobile = () => window.innerWidth <= 768;

        function createDots() {
            dotsContainer.innerHTML = '';
            items.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Slide ' + (i + 1));
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    pauseAutoScroll();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            if (!isMobile()) return;
            currentIndex = index;
            const itemWidth = items[0].offsetWidth + 16;
            track.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
            updateDots();
        }

        function nextSlide() {
            if (!isMobile()) return;
            currentIndex = (currentIndex + 1) % items.length;
            goToSlide(currentIndex);
        }

        function startAutoScroll() {
            if (!isMobile()) return;
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                if (!isInteracting) nextSlide();
            }, 4000);
        }

        function pauseAutoScroll() {
            isInteracting = true;
            clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => { isInteracting = false; }, 5000);
        }

        let scrollTimeout;
        track.addEventListener('scroll', () => {
            if (!isMobile()) return;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const itemWidth = items[0].offsetWidth + 16;
                const newIndex = Math.round(track.scrollLeft / itemWidth);
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
                    currentIndex = newIndex;
                    updateDots();
                }
            }, 100);
        }, { passive: true });

        track.addEventListener('touchstart', pauseAutoScroll, { passive: true });
        track.addEventListener('touchend', pauseAutoScroll, { passive: true });

        createDots();
        startAutoScroll();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (isMobile()) {
                    createDots();
                    updateDots();
                    startAutoScroll();
                } else {
                    clearInterval(autoScrollInterval);
                    dotsContainer.innerHTML = '';
                    track.scrollTo({ left: 0, behavior: 'auto' });
                }
            }, 250);
        });
    })();

    // Console branding
    const logBranding = () => {
        console.log('%c🔥 FORJE PRIME 🔥', 'font-size: 24px; font-weight: bold; color: #C9A961;');
        console.log('%cForjado na Excelência | Impérios em Ascensão', 'font-size: 14px; color: #D4662C;');
        console.log('%cContato: (22) 98823-1811', 'font-size: 12px; color: #888;');
    };
    if ('requestIdleCallback' in window) {
        requestIdleCallback(logBranding, { timeout: 2000 });
    } else {
        setTimeout(logBranding, 1000);
    }
});