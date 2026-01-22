// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu nav a');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  // Open mobile menu with staggered animations
  function openMenu() {
    mobileMenu.classList.add('active');
    mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset nav items for animation
    mobileNavItems.forEach((item, index) => {
      item.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
    });
  }

  // Close mobile menu
  function closeMenu() {
    // Reverse animation order
    mobileNavItems.forEach((item, index) => {
      const reverseIndex = mobileNavItems.length - 1 - index;
      item.style.transitionDelay = `${reverseIndex * 0.03}s`;
    });
    
    // Small delay to allow reverse animation
    setTimeout(() => {
      mobileMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }, 50);
  }

  // Event listeners
  mobileMenuBtn.addEventListener('click', openMenu);
  mobileMenuClose.addEventListener('click', closeMenu);
  mobileMenuOverlay.addEventListener('click', closeMenu);

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
