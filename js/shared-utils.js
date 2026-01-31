// ========================================
// SHARED UTILITIES
// Common functionality used across multiple pages
// ========================================

// ========================================
// VIEWPORT HEIGHT FIX FOR MOBILE
// ========================================

/**
 * Sets CSS custom properties for viewport height to handle mobile browser bars
 * Provides --vh (1% of viewport) and --app-height (full viewport height)
 */
export function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

/**
 * Initialize viewport height handling with proper event listeners
 * Handles resize, orientation changes, and initial load
 */
export function initViewportHeight() {
  // Execute immediately to avoid layout flash
  setViewportHeight();
  
  // Update on resize and orientation changes
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', () => {
    // Small delays to ensure browser has adjusted
    setTimeout(setViewportHeight, 100);
    setTimeout(setViewportHeight, 300);
  });
  
  // Recalculate when page fully loads (including images)
  window.addEventListener('load', setViewportHeight);
  
  // Additional delay to ensure address bar has stabilized
  setTimeout(setViewportHeight, 500);
  
  // Recalculate after DOM loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setViewportHeight);
  } else {
    setViewportHeight();
  }
}

// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================

/**
 * Initialize mobile menu with open/close animations and event handlers
 */
export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu nav a');
  const header = document.getElementById('main-header');
  
  // Early return if required elements don't exist
  if (!mobileMenuBtn || !mobileMenu) return;
  
  let closeMenuTimeoutId = null;

  function openMenu() {
    // Cancel any pending close timeout to prevent race condition
    if (closeMenuTimeoutId !== null) {
      clearTimeout(closeMenuTimeoutId);
      closeMenuTimeoutId = null;
    }
    mobileMenu.classList.remove('closing');
    mobileMenu.classList.add('active');
    mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    // Clear any existing close timeout to prevent orphaned timeouts
    if (closeMenuTimeoutId !== null) {
      clearTimeout(closeMenuTimeoutId);
      closeMenuTimeoutId = null;
    }
    
    // Add closing class to trigger reverse animation via CSS
    mobileMenu.classList.add('closing');
    mobileMenuBtn.classList.remove('active');
    
    // Wait for closing animation to complete (~400ms), then clean up
    closeMenuTimeoutId = setTimeout(() => {
      mobileMenu.classList.remove('active');
      mobileMenu.classList.remove('closing');
      document.body.style.overflow = '';
      closeMenuTimeoutId = null;
    }, 400);
  }

  // Event listeners
  mobileMenuBtn.addEventListener('click', openMenu);
  
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMenu);
  }
  
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMenu);
  }

  // Handle menu link clicks
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        
        // Navigate after menu closes
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = targetPosition - headerHeight - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            history.pushState(null, '', href);
          }
        }, 400);
      } else {
        closeMenu();
      }
    });
    
    // Add touch feedback for mobile nav links
    link.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    link.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
    
    link.addEventListener('touchcancel', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ========================================
// STICKY HEADER
// ========================================

/**
 * Initialize sticky header that changes appearance on scroll
 * Uses requestAnimationFrame for smooth performance
 */
export function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;
  
  const scrollThreshold = 50;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    
    if (scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Initial check in case page loads already scrolled
  updateHeader();
}
