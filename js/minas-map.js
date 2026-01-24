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

  // Region names mapping (path id to display name)
  const regionNames = {
    'path3030': 'Sul/Sudoeste de Minas',
    'path3032': 'Zona da Mata',
    'path3034': 'Campo das Vertentes',
    'path3036': 'Vale do Rio Doce',
    'path3038': 'Metropolitana de Belo Horizonte',
    'path3040': 'Central Mineira',
    'path3042': 'Vale do Mucuri',
    'path3044': 'Jequitinhonha',
    'path3050': 'Norte de Minas',
    'path3052': 'Noroeste de Minas',
    'path3054': 'Triângulo Mineiro/Alto Paranaíba',
    'path3056': 'Oeste de Minas'
  };

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

      const wasSelected = region.classList.contains('is-selected');
      deselectAll();
      
      if (!wasSelected) {
        region.classList.add('is-selected');
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
