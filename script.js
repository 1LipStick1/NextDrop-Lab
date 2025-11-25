// ============================================================================
// NEXTDROP LAB - MAIN APPLICATION
// ============================================================================

const App = {
    // Configuration
    config: {
        mobileBreakpoint: 768,
        animationDuration: 300,
        scrollBehavior: 'smooth'
    },

    // State
    state: {
        mobileMenuOpen: false,
        darkMode: false
    },

    // Initialize application
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupEventListeners();
    },

    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================

    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.setTheme(initialTheme);

        // Theme toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        const isDark = theme === 'dark';
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');

        if (isDark) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
        }

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', isDark);
        }

        localStorage.setItem('theme', theme);
        this.state.darkMode = isDark;
    },

    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');

        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking on a link
            const links = mobileNav.querySelectorAll('.mobile-nav-link');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header')) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    },

    toggleMobileMenu() {
        if (this.state.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    openMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');

        if (menuToggle && mobileNav) {
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileNav.classList.add('active');
            this.state.mobileMenuOpen = true;
            document.body.style.overflow = 'hidden';
        }
    },

    closeMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');

        if (menuToggle && mobileNav) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            this.state.mobileMenuOpen = false;
            document.body.style.overflow = '';
        }
    },

    // ========================================================================
    // NAVIGATION MANAGEMENT
    // ========================================================================

    setupNavigation() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (this.state.mobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                }
            });
        });

        // Update active nav link on scroll
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    },

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const sectionId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================

    setupEventListeners() {
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= this.config.mobileBreakpoint) {
                    this.closeMobileMenu();
                }
            }, 250);
        });

        // Prevent body scroll when mobile menu is open
        document.addEventListener('touchmove', (e) => {
            if (this.state.mobileMenuOpen && e.target.closest('.mobile-nav') === null) {
                e.preventDefault();
            }
        }, { passive: false });
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
        App.initHeroAnimations();
        App.initHowItWorksAnimations();
        App.initBenefitsAnimations();
        App.initInteractiveAnimations();
        App.initSuccessStoriesCarousel();
        App.initCtaPricingSection();
    });
} else {
    App.init();
    App.initHeroAnimations();
    App.initHowItWorksAnimations();
    App.initBenefitsAnimations();
    App.initInteractiveAnimations();
    App.initSuccessStoriesCarousel();
    App.initCtaPricingSection();
}

// ============================================================================
// HERO SECTION ANIMATIONS
// ============================================================================

App.initHeroAnimations = function() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (heroContent) {
        // Trigger fade-in animation
        heroContent.style.animation = 'fadeInUp 600ms ease-out forwards';
    }

    if (heroImage) {
        // Trigger slide-in animation with delay
        heroImage.style.animation = 'slideInRight 500ms ease-out 100ms forwards';
    }

    // Add hover effect to CTA button
    const ctaButton = document.querySelector('.hero-cta');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
};

// ============================================================================
// HOW IT WORKS SECTION ANIMATIONS
// ============================================================================

App.initHowItWorksAnimations = function() {
    const stepCards = document.querySelectorAll('.step-card');
    
    if (stepCards.length === 0) return;

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                    entry.target.style.opacity = '0';
                    entry.target.offsetHeight; // Trigger reflow
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stepCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        stepCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            
            if (scrollPercent > 0 && scrollPercent < 1) {
                const offset = (scrollPercent - 0.5) * 20 * (index % 2 === 0 ? 1 : -1);
                card.style.transform = `translateY(${offset}px)`;
            }
        });
    });
};

// Add keyframe animation for step cards
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================================================
// BENEFITS SECTION ANIMATIONS
// ============================================================================

App.initBenefitsAnimations = function() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    if (benefitCards.length === 0) return;

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                    entry.target.style.opacity = '0';
                    entry.target.offsetHeight; // Trigger reflow
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    benefitCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
};

// ============================================================================
// INTERACTIVE STORE PREVIEW ANIMATIONS
// ============================================================================

App.initInteractiveAnimations = function() {
    const productCards = document.querySelectorAll('.product-card');
    const productOverlay = document.getElementById('product-overlay');
    const overlayClose = document.querySelector('.overlay-close');
    const tipCards = document.querySelectorAll('.tip-card');

    // Product card click handlers
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-product-id');
            const productName = card.querySelector('.product-name').textContent;
            const productPrice = card.querySelector('.product-price').textContent;
            const productImage = card.querySelector('.product-image').src;

            // Update overlay content
            document.getElementById('overlay-product-name').textContent = productName;
            document.getElementById('overlay-product-price').textContent = productPrice;
            document.getElementById('overlay-product-image').src = productImage;
            document.getElementById('overlay-product-image').alt = productName;

            // Show overlay
            productOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close overlay
    if (overlayClose) {
        overlayClose.addEventListener('click', () => {
            productOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close overlay when clicking outside
    if (productOverlay) {
        productOverlay.addEventListener('click', (e) => {
            if (e.target === productOverlay) {
                productOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Close overlay on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productOverlay.classList.contains('active')) {
            productOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Animate tip cards on scroll
    const tipObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const tipObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                    entry.target.style.opacity = '0';
                    entry.target.offsetHeight; // Trigger reflow
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                }, index * 80);
                tipObserver.unobserve(entry.target);
            }
        });
    }, tipObserverOptions);

    tipCards.forEach(card => {
        card.style.opacity = '0';
        tipObserver.observe(card);
    });
};

// ============================================================================
// SUCCESS STORIES CAROUSEL
// ============================================================================

App.initSuccessStoriesCarousel = function() {
    const carousel = document.querySelector('.testimonials-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (!carousel || cards.length === 0) return;

    let currentSlide = 0;
    let autoAdvanceTimer;
    const autoAdvanceInterval = 6000; // 6 seconds

    // Function to show slide
    const showSlide = (index) => {
        // Normalize index
        currentSlide = (index + cards.length) % cards.length;

        // Update cards visibility
        cards.forEach((card, i) => {
            card.style.opacity = i === currentSlide ? '1' : '0';
            card.style.pointerEvents = i === currentSlide ? 'auto' : 'none';
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Reset auto-advance timer
        clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = setTimeout(() => {
            showSlide(currentSlide + 1);
        }, autoAdvanceInterval);
    };

    // Navigation handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }

    // Dot handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Pause auto-advance on hover
    carousel.addEventListener('mouseenter', () => {
        clearTimeout(autoAdvanceTimer);
    });

    carousel.addEventListener('mouseleave', () => {
        autoAdvanceTimer = setTimeout(() => {
            showSlide(currentSlide + 1);
        }, autoAdvanceInterval);
    });

    // Animate testimonial cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                    entry.target.style.opacity = '0';
                    entry.target.offsetHeight; // Trigger reflow
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Initialize first slide
    showSlide(0);
};

// ============================================================================
// CTA & PRICING SECTION
// ============================================================================

App.initCtaPricingSection = function() {
    const emailForm = document.querySelector('.email-form');
    const pricingCards = document.querySelectorAll('.pricing-card');
    const ctaColumn = document.querySelector('.cta-column');
    const pricingColumn = document.querySelector('.pricing-column');

    // Email form submission
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = emailForm.querySelector('.email-input');
            const email = emailInput.value;

            if (email && email.includes('@')) {
                // Show success message
                const originalText = emailForm.querySelector('button').textContent;
                emailForm.querySelector('button').textContent = '✓ Subscribed!';
                emailForm.querySelector('button').style.backgroundColor = 'var(--color-accent-green)';

                // Reset after 2 seconds
                setTimeout(() => {
                    emailForm.querySelector('button').textContent = originalText;
                    emailForm.querySelector('button').style.backgroundColor = '';
                    emailInput.value = '';
                }, 2000);
            }
        });
    }

    // Animate pricing cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                    entry.target.style.opacity = '0';
                    entry.target.offsetHeight; // Trigger reflow
                    entry.target.style.animation = `fadeInUp 600ms ease-out forwards`;
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    pricingCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Animate CTA column
    if (ctaColumn) {
        ctaColumn.style.opacity = '0';
        ctaColumn.style.animation = 'fadeInUp 600ms ease-out forwards';
    }

    // Animate pricing column
    if (pricingColumn) {
        pricingColumn.style.opacity = '0';
        pricingColumn.style.animation = 'fadeInUp 600ms ease-out 100ms forwards';
    }
};
