/* ========================================
   FITNESS TRACK GYM — JavaScript
   Animations, Interactions & Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    const handleNavScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll);

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');
    const highlightNav = () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav);

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-cta');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeMenu.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== PRE-SELECT PACKAGE IN FORM =====
    const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
    const formPackage = document.getElementById('formPackage');
    
    selectPlanBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const packageValue = btn.getAttribute('data-package');
            if (formPackage && packageValue) {
                formPackage.value = packageValue;
            }
        });
    });

    // ===== COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        const statsBar = document.querySelector('.stats-bar');
        if (!statsBar) return;
        
        const rect = statsBar.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            statNumbers.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const isDecimal = counter.getAttribute('data-decimal') === 'true';
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let current = 0;
                let step = 0;

                const timer = setInterval(() => {
                    step++;
                    current += increment;
                    if (step >= steps) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                }, duration / steps);
            });
        }
    };

    window.addEventListener('scroll', animateCounters);
    // Trigger immediately in case stats are visible on load
    animateCounters();

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== REVIEWS CAROUSEL =====
    const reviewCards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    let currentReview = 0;
    let reviewInterval;

    const showReview = (index) => {
        reviewCards.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });
        reviewCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentReview = index;
    };

    const nextReview = () => {
        const next = (currentReview + 1) % reviewCards.length;
        showReview(next);
    };

    // Auto-scroll reviews
    const startReviewAutoplay = () => {
        reviewInterval = setInterval(nextReview, 4000);
    };
    startReviewAutoplay();

    // Dot click
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(reviewInterval);
            showReview(i);
            startReviewAutoplay();
        });
    });

    // ===== FOOTER BRANCH SELECTOR =====
    const branchSelector = document.getElementById('footerBranchSelector');
    if (branchSelector) {
        branchSelector.addEventListener('change', (e) => {
            const branch = e.target.value;
            if (branch) {
                window.open(`https://maps.google.com/?q=Fitness+Track+Gym+${branch.replace(/ /g, '+')}+Vadodara`, '_blank');
            }
        });
    }

    // ===== CONTACT FORM (Real Formspree Submission) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('formSubmit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> CONSULTATION BOOKED!';
                    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
                    contactForm.reset();
                } else {
                    submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ERROR! TRY AGAIN';
                    submitBtn.style.background = 'linear-gradient(135deg, #D32F2F, #FF1744)';
                }
            })
            .catch(() => {
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ERROR! TRY AGAIN';
                submitBtn.style.background = 'linear-gradient(135deg, #D32F2F, #FF1744)';
            })
            .finally(() => {
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    // ===== STAGGERED REVEAL FOR SERVICE CARDS =====
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
    });

    // Staggered reveal for branch cards
    const branchCards = document.querySelectorAll('.branch-card');
    branchCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.06}s`;
    });

    // Staggered reveal for why items
    const whyItems = document.querySelectorAll('.why-item');
    whyItems.forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.1}s`;
    });

    // Staggered reveal for plan cards
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
    });

    // ===== FLOATING WHATSAPP BUTTON =====
    const whatsappFloat = document.getElementById('whatsappFloat');
    const whatsappWidget = document.getElementById('whatsappWidget');
    const whatsappClose = document.getElementById('whatsappClose');
    const whatsappSend = document.getElementById('whatsappSend');
    const whatsappInput = document.getElementById('whatsappInput');

    if (whatsappFloat) {
        // Show floating button after 1 second
        setTimeout(() => whatsappFloat.classList.add('visible'), 1000);

        // Toggle chat widget
        whatsappFloat.addEventListener('click', () => {
            if (whatsappWidget.classList.contains('active')) {
                whatsappWidget.classList.remove('active');
            } else {
                whatsappWidget.classList.add('active');
            }
        });

        // Close widget
        if (whatsappClose) {
            whatsappClose.addEventListener('click', (e) => {
                e.stopPropagation();
                whatsappWidget.classList.remove('active');
            });
        }

        // Send message via WhatsApp
        if (whatsappSend) {
            whatsappSend.addEventListener('click', () => {
                const message = whatsappInput ? whatsappInput.value.trim() : '';
                const defaultMsg = 'Hi! I am interested in joining Fitness Track Gym. Please share more details.';
                const finalMsg = message || defaultMsg;
                const url = `https://wa.me/919909209698?text=${encodeURIComponent(finalMsg)}`;
                window.open(url, '_blank');
            });
        }

        // Send on Enter key
        if (whatsappInput) {
            whatsappInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    whatsappSend.click();
                }
            });
        }
    }

});
