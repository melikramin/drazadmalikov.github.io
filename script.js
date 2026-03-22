// ===========================
// DOM READY
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initAccordion();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initActiveNavOnScroll();
    initDragScroll();
    initGalleryNav();
});

// ===========================
// NAVBAR
// ===========================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('navMenu');

    let lastScrollY = 0;
    let ticking = false;

    function onScroll() {
        const currentY = window.scrollY;

        // Add/remove scrolled background
        if (currentY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
            navbar.classList.remove('navbar--hidden');
        }

        // Hide on scroll down, show on scroll up
        if (currentY > 200) {
            if (currentY > lastScrollY + 5) {
                // Scrolling down
                navbar.classList.add('navbar--hidden');
            } else if (currentY < lastScrollY - 5) {
                // Scrolling up
                navbar.classList.remove('navbar--hidden');
            }
        }

        lastScrollY = currentY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    });

    // Mobile burger menu
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
    });

    // Close menu on link click
    const navLinks = menu.querySelectorAll('.navbar__link, .navbar__cta');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            menu.classList.remove('active');
        });
    });

    // Scroll hint click
    const scrollHint = document.getElementById('scrollHint');
    if (scrollHint) {
        scrollHint.addEventListener('click', () => {
            const about = document.getElementById('about');
            if (about) about.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ===========================
// ACCORDION
// ===========================
function initAccordion() {
    const items = document.querySelectorAll('.accordion__item');

    items.forEach(item => {
        const trigger = item.querySelector('.accordion__trigger');

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('accordion__item--open');

            // Close all items and set aria-expanded to false
            items.forEach(otherItem => {
                otherItem.classList.remove('accordion__item--open');
                const otherTrigger = otherItem.querySelector('.accordion__trigger');
                if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it was closed
            if (!isOpen) {
                item.classList.add('accordion__item--open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// ===========================
// SMOOTH SCROLL
// ===========================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================
// SCROLL ANIMATIONS
// ===========================
function initScrollAnimations() {
    // Add animate-on-scroll class to sections
    const sections = document.querySelectorAll(
        '.stats, .about, .operations-showcase, .operations, .timeline, .articles, .reviews, .blog, .cta, .contact'
    );

    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===========================
// ACTIVE NAV ON SCROLL
// ===========================
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    const sectionMap = {
        'hero': 'Əsas səhifə',
        'about': 'Haqqımda',
        'operations': 'Əməliyyatlar',
        'operations-showcase': 'Əməliyyatlar',
        'articles': 'Məqalələr',
        'contact': 'Əlaqə'
    };

    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = document.getElementById('navbar').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        const activeName = sectionMap[current] || '';

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.textContent.trim() === activeName) {
                link.classList.add('active');
            }
        });
    });
}

// ===========================
// CONTACT FORM
// ===========================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = form.querySelector('input[type="text"]').value;
        const phone = form.querySelector('input[type="tel"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const type = form.querySelector('select').value;
        const message = form.querySelector('textarea').value;

        // Build WhatsApp message
        let whatsappMsg = `Salam, Dr. Azad Məlikov!\n\n`;
        whatsappMsg += `Ad: ${name}\n`;
        whatsappMsg += `Telefon: ${phone}\n`;
        if (email) whatsappMsg += `Email: ${email}\n`;
        if (type) whatsappMsg += `Görüş növü: ${type}\n`;
        if (message) whatsappMsg += `Mesaj: ${message}\n`;

        const whatsappUrl = `https://wa.me/994504278993?text=${encodeURIComponent(whatsappMsg)}`;
        window.open(whatsappUrl, '_blank');

        form.reset();
    });
}

// ===========================
// COUNTER ANIMATION
// ===========================
function animateCounters() {
    const counters = document.querySelectorAll('.hero__stat-num, .cta__stat-num');

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animateNumber(el) {
        const original = el.textContent.trim();
        const match = original.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[1]);
        const prefix = original.substring(0, original.indexOf(match[1]));
        const suffix = original.substring(original.indexOf(match[1]) + match[1].length);
        const duration = 1800;
        const start = performance.now();

        el.textContent = prefix + '0' + suffix;

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(eased * target);

            el.textContent = prefix + current + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);

// ===========================
// SHOWCASE CAROUSEL
// ===========================
function initDragScroll() {
    const carousel = document.getElementById('showcaseCarousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.showcase__slide');
    const dots = document.querySelectorAll('.showcase__dot');
    const prevBtn = document.getElementById('showcasePrev');
    const nextBtn = document.getElementById('showcaseNext');
    const currentEl = document.getElementById('showcaseCurrent');
    const totalEl = document.getElementById('showcaseTotal');

    let current = 0;
    const total = slides.length;
    let autoplayTimer;
    let touchStartX = 0;
    let touchEndX = 0;

    if (totalEl) totalEl.textContent = total;

    function goToSlide(index) {
        // Wrap around
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;

        // Remove active from current
        slides[current].classList.remove('showcase__slide--active');
        dots[current].classList.remove('showcase__dot--active');

        // Set new
        current = index;
        slides[current].classList.add('showcase__slide--active');
        dots[current].classList.add('showcase__dot--active');

        if (currentEl) currentEl.textContent = current + 1;
    }

    function nextSlide() {
        goToSlide(current + 1);
    }

    function prevSlide() {
        goToSlide(current - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    // Button events
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    // Dot events
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.index, 10);
            goToSlide(idx);
            startAutoplay();
        });
    });

    // Touch swipe support
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide(); else prevSlide();
            startAutoplay();
        }
    }, { passive: true });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
        if (e.key === 'ArrowLeft') { prevSlide(); startAutoplay(); }
    });

    // Start
    startAutoplay();
}

// ===========================
// GALLERY NAVIGATION
// ===========================
function initGalleryNav() {
    const track = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    if (!track || !prevBtn || !nextBtn) return;

    const slideWidth = 400; // slide width + gap

    function getComputedDuration() {
        const style = window.getComputedStyle(track);
        const dur = parseFloat(style.animationDuration) || 35;
        return dur;
    }

    // Shift the track by one slide forward or backward
    function shiftGallery(direction) {
        // Pause the auto animation temporarily
        track.style.animationPlayState = 'paused';

        // Get current translateX from the animation
        const computed = window.getComputedStyle(track);
        const matrix = new DOMMatrix(computed.transform);
        const currentX = matrix.m41;

        // Remove the animation
        track.style.animation = 'none';
        track.style.transform = `translateX(${currentX}px)`;

        // Force reflow
        track.offsetHeight;

        // Calculate new position
        const newX = currentX + (direction === 'next' ? -slideWidth : slideWidth);
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = `translateX(${newX}px)`;

        // After transition, restart auto-scroll
        setTimeout(() => {
            track.style.transition = 'none';
            track.style.transform = '';
            track.style.animation = '';
            track.style.animationPlayState = 'running';
        }, 600);
    }

    prevBtn.addEventListener('click', () => shiftGallery('prev'));
    nextBtn.addEventListener('click', () => shiftGallery('next'));
}
