/* ============================================
   CLEANPRO SERVICES - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== DOM ELEMENTS =====
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // ===== MOBILE MENU =====
    
    // Open menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    }

    // Close menu with X button
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = ''; // Restore scroll
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show-menu') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        }
    });

    // ===== HEADER ON SCROLL =====
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Run on load and scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // ===== ACTIVE NAVIGATION =====
    
    const sections = document.querySelectorAll('section[id]');

    function setActiveLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // ===== SMOOTH SCROLL =====
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only if it's a valid internal link
            if (href !== '#' && href.startsWith('#')) {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== EXPANDABLE SERVICE CARDS =====
    
    const serviceCards = document.querySelectorAll('.service-card--expandable');
    
    serviceCards.forEach(card => {
        const toggleBtn = card.querySelector('.service-card__toggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close other cards
                serviceCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('service-card--expanded')) {
                        otherCard.classList.remove('service-card--expanded');
                        const otherBtn = otherCard.querySelector('.service-card__toggle');
                        if (otherBtn) {
                            otherBtn.setAttribute('aria-expanded', 'false');
                            otherBtn.querySelector('span').textContent = 'View Details';
                        }
                    }
                });
                
                // Toggle current card
                card.classList.toggle('service-card--expanded');
                const isExpanded = card.classList.contains('service-card--expanded');
                this.setAttribute('aria-expanded', isExpanded);
                this.querySelector('span').textContent = isExpanded ? 'Hide Details' : 'View Details';
                
                // Scroll to card if expanded on mobile
                if (isExpanded && window.innerWidth <= 768) {
                    setTimeout(() => {
                        const headerHeight = header ? header.offsetHeight : 80;
                        const cardTop = card.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                        window.scrollTo({
                            top: cardTop,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            });
        }
        
        // Also allow clicking anywhere on the card header to toggle
        const cardHeader = card.querySelector('.service-card__header');
        if (cardHeader) {
            cardHeader.addEventListener('click', function(e) {
                if (e.target.closest('.service-card__toggle')) return;
                const toggleBtn = card.querySelector('.service-card__toggle');
                if (toggleBtn) toggleBtn.click();
            });
        }
    });

    // ===== SCROLL ANIMATION FOR ELEMENTS =====
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Observe elements we want to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .feature, .area-card, .testimonial-card, .contact__method'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ===== FORM - BASIC VALIDATION =====
    
    const form = document.querySelector('.contact__form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const phone = form.querySelector('#phone');
            
            let isValid = true;
            
            // Validate name
            if (name.value.trim().length < 2) {
                showError(name, 'Please enter your name');
                isValid = false;
            } else {
                clearError(name);
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            } else {
                clearError(email);
            }
            
            // Validate phone
            const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
            if (!phoneRegex.test(phone.value)) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            } else {
                clearError(phone);
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    function showError(input, message) {
        const formGroup = input.closest('.form__group');
        let errorElement = formGroup.querySelector('.form__error');
        
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'form__error';
            errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = '#ef4444';
    }

    function clearError(input) {
        const formGroup = input.closest('.form__group');
        const errorElement = formGroup.querySelector('.form__error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderColor = '';
    }

    // Clear errors on input
    const formInputs = document.querySelectorAll('.form__input, .form__textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });

    // ===== PHONE CLICK TRACKING =====
    
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // You can add analytics tracking here if needed
            console.log('📞 Phone number clicked:', this.href);
        });
    });

    // ===== PREVENT CONTENT FLASH =====
    
    document.body.classList.add('loaded');

    // ===== WELCOME CONSOLE MESSAGE =====
    
    console.log('%c✨ A&A ServiGroup Services', 'color: #0d6efd; font-size: 24px; font-weight: bold;');
    console.log('%cProfessionally developed website', 'color: #64748b; font-size: 14px;');
    console.log('%cNeed a website? Contact us!', 'color: #198754; font-size: 12px;');

});

// ===== LAZY LOADING IMAGES (FALLBACK) =====

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support native lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}
