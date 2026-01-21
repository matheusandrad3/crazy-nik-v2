// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu nav a');

  // Open mobile menu
  function openMenu() {
    mobileMenu.classList.add('active');
    mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close mobile menu
  function closeMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  mobileMenuBtn.addEventListener('click', openMenu);
  mobileMenuClose.addEventListener('click', closeMenu);
  mobileMenuOverlay.addEventListener('click', closeMenu);

  // Close menu when clicking on a link
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
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
