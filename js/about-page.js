/**
 * About Page Scripts - Nikolas Ferreira
 * Adapted from uniqeme template
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ========================================
  // PAGE LOADER
  // ========================================
  const loaderWrapper = document.querySelector('.loader-wrapper');
  if (loaderWrapper) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loaderWrapper.style.opacity = '0';
        loaderWrapper.style.visibility = 'hidden';
        setTimeout(function() {
          loaderWrapper.style.display = 'none';
          document.body.style.overflowY = 'auto';
        }, 500);
      }, 500);
    });
  }

  // ========================================
  // GO TO TOP BUTTON
  // ========================================
  const goToTopBtn = document.querySelector('.go-to-top');
  
  if (goToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        goToTopBtn.classList.add('active');
      } else {
        goToTopBtn.classList.remove('active');
      }
    });

    // Scroll to top on click
    goToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================
  // ACCORDION / COLLAPSE FUNCTIONALITY
  // ========================================
  const collapseToggles = document.querySelectorAll('[data-bs-toggle="collapse"]');
  
  collapseToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetSelector = this.getAttribute('data-bs-target');
      const target = document.querySelector(targetSelector);
      const parent = this.getAttribute('data-bs-parent');
      
      if (!target) return;
      
      // If has parent (accordion behavior), close siblings
      if (parent) {
        const parentEl = document.querySelector(parent);
        if (parentEl) {
          const siblings = parentEl.querySelectorAll('.collapse.show');
          siblings.forEach(function(sibling) {
            if (sibling !== target) {
              sibling.classList.remove('show');
              // Find and update the toggle button
              const siblingToggle = parentEl.querySelector('[data-bs-target="#' + sibling.id + '"]');
              if (siblingToggle) {
                siblingToggle.classList.add('collapsed');
              }
            }
          });
        }
      }
      
      // Toggle current
      if (target.classList.contains('show')) {
        target.classList.remove('show');
        this.classList.add('collapsed');
      } else {
        target.classList.add('show');
        this.classList.remove('collapsed');
      }
    });
  });

  // ========================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ========================================
  const animatedElements = document.querySelectorAll('.fade_up_anim, .apear-down');
  
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Get delay from data attribute
          const delay = entry.target.getAttribute('data-delay') || 0;
          
          setTimeout(function() {
            entry.target.classList.add('animated');
          }, parseFloat(delay) * 1000);
          
          // Unobserve after animation
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(function(el) {
      animationObserver.observe(el);
    });
  } else {
    // Fallback: just show all elements
    animatedElements.forEach(function(el) {
      el.classList.add('animated');
    });
  }

  // ========================================
  // STATS MARQUEE ANIMATION
  // ========================================
  function initMarquee() {
    const marqueeContainers = document.querySelectorAll('.stats .swiper-wrapper, .project-title .swiper-wrapper');
    
    marqueeContainers.forEach(function(container) {
      if (!container) return;
      
      // Clone slides for infinite effect
      const slides = container.querySelectorAll('.swiper-slide');
      slides.forEach(function(slide) {
        const clone = slide.cloneNode(true);
        container.appendChild(clone);
      });
      
      // Animate with CSS
      container.style.display = 'flex';
      container.style.animation = 'marquee 30s linear infinite';
    });
  }
  
  // Add marquee keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    @keyframes marquee-reverse {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
  
  initMarquee();

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('#main-header')?.offsetHeight || 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // IMAGE LAZY LOADING
  // ========================================
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ========================================
  // COUNTER ANIMATION (for stats)
  // ========================================
  function animateCounter(el) {
    const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
    const suffix = el.textContent.replace(/[\d]/g, '');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(function() {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  }
  
  const counters = document.querySelectorAll('.counter-animate');
  
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });
    
    counters.forEach(function(counter) {
      counterObserver.observe(counter);
    });
  }

  // ========================================
  // PARALLAX EFFECT (subtle)
  // ========================================
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(function(el) {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = 'translate3d(0, ' + yPos + 'px, 0)';
      });
    });
  }

  // ========================================
  // HOVER EFFECTS
  // ========================================
  
  // Brand logos hover effect
  const brandLogos = document.querySelectorAll('.brand-logo');
  brandLogos.forEach(function(logo) {
    logo.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    logo.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // ========================================
  // MOBILE MENU (inherits from main.js)
  // ========================================
  // The mobile menu functionality is already handled by main.js
  // This file only adds about-page specific functionality

  // ========================================
  // FORM VALIDATION (if contact form exists)
  // ========================================
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const requiredFields = this.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Handle form submission
        console.log('Form submitted:', Object.fromEntries(formData));
        // Add your form submission logic here
      }
    });
  }

  // ========================================
  // INITIALIZE ON LOAD
  // ========================================
  console.log('About page scripts loaded successfully');
});

// ========================================
// OPTIONAL: GSAP Animations (if GSAP is loaded)
// ========================================
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Title animations
  gsap.utils.toArray('.title-anim').forEach(function(title) {
    gsap.from(title, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

// ========================================
// OPTIONAL: Swiper initialization (if Swiper is loaded)
// ========================================
if (typeof Swiper !== 'undefined') {
  // Stats slider
  const statSlider = new Swiper('.stat-slider', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    loop: true,
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    allowTouchMove: false,
  });
  
  // Brand slider
  const brandSlider = new Swiper('.brand-slider', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    loop: true,
    speed: 3000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    allowTouchMove: true,
  });
  
  // Project title slider
  const projectTitleSlider = new Swiper('.project-title', {
    slidesPerView: 'auto',
    spaceBetween: 0,
    loop: true,
    speed: 8000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    allowTouchMove: false,
  });
}
