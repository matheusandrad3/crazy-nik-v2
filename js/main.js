// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu nav a');

  // Track the close animation timeout to prevent race conditions
  let closeMenuTimeoutId = null;

  // Open mobile menu with staggered animations
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

  // Close mobile menu with reverse staggered animation
  function closeMenu() {
    // Clear any existing close timeout to prevent orphaned timeouts
    // This handles cases where closeMenu is called multiple times (e.g., Escape pressed twice)
    if (closeMenuTimeoutId !== null) {
      clearTimeout(closeMenuTimeoutId);
      closeMenuTimeoutId = null;
    }
    
    // Add closing class to trigger reverse animation via CSS
    mobileMenu.classList.add('closing');
    mobileMenuBtn.classList.remove('active');
    
    // Wait for closing animation to complete, then clean up
    // Longest delay (0.09s) + animation duration (0.3s) = ~0.4s
    closeMenuTimeoutId = setTimeout(() => {
      mobileMenu.classList.remove('active');
      mobileMenu.classList.remove('closing');
      document.body.style.overflow = '';
      closeMenuTimeoutId = null;
    }, 400);
  }

  // Get the drawer element for click handling
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Event listeners
  mobileMenuBtn.addEventListener('click', openMenu);
  mobileMenuClose.addEventListener('click', closeMenu);
  mobileMenuOverlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking on non-interactive areas of the drawer
  // This handles clicks that pass through due to pointer-events: none on content
  mobileDrawer.addEventListener('click', function(e) {
    // Only close if clicking on the drawer background, not on interactive elements
    const clickedElement = e.target;
    const isInteractive = clickedElement.closest('button, a, nav ul');
    if (!isInteractive) {
      closeMenu();
    }
  });

  // Close menu when clicking on a link with smooth transition
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      
      closeMenu();
      
      // Navigate after menu closes
      setTimeout(() => {
        if (href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Update URL hash for deep linking, browser history, and bookmarking
            history.pushState(null, '', href);
          }
        } else {
          window.location.href = href;
        }
      }, 400);
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Add touch feedback for mobile nav links
  mobileMenuLinks.forEach(link => {
    link.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    link.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
    
    // Handle touchcancel (e.g., when user scrolls during touch)
    link.addEventListener('touchcancel', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Header scroll effect
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      header.style.backdropFilter = 'blur(10px)';
    } else {
      header.style.backgroundColor = 'transparent';
      header.style.backdropFilter = 'none';
    }
    
    lastScrollY = currentScrollY;
  });
});
