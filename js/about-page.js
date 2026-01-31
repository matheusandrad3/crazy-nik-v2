/**
 * About Page Scripts - Nikolas Ferreira
 * Adapted from uniqeme template
 */

// ========================================
// PAGE LOADER
// ========================================
// Must be outside DOMContentLoaded to ensure it works correctly
window.addEventListener('load', function() {
  const loaderWrapper = document.querySelector('.loader-wrapper');
  if (loaderWrapper) {
    setTimeout(function() {
      loaderWrapper.style.opacity = '0';
      loaderWrapper.style.visibility = 'hidden';
      setTimeout(function() {
        loaderWrapper.style.display = 'none';
        document.body.style.overflowY = 'auto';
      }, 500);
    }, 500);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

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
      // Read data-bs-parent from either toggle or target element
      const parent = this.getAttribute('data-bs-parent') || (target ? target.getAttribute('data-bs-parent') : null);
      
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
  // Note: Marquee animation is handled via CSS (.animate-marquee class)
  // defined in about-page.css with @keyframes marquee

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
  // MOBILE MENU (inherits from main.js)
  // ========================================
  // The mobile menu functionality is already handled by main.js
  // This file only adds about-page specific functionality

}); // Close DOMContentLoaded
