// ===================================
// FORGE PRIME - JavaScript
// Forjado na Excelência
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // SPARKS ANIMATION
    // ===================================
    function createSparks() {
        const container = document.getElementById('sparks');
        const sparkCount = 15;

        for (let i = 0; i < sparkCount; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.className = 'spark';
                spark.style.left = Math.random() * 100 + '%';
                spark.style.animationDuration = (Math.random() * 3 + 2) + 's';
                spark.style.animationDelay = Math.random() * 2 + 's';
                container.appendChild(spark);

                setTimeout(() => {
                    spark.remove();
                }, 5000);
            }, i * 300);
        }
    }

    // Recriar faíscas periodicamente
    createSparks();
    setInterval(createSparks, 8000);

    // ===================================
    // NAVBAR SCROLL EFFECT
    // ===================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===================================
    // MOBILE MENU
    // ===================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

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

    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // ===================================
    // SMOOTH SCROLL
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // COUNTER ANIMATION
    // ===================================
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = current.toFixed(1) + suffix;
        }, 30);
    }

    // Intersection Observer para counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // ===================================
    // RESULT COUNTERS
    // ===================================
    const resultCounters = document.querySelectorAll('.counter');
    const resultObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = current.toFixed(1);
                }, 30);

                resultObserver.unobserve(counter);
            }
        });
    });

    resultCounters.forEach(counter => {
        resultObserver.observe(counter);
    });

    // ===================================
    // SCROLL REVEAL ANIMATION
    // ===================================
    const revealElements = document.querySelectorAll(
        '.solution-card, .service-card, .process-step, .team-card, .result-card, .pain-item, .niche-item, .testimonial-card'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ===================================
    // WHATSAPP FLOAT BUTTON VISIBILITY
    // ===================================
    const whatsappFloat = document.getElementById('whatsappFloat');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 500) {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.visibility = 'visible';
        } else {
            whatsappFloat.style.opacity = '0';
            whatsappFloat.style.visibility = 'hidden';
        }

        lastScrollTop = scrollTop;
    });

    // Inicialmente escondido
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.visibility = 'hidden';
    whatsappFloat.style.transition = 'opacity 0.3s, visibility 0.3s, transform 0.3s';

    // ===================================
    // PARALLAX EFFECT (desktop only)
    // ===================================
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-bg img, .cta-bg img');

            parallaxElements.forEach(el => {
                const speed = 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ===================================
    // HOVER EFFECTS ENHANCEMENT
    // ===================================
    const cards = document.querySelectorAll('.solution-card, .service-card, .result-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ===================================
    // LOADING ANIMATION
    // ===================================
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s';

        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===================================
    // CONSOLE BRANDING
    // ===================================
    console.log('%c🔥 FORGE PRIME 🔥', 'font-size: 24px; font-weight: bold; color: #C9A961;');
    console.log('%cForjado na Excelência | Impérios em Ascensão', 'font-size: 14px; color: #D4662C;');
    console.log('%cContato: (22) 98823-1811', 'font-size: 12px; color: #888;');
});