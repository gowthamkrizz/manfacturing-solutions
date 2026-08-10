function preventScroll(e) { if(!e.target.closest('.nav-menu')) e.preventDefault(); }
document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Get the custom delay if it exists
                const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                entry.target.style.transitionDelay = delay;
                
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 2. Sticky Header Logic
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // 3. Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-menu a, .footer-links a, .hero-btns a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply to hash links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Account for sticky header height
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active class in nav
                    document.querySelectorAll('.nav-menu a').forEach(nav => nav.classList.remove('active'));
                    if (this.closest('.nav-menu')) {
                        this.classList.add('active');
                    }
                }
            }
        });
    });
    // 4. Testimonial Slider Logic
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    const mainImg = document.getElementById('testi-main-img');
    let currentSlide = 0;

    if (slides.length > 0 && prevBtn && nextBtn && mainImg) {
        function showSlide(index) {
            // Fade out main image smoothly
            mainImg.style.opacity = '0';
            
            // Fade out old slide smoothly
            slides.forEach(slide => {
                if (slide.classList.contains('active')) {
                    slide.style.animation = 'softFadeOut 0.4s ease forwards';
                }
            });
            
            setTimeout(() => {
                // Update image source from data attribute
                const newImgSrc = slides[index].getAttribute('data-img');
                if (newImgSrc) {
                    mainImg.src = newImgSrc;
                }
                
                // Fade in main image smoothly
                mainImg.style.opacity = '1';
                
                // Toggle active slides
                slides.forEach(slide => {
                    slide.classList.remove('active');
                    slide.style.animation = 'none'; // reset animation
                    slide.offsetHeight; // trigger reflow
                });
                
                slides[index].classList.add('active');
                // Use a soft elegant moving animation
                slides[index].style.animation = 'softFadeMove 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            }, 400); // Wait for fade out
        }

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }

    // 5. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        const icon = toggle.querySelector('i');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all items first
            faqItems.forEach(i => {
                i.classList.remove('open');
                const ic = i.querySelector('.faq-toggle i');
                if (ic) {
                    ic.className = 'fas fa-plus';
                }
            });

            // If it was closed, open it
            if (!isOpen) {
                item.classList.add('open');
                icon.className = 'fas fa-minus';
            }
        });
    });

    // 6. Mobile Menu Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); document.documentElement.classList.toggle('no-scroll'); if(navMenu.classList.contains('active')) { document.addEventListener('touchmove', preventScroll, {passive: false}); } else { document.removeEventListener('touchmove', preventScroll); }
            // Toggle icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when a link is clicked
        const navMenuLinks = navMenu.querySelectorAll('a');
        navMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll'); document.documentElement.classList.remove('no-scroll'); document.removeEventListener('touchmove', preventScroll);
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});
