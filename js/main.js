// ========================================
// SHARED UTILITIES IMPORT
// ========================================
import { initViewportHeight, initMobileMenu, initStickyHeader } from './shared-utils.js';

// Initialize viewport height handling
initViewportHeight();

// Initialize core functionality on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize sticky header
  initStickyHeader();

  // ========================================
  // EMENDAS SECTION SCROLL REVEAL
  // ========================================
  
  // Store observer reference to prevent accumulation on resize
  let emendasRevealObserver = null;
  let emendasRevealed = false;
  
  function initEmendasScrollReveal() {
    // Skip if already revealed
    if (emendasRevealed) return;
    
    // Only apply on desktop (lg and up)
    if (window.innerWidth < 1024) return;
    
    const emendasSection = document.getElementById('emendas');
    if (!emendasSection) return;
    
    const title = emendasSection.querySelector('.emendas-title-desktop');
    const photo = emendasSection.querySelector('.emendas-nikolas-photo');
    const map = emendasSection.querySelector('.emendas-map-desktop');
    const impactText = emendasSection.querySelector('.emendas-impact-text');
    const ctaBtn = emendasSection.querySelector('.emendas-cta-btn');
    
    const elements = [title, photo, map, impactText, ctaBtn].filter(Boolean);
    
    // Disconnect any existing observer before creating a new one
    if (emendasRevealObserver) {
      emendasRevealObserver.disconnect();
      emendasRevealObserver = null;
    }
    
    // Intersection Observer for reveal animation
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    };
    
    emendasRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Reveal all elements when section comes into view
          elements.forEach(el => {
            el.classList.add('revealed');
          });
          // Mark as revealed and stop observing
          emendasRevealed = true;
          emendasRevealObserver.disconnect();
          emendasRevealObserver = null;
        }
      });
    }, observerOptions);
    
    emendasRevealObserver.observe(emendasSection);
  }
  
  // Initialize emendas scroll reveal
  initEmendasScrollReveal();
  
  // Re-initialize on resize (in case switching between mobile/desktop)
  let emendasResizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(emendasResizeTimeout);
    emendasResizeTimeout = setTimeout(() => {
      initEmendasScrollReveal();
    }, 250);
  });

  // ========================================
  // MINAS GERAIS MAP INITIALIZATION
  // ========================================
  
  // Initialize map for mobile and desktop containers
  function initMinasMaps() {
    // Check if MinasMap is available
    if (typeof MinasMap === 'undefined') {
      console.warn('MinasMap module not loaded');
      return;
    }

    // Mobile map
    const mobileMapContainer = document.getElementById('minas-map-mobile');
    if (mobileMapContainer) {
      MinasMap.init(mobileMapContainer);
    }

    // Desktop map
    const desktopMapContainer = document.getElementById('minas-map-desktop');
    if (desktopMapContainer) {
      MinasMap.init(desktopMapContainer);
    }

    // Listen for region clicks (for future navigation)
    document.addEventListener('minas-map:region-click', function(e) {
      const { region, name, selected } = e.detail;
      
      // Future: Navigate to region-specific page
      // Example: window.location.href = `/emendas/${region}`;
    });

    // Listen for region hovers (for analytics or other features)
    document.addEventListener('minas-map:region-hover', function(e) {
      const { region, name } = e.detail;
      // Optional: Track hover events for analytics
      // console.log('Region hovered:', region, name);
    });
  }

  // Initialize maps
  initMinasMaps();

  // ========================================
  // PROJECTS CAROUSEL (Mobile)
  // ========================================
  
  function initProjectsCarousel() {
    const carousel = document.querySelector('.projects-carousel');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!carousel || dots.length === 0) return;
    
    // Update active dot based on scroll position
    function updateActiveDot() {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.querySelector('.project-card').offsetWidth;
      const gap = 16; // gap-4 = 16px
      // Clamp to valid bounds to handle mobile overscroll (iOS bounce / Android elastic)
      const activeIndex = Math.max(0, Math.min(dots.length - 1, Math.round(scrollLeft / (cardWidth + gap))));
      
      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    // Listen for scroll events
    carousel.addEventListener('scroll', updateActiveDot, { passive: true });
    
    // Sync dot state on init (handles browser-restored scroll position)
    updateActiveDot();
    
    // Click on dot to scroll to card
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const cards = carousel.querySelectorAll('.project-card');
        if (cards[index]) {
          cards[index].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'center' 
          });
        }
      });
    });
    
    // Touch feedback for cards
    const cards = carousel.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      card.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      }, { passive: true });
      
      card.addEventListener('touchcancel', function() {
        this.style.transform = 'scale(1)';
      }, { passive: true });
    });
  }
  
  // Initialize carousel
  initProjectsCarousel();
});
