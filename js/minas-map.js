/**
 * Minas Gerais Map Component
 * Reusable interactive SVG map of Minas Gerais mesoregiões
 * 
 * Usage:
 * MinasMap.init('#map-container');
 * 
 * Events:
 * - 'minas-map:region-click' - Dispatched when a region is clicked
 * - 'minas-map:region-hover' - Dispatched when a region is hovered
 */

const MinasMap = (function() {
  'use strict';

  // Region data mapping (path id to display name and description)
  const regionData = {
    'path3030': {
      name: 'Sul/Sudoeste de Minas',
      description: 'Região conhecida pela produção de café de alta qualidade e polo industrial diversificado.',
      color: '#1A7D3C'
    },
    'path3032': {
      name: 'Zona da Mata',
      description: 'Importante centro histórico e cultural, com destaque para o turismo e a indústria têxtil.',
      color: '#156B32'
    },
    'path3034': {
      name: 'Campo das Vertentes',
      description: 'Rica em patrimônio histórico, abriga cidades coloniais e tradição artesanal.',
      color: '#105928'
    },
    'path3036': {
      name: 'Vale do Rio Doce',
      description: 'Região de grande importância mineral e siderúrgica para o estado.',
      color: '#228B47'
    },
    'path3038': {
      name: 'Metropolitana de Belo Horizonte',
      description: 'Principal centro econômico e populacional de Minas Gerais, sede da capital.',
      color: '#1E8F45'
    },
    'path3040': {
      name: 'Central Mineira',
      description: 'Região de transição com vocação agropecuária e potencial turístico.',
      color: '#1A7D3C'
    },
    'path3042': {
      name: 'Vale do Mucuri',
      description: 'Área de desenvolvimento com foco em agricultura familiar e pecuária.',
      color: '#1E8F45'
    },
    'path3044': {
      name: 'Jequitinhonha',
      description: 'Reconhecida pela riqueza cultural, artesanato e belezas naturais.',
      color: '#1A7D3C'
    },
    'path3050': {
      name: 'Norte de Minas',
      description: 'Região de clima semiárido com forte tradição cultural sertaneja.',
      color: '#2A9B52'
    },
    'path3052': {
      name: 'Noroeste de Minas',
      description: 'Fronteira agrícola com grande produção de grãos e pecuária extensiva.',
      color: '#156B32'
    },
    'path3054': {
      name: 'Triângulo Mineiro/Alto Paranaíba',
      description: 'Polo agroindustrial moderno e importante centro logístico do país.',
      color: '#1E8F45'
    },
    'path3056': {
      name: 'Oeste de Minas',
      description: 'Região com vocação agropecuária e turismo rural em crescimento.',
      color: '#156B32'
    }
  };

  // Legacy region names mapping for backward compatibility
  const regionNames = {};
  Object.keys(regionData).forEach(key => {
    regionNames[key] = regionData[key].name;
  });

  // Reference to the currently open card and associated region
  let activeCard = null;
  let activeOverlay = null;
  let activeRegionElement = null;

  /**
   * Dismiss the map interaction hint (PIN)
   * Called when user first interacts with the map
   */
  function dismissMapHint(container) {
    if (!container) return;
    
    const hint = container.querySelector('.map-hint-pin');
    if (hint && !hint.classList.contains('is-hidden')) {
      hint.classList.add('is-hidden');
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (hint.parentNode) {
          hint.remove();
        }
      }, 500);
    }
  }

  /**
   * Create and show the region info card
   */
  function showRegionCard(regionId, regionElement) {
    const data = regionData[regionId];
    if (!data) return;

    // Close any existing card first
    closeRegionCard();

    // Store reference to the active region for deselection on close
    activeRegionElement = regionElement;

    // Create overlay
    activeOverlay = document.createElement('div');
    activeOverlay.className = 'region-card-overlay';
    activeOverlay.addEventListener('click', closeRegionCard);

    // Create card
    activeCard = document.createElement('div');
    activeCard.className = 'region-card';
    activeCard.setAttribute('role', 'dialog');
    activeCard.setAttribute('aria-modal', 'true');
    activeCard.setAttribute('aria-labelledby', 'region-card-title');

    // Get the SVG path data for the region shape
    const pathData = regionElement.getAttribute('d');
    const originalFill = data.color || regionElement.getAttribute('data-original-fill') || '#1E8F45';

    // Get bounding box from the original element (already transformed in the map)
    let viewBoxStr = '0 0 854 661'; // fallback
    try {
      const bbox = regionElement.getBBox();
      // The bbox is in local coordinates, we need to account for the transform
      // Transform is translate(935.77919,-281.37865)
      const tx = 935.77919;
      const ty = -281.37865;
      const transformedX = bbox.x + tx;
      const transformedY = bbox.y + ty;
      // Add 10% padding
      const padding = Math.max(bbox.width, bbox.height) * 0.1;
      viewBoxStr = `${transformedX - padding} ${transformedY - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;
    } catch (e) {
      console.warn('Could not calculate bounding box', e);
    }

    // Create card HTML
    activeCard.innerHTML = `
      <div class="region-card__handle" aria-hidden="true"></div>
      <button class="region-card__close" aria-label="Fechar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="region-card__image">
        <svg class="region-card__svg" viewBox="${viewBoxStr}" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(935.77919,-281.37865)">
            <path d="${pathData}" fill="${originalFill}" />
          </g>
        </svg>
      </div>
      <div class="region-card__content">
        <h3 class="region-card__title" id="region-card-title">${data.name}</h3>
        <p class="region-card__description">${data.description}</p>
      </div>
      <a href="emendas-regiao.html?regiao=${encodeURIComponent(regionId)}" class="region-card__btn">
        <span>Emendas para essa região</span>
        <span class="region-card__btn-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </a>
    `;

    // Add to DOM
    document.body.appendChild(activeOverlay);
    document.body.appendChild(activeCard);

    // Bind close button
    const closeBtn = activeCard.querySelector('.region-card__close');
    closeBtn.addEventListener('click', closeRegionCard);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Capture references for the animation frame callback
    // If destroy() is called before the callback fires, the module-level
    // variables will be null, but these local references remain valid
    const overlayToAnimate = activeOverlay;
    const cardToAnimate = activeCard;

    // Trigger animation
    requestAnimationFrame(() => {
      // Use captured references to avoid TypeError if destroy() was called
      if (overlayToAnimate) {
        overlayToAnimate.classList.add('is-visible');
      }
      if (cardToAnimate) {
        cardToAnimate.classList.add('is-visible');
      }
    });

    // Handle escape key
    document.addEventListener('keydown', handleCardEscape);
  }

  /**
   * Close the region info card
   */
  function closeRegionCard() {
    if (!activeCard && !activeOverlay) return;

    // Capture references at call time to avoid race condition
    // If showRegionCard is called before the timeout fires, the module-level
    // variables will point to the new card, but we need to remove the old one
    const cardToClose = activeCard;
    const overlayToClose = activeOverlay;
    const regionToDeselect = activeRegionElement;

    // Clear module-level references immediately
    activeCard = null;
    activeOverlay = null;
    activeRegionElement = null;

    // Deselect the region so clicking it again will reopen the card
    if (regionToDeselect) {
      regionToDeselect.classList.remove('is-selected');
    }

    // Add closing class to trigger X rotation animation
    if (cardToClose) {
      cardToClose.classList.add('is-closing');
      // Small delay to let X rotate before card slides away
      setTimeout(() => {
        cardToClose.classList.remove('is-visible');
      }, 150);
    }
    if (overlayToClose) {
      overlayToClose.classList.remove('is-visible');
    }

    // Remove after animation using captured references
    // Must match CSS exit duration (800ms) + closing delay (150ms)
    setTimeout(() => {
      if (cardToClose && cardToClose.parentNode) {
        cardToClose.remove();
      }
      if (overlayToClose && overlayToClose.parentNode) {
        overlayToClose.remove();
      }
      // Only restore scroll if no other card is open
      if (!activeCard) {
        document.body.style.overflow = '';
      }
    }, 950);

    document.removeEventListener('keydown', handleCardEscape);
  }

  /**
   * Handle escape key for card
   */
  function handleCardEscape(e) {
    if (e.key === 'Escape') {
      closeRegionCard();
    }
  }

  /**
   * Create a new map instance
   * @param {HTMLElement} containerEl - Container element
   * @param {Object} options - Configuration options
   */
  function createInstance(containerEl, options) {
    // Instance state (scoped to this closure)
    let container = containerEl;
    let tooltip = null;
    let regions = [];
    let isDestroyed = false;
    
    const config = {
      tooltipOffset: 15,
      showTooltip: true,
      showCard: true,
      ...options
    };

    /**
     * Load SVG from file
     */
    function loadSVG() {
      const svgPath = 'assets/svg/minas-gerais-map.svg';
      
      fetch(svgPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(svgContent => {
          // Guard: Check if instance was destroyed while fetch was in progress
          if (isDestroyed || !container) {
            return;
          }
          
          // Parse and insert SVG
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
          const svg = svgDoc.querySelector('svg');
          
          if (svg) {
            // Add class and accessibility attributes
            svg.classList.add('minas-map');
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', 'Mapa interativo das mesoregiões de Minas Gerais');
            
            // Add viewBox if not present for better scaling
            if (!svg.getAttribute('viewBox')) {
              const width = svg.getAttribute('width') || 853.87;
              const height = svg.getAttribute('height') || 660.62;
              svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            }
            
            // Remove fixed width/height for responsive sizing
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            
            // Remove fallback image if exists (using captured container)
            const fallback = container.querySelector('.minas-map-fallback');
            if (fallback) {
              fallback.remove();
            }
            
            // Remove inline styles from paths to allow CSS styling
            const paths = svg.querySelectorAll('path');
            paths.forEach(path => {
              const currentFill = path.style.fill || getComputedStyleFromInline(path, 'fill');
              if (currentFill) {
                path.setAttribute('data-original-fill', currentFill);
              }
              const style = path.getAttribute('style');
              if (style) {
                const newStyle = style
                  .replace(/stroke\s*:\s*none\s*;?/gi, '')
                  .replace(/;;/g, ';')
                  .trim();
                path.setAttribute('style', newStyle);
              }
              path.style.stroke = 'transparent';
              path.style.strokeWidth = '2px';
            });
            
            container.appendChild(svg);
            setupMap();
          }
        })
        .catch(error => {
          console.error('MinasMap: Error loading SVG:', error);
        });
    }

    /**
     * Extract style property from inline style string
     */
    function getComputedStyleFromInline(element, property) {
      const style = element.getAttribute('style');
      if (!style) return null;
      const match = style.match(new RegExp(property + '\\s*:\\s*([^;]+)', 'i'));
      return match ? match[1].trim() : null;
    }

    /**
     * Setup map after SVG is loaded
     */
    function setupMap() {
      // Guard: Check if instance was destroyed
      if (isDestroyed || !container) {
        return;
      }
      
      if (config.showTooltip) {
        createTooltip();
      }

      regions = container.querySelectorAll('path');

      regions.forEach(region => {
        const id = region.getAttribute('id');
        if (id && regionNames[id]) {
          region.classList.add('minas-map__region');
          region.setAttribute('data-region', id);
          region.setAttribute('data-name', regionNames[id]);
          region.setAttribute('tabindex', '0');
          region.setAttribute('role', 'button');
          region.setAttribute('aria-label', regionNames[id]);
        }
      });

      bindEvents();
    }

    /**
     * Create tooltip element
     */
    function createTooltip() {
      if (isDestroyed || !container) {
        return;
      }
      
      tooltip = document.createElement('div');
      tooltip.className = 'minas-map-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('aria-hidden', 'true');
      container.style.position = 'relative';
      container.appendChild(tooltip);
    }

    /**
     * Bind event listeners to regions
     */
    function bindEvents() {
      regions.forEach(region => {
        region.addEventListener('mouseenter', handleMouseEnter);
        region.addEventListener('mousemove', handleMouseMove);
        region.addEventListener('mouseleave', handleMouseLeave);
        region.addEventListener('click', handleClick);
        region.addEventListener('keydown', handleKeyDown);
        region.addEventListener('focus', handleFocus);
        region.addEventListener('blur', handleBlur);
        region.addEventListener('touchstart', handleTouchStart, { passive: true });
        region.addEventListener('touchend', handleTouchEnd, { passive: false });
        region.addEventListener('touchcancel', handleTouchCancel, { passive: true });
      });
    }

    function handleMouseEnter(e) {
      const region = e.target;
      const regionName = region.dataset.name;
      const regionId = region.dataset.region;

      if (!regionName) return;

      // Dismiss the map hint on first hover
      dismissMapHint(container);

      if (tooltip && config.showTooltip) {
        tooltip.textContent = regionName;
        tooltip.classList.add('is-visible');
        tooltip.setAttribute('aria-hidden', 'false');
      }

      dispatchMapEvent('minas-map:region-hover', {
        region: regionId,
        name: regionName,
        element: region
      });
    }

    function handleMouseMove(e) {
      if (isDestroyed || !container || !tooltip || !config.showTooltip) return;

      const containerRect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let x = e.clientX - containerRect.left - (tooltipRect.width / 2);
      let y = e.clientY - containerRect.top - tooltipRect.height - config.tooltipOffset;

      x = Math.max(0, Math.min(x, containerRect.width - tooltipRect.width));
      y = Math.max(0, y);

      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    }

    function handleMouseLeave() {
      if (tooltip && config.showTooltip) {
        tooltip.classList.remove('is-visible');
        tooltip.setAttribute('aria-hidden', 'true');
      }
    }

    function handleClick(e) {
      const region = e.target;
      const regionId = region.dataset.region;
      const regionName = region.dataset.name;

      if (!regionId) return;

      // Dismiss the map hint on first interaction
      dismissMapHint(container);

      const wasSelected = region.classList.contains('is-selected');
      deselectAll();
      
      if (!wasSelected) {
        region.classList.add('is-selected');
      }

      // Show region info card only when selecting (not deselecting)
      if (config.showCard && !wasSelected) {
        showRegionCard(regionId, region);
      }

      dispatchMapEvent('minas-map:region-click', {
        region: regionId,
        name: regionName,
        element: region,
        selected: !wasSelected
      });
    }

    function handleKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    }

    function handleFocus(e) {
      if (isDestroyed || !container) return;
      
      const region = e.target;
      const regionName = region.dataset.name;

      if (!regionName) return;

      if (tooltip && config.showTooltip) {
        const regionRect = region.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        tooltip.textContent = regionName;
        tooltip.classList.add('is-visible');
        tooltip.setAttribute('aria-hidden', 'false');
        
        const x = (regionRect.left + regionRect.width / 2) - containerRect.left - (tooltip.offsetWidth / 2);
        const y = regionRect.top - containerRect.top - tooltip.offsetHeight - config.tooltipOffset;
        
        tooltip.style.left = `${Math.max(0, x)}px`;
        tooltip.style.top = `${Math.max(0, y)}px`;
      }
    }

    function handleBlur() {
      if (tooltip && config.showTooltip) {
        tooltip.classList.remove('is-visible');
        tooltip.setAttribute('aria-hidden', 'true');
      }
    }

    function handleTouchStart(e) {
      const region = e.target.closest('path');
      if (region) {
        region.classList.add('is-touched');
        // Dismiss the map hint on first touch
        dismissMapHint(container);
      }
    }

    function handleTouchEnd(e) {
      const region = e.target.closest('path');
      if (!region) return;
      
      region.classList.remove('is-touched');
      
      const syntheticEvent = {
        target: region,
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      
      handleClick(syntheticEvent);
      e.preventDefault();
    }

    function handleTouchCancel(e) {
      const region = e.target.closest('path');
      if (region) {
        region.classList.remove('is-touched');
      }
    }

    function selectRegion(regionId) {
      if (isDestroyed || !container) {
        return false;
      }
      
      deselectAll();
      const region = container.querySelector(`[data-region="${regionId}"]`);
      if (region) {
        region.classList.add('is-selected');
        return true;
      }
      return false;
    }

    function deselectAll() {
      regions.forEach(region => {
        region.classList.remove('is-selected');
      });
    }

    function dispatchMapEvent(eventName, detail) {
      if (isDestroyed || !container) {
        return;
      }
      
      const event = new CustomEvent(eventName, {
        bubbles: true,
        detail: detail
      });
      container.dispatchEvent(event);
    }

    function destroy() {
      // Mark as destroyed first to prevent async callbacks from proceeding
      isDestroyed = true;
      
      // Clean up any open region card (immediate removal, no animation)
      if (activeCard || activeOverlay || activeRegionElement) {
        if (activeCard && activeCard.parentNode) {
          activeCard.remove();
        }
        if (activeOverlay && activeOverlay.parentNode) {
          activeOverlay.remove();
        }
        activeCard = null;
        activeOverlay = null;
        activeRegionElement = null;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleCardEscape);
      }
      
      regions.forEach(region => {
        region.removeEventListener('mouseenter', handleMouseEnter);
        region.removeEventListener('mousemove', handleMouseMove);
        region.removeEventListener('mouseleave', handleMouseLeave);
        region.removeEventListener('click', handleClick);
        region.removeEventListener('keydown', handleKeyDown);
        region.removeEventListener('focus', handleFocus);
        region.removeEventListener('blur', handleBlur);
        region.removeEventListener('touchstart', handleTouchStart);
        region.removeEventListener('touchend', handleTouchEnd);
        region.removeEventListener('touchcancel', handleTouchCancel);
      });

      if (tooltip) {
        tooltip.remove();
      }

      if (container) {
        container.innerHTML = '';
      }
      container = null;
      tooltip = null;
      regions = [];
    }

    // Start loading the SVG
    loadSVG();

    // Return instance API
    return {
      getRegions: () => regions,
      selectRegion: selectRegion,
      deselectAll: deselectAll,
      destroy: destroy
    };
  }

  /**
   * Initialize the map in a container
   * @param {string|HTMLElement} selector - CSS selector or DOM element
   * @param {Object} options - Configuration options
   */
  function init(selector, options = {}) {
    // Get container
    const container = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;

    if (!container) {
      console.error('MinasMap: Container not found:', selector);
      return null;
    }

    // Create and return a new instance
    return createInstance(container, options);
  }

  return {
    init: init
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MinasMap;
}
