// ========================================
// VIEWPORT HEIGHT FIX
// Resolve o bug de 100vh não pegar a altura correta no carregamento inicial
// Especialmente importante para Safari iOS e Chrome Android
// ========================================
function setViewportHeight() {
  // Calcula a altura real do viewport e define como variável CSS
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // Também define a altura completa para uso direto
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

// Executar imediatamente para evitar flash de layout incorreto
setViewportHeight();

// Atualizar em resize e orientação
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
  // Pequeno delay para garantir que o navegador terminou de ajustar
  setTimeout(setViewportHeight, 100);
  // Segundo delay para garantir em dispositivos mais lentos
  setTimeout(setViewportHeight, 300);
});

// Recalcular quando a página estiver totalmente carregada (incluindo imagens)
window.addEventListener('load', setViewportHeight);

// Recalcular após um pequeno delay para garantir que a barra de endereço estabilizou
setTimeout(setViewportHeight, 500);

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Recalcular após DOM carregado para garantir valor correto
  setViewportHeight();
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

  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      header.style.backdropFilter = 'blur(10px)';
    } else {
      header.style.backgroundColor = 'transparent';
      header.style.backdropFilter = 'none';
    }
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
});
