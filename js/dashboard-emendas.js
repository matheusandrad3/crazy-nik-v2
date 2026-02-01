/**
 * Dashboard Emendas - Interactive Map & Dynamic Dashboard
 * 
 * This module handles:
 * - Map initialization and interaction
 * - Region selection and dashboard filtering
 * - Dynamic stats and area updates
 * - Mobile menu functionality (imported from shared-utils.js)
 * - Header scroll effects (imported from shared-utils.js)
 */

import { initViewportHeight, initMobileMenu, initStickyHeader } from './shared-utils.js';

(function() {
  'use strict';

  // ========================================
  // MOCK DATA - Emendas por Região
  // ========================================
  
  // Default/Total data for all regions
  const defaultData = {
    nome: 'Minas Gerais',
    descricao: 'Visão consolidada das emendas parlamentares em Minas Gerais',
    totalEmendas: 826,
    valorTotal: 'R$ 180M',
    municipios: 853,
    regioes: 12,
    areas: [
      { nome: 'Saúde', valor: 'R$ 72M', quantidade: 324, porcentagem: 40, cor: 'blue' },
      { nome: 'Educação', valor: 'R$ 54M', quantidade: 248, porcentagem: 30, cor: 'green' },
      { nome: 'Infraestrutura', valor: 'R$ 36M', quantidade: 156, porcentagem: 20, cor: 'yellow' },
      { nome: 'Segurança', valor: 'R$ 10M', quantidade: 52, porcentagem: 5.5, cor: 'purple' },
      { nome: 'Cultura e Esporte', valor: 'R$ 5M', quantidade: 28, porcentagem: 2.8, cor: 'pink' },
      { nome: 'Outros', valor: 'R$ 3M', quantidade: 18, porcentagem: 1.7, cor: 'gray' }
    ]
  };

  const emendasData = {
    'path3030': {
      nome: 'Sul/Sudoeste de Minas',
      descricao: 'Região conhecida pela produção de café de alta qualidade e polo industrial diversificado.',
      totalEmendas: 89,
      valorTotal: 'R$ 24,5M',
      municipios: 146,
      areas: [
        { nome: 'Saúde', valor: 'R$ 9,8M', quantidade: 35, porcentagem: 40, cor: 'blue' },
        { nome: 'Educação', valor: 'R$ 7,2M', quantidade: 28, porcentagem: 29, cor: 'green' },
        { nome: 'Infraestrutura', valor: 'R$ 5,1M', quantidade: 18, porcentagem: 21, cor: 'yellow' },
        { nome: 'Cultura e Esporte', valor: 'R$ 2,4M', quantidade: 8, porcentagem: 10, cor: 'pink' }
      ],
      color: '#1A7D3C'
    },
    'path3032': {
      nome: 'Zona da Mata',
      descricao: 'Importante centro histórico e cultural, com destaque para o turismo e a indústria têxtil.',
      totalEmendas: 72,
      valorTotal: 'R$ 18,3M',
      municipios: 142,
      areas: [
        { nome: 'Saúde', valor: 'R$ 7,5M', quantidade: 29, porcentagem: 41, cor: 'blue' },
        { nome: 'Educação', valor: 'R$ 5,8M', quantidade: 22, porcentagem: 32, cor: 'green' },
        { nome: 'Infraestrutura', valor: 'R$ 3,5M', quantidade: 14, porcentagem: 19, cor: 'yellow' },
        { nome: 'Segurança', valor: 'R$ 1,5M', quantidade: 7, porcentagem: 8, cor: 'purple' }
      ],
      color: '#156B32'
    },
    'path3034': {
      nome: 'Campo das Vertentes',
      descricao: 'Rica em patrimônio histórico, abriga cidades coloniais e tradição artesanal.',
      totalEmendas: 38,
      valorTotal: 'R$ 9,2M',
      municipios: 36,
      areas: [
        { nome: 'Cultura e Esporte', valor: 'R$ 3,8M', quantidade: 15, porcentagem: 41, cor: 'pink' },
        { nome: 'Saúde', valor: 'R$ 3,2M', quantidade: 12, porcentagem: 35, cor: 'blue' },
        { nome: 'Educação', valor: 'R$ 1,5M', quantidade: 7, porcentagem: 16, cor: 'green' },
        { nome: 'Infraestrutura', valor: 'R$ 0,7M', quantidade: 4, porcentagem: 8, cor: 'yellow' }
      ],
      color: '#105928'
    },
    'path3036': {
      nome: 'Vale do Rio Doce',
      descricao: 'Região de grande importância mineral e siderúrgica para o estado.',
      totalEmendas: 67,
      valorTotal: 'R$ 16,8M',
      municipios: 102,
      areas: [
        { nome: 'Saúde', valor: 'R$ 6,7M', quantidade: 26, porcentagem: 40, cor: 'blue' },
        { nome: 'Infraestrutura', valor: 'R$ 5,2M', quantidade: 20, porcentagem: 31, cor: 'yellow' },
        { nome: 'Educação', valor: 'R$ 3,4M', quantidade: 14, porcentagem: 20, cor: 'green' },
        { nome: 'Meio Ambiente', valor: 'R$ 1,5M', quantidade: 7, porcentagem: 9, cor: 'teal' }
      ],
      color: '#228B47'
    },
    'path3038': {
      nome: 'Metropolitana de Belo Horizonte',
      descricao: 'Principal centro econômico e populacional de Minas Gerais, sede da capital.',
      totalEmendas: 156,
      valorTotal: 'R$ 42,5M',
      municipios: 105,
      areas: [
        { nome: 'Saúde', valor: 'R$ 17,2M', quantidade: 62, porcentagem: 40, cor: 'blue' },
        { nome: 'Educação', valor: 'R$ 12,8M', quantidade: 48, porcentagem: 30, cor: 'green' },
        { nome: 'Segurança', valor: 'R$ 6,5M', quantidade: 25, porcentagem: 16, cor: 'purple' },
        { nome: 'Infraestrutura', valor: 'R$ 6,0M', quantidade: 21, porcentagem: 14, cor: 'yellow' }
      ],
      color: '#1E8F45'
    },
    'path3040': {
      nome: 'Central Mineira',
      descricao: 'Região de transição com vocação agropecuária e potencial turístico.',
      totalEmendas: 32,
      valorTotal: 'R$ 7,8M',
      municipios: 30,
      areas: [
        { nome: 'Infraestrutura', valor: 'R$ 3,2M', quantidade: 13, porcentagem: 41, cor: 'yellow' },
        { nome: 'Saúde', valor: 'R$ 2,5M', quantidade: 10, porcentagem: 32, cor: 'blue' },
        { nome: 'Educação', valor: 'R$ 1,4M', quantidade: 6, porcentagem: 18, cor: 'green' },
        { nome: 'Agricultura', valor: 'R$ 0,7M', quantidade: 3, porcentagem: 9, cor: 'teal' }
      ],
      color: '#1A7D3C'
    },
    'path3042': {
      nome: 'Vale do Mucuri',
      descricao: 'Área de desenvolvimento com foco em agricultura familiar e pecuária.',
      totalEmendas: 28,
      valorTotal: 'R$ 6,5M',
      municipios: 23,
      areas: [
        { nome: 'Saúde', valor: 'R$ 2,8M', quantidade: 11, porcentagem: 43, cor: 'blue' },
        { nome: 'Infraestrutura', valor: 'R$ 2,0M', quantidade: 8, porcentagem: 31, cor: 'yellow' },
        { nome: 'Educação', valor: 'R$ 1,2M', quantidade: 6, porcentagem: 18, cor: 'green' },
        { nome: 'Agricultura', valor: 'R$ 0,5M', quantidade: 3, porcentagem: 8, cor: 'teal' }
      ],
      color: '#1E8F45'
    },
    'path3044': {
      nome: 'Jequitinhonha',
      descricao: 'Reconhecida pela riqueza cultural, artesanato e belezas naturais.',
      totalEmendas: 45,
      valorTotal: 'R$ 11,2M',
      municipios: 51,
      areas: [
        { nome: 'Saúde', valor: 'R$ 4,5M', quantidade: 18, porcentagem: 40, cor: 'blue' },
        { nome: 'Educação', valor: 'R$ 3,2M', quantidade: 13, porcentagem: 29, cor: 'green' },
        { nome: 'Cultura e Esporte', valor: 'R$ 2,0M', quantidade: 8, porcentagem: 18, cor: 'pink' },
        { nome: 'Infraestrutura', valor: 'R$ 1,5M', quantidade: 6, porcentagem: 13, cor: 'yellow' }
      ],
      color: '#1A7D3C'
    },
    'path3050': {
      nome: 'Norte de Minas',
      descricao: 'Região de clima semiárido com forte tradição cultural sertaneja.',
      totalEmendas: 78,
      valorTotal: 'R$ 19,5M',
      municipios: 89,
      areas: [
        { nome: 'Saúde', valor: 'R$ 8,2M', quantidade: 32, porcentagem: 42, cor: 'blue' },
        { nome: 'Infraestrutura', valor: 'R$ 5,8M', quantidade: 22, porcentagem: 30, cor: 'yellow' },
        { nome: 'Educação', valor: 'R$ 3,5M', quantidade: 15, porcentagem: 18, cor: 'green' },
        { nome: 'Recursos Hídricos', valor: 'R$ 2,0M', quantidade: 9, porcentagem: 10, cor: 'teal' }
      ],
      color: '#2A9B52'
    },
    'path3052': {
      nome: 'Noroeste de Minas',
      descricao: 'Fronteira agrícola com grande produção de grãos e pecuária extensiva.',
      totalEmendas: 35,
      valorTotal: 'R$ 8,5M',
      municipios: 19,
      areas: [
        { nome: 'Infraestrutura', valor: 'R$ 3,5M', quantidade: 14, porcentagem: 41, cor: 'yellow' },
        { nome: 'Agricultura', valor: 'R$ 2,5M', quantidade: 10, porcentagem: 29, cor: 'teal' },
        { nome: 'Saúde', valor: 'R$ 1,8M', quantidade: 7, porcentagem: 21, cor: 'blue' },
        { nome: 'Educação', valor: 'R$ 0,7M', quantidade: 4, porcentagem: 9, cor: 'green' }
      ],
      color: '#156B32'
    },
    'path3054': {
      nome: 'Triângulo Mineiro/Alto Paranaíba',
      descricao: 'Polo agroindustrial moderno e importante centro logístico do país.',
      totalEmendas: 95,
      valorTotal: 'R$ 26,8M',
      municipios: 66,
      areas: [
        { nome: 'Saúde', valor: 'R$ 10,5M', quantidade: 38, porcentagem: 40, cor: 'blue' },
        { nome: 'Educação', valor: 'R$ 8,2M', quantidade: 30, porcentagem: 31, cor: 'green' },
        { nome: 'Infraestrutura', valor: 'R$ 5,1M', quantidade: 18, porcentagem: 19, cor: 'yellow' },
        { nome: 'Tecnologia', valor: 'R$ 3,0M', quantidade: 9, porcentagem: 10, cor: 'purple' }
      ],
      color: '#1E8F45'
    },
    'path3056': {
      nome: 'Oeste de Minas',
      descricao: 'Região com vocação agropecuária e turismo rural em crescimento.',
      totalEmendas: 42,
      valorTotal: 'R$ 10,2M',
      municipios: 44,
      areas: [
        { nome: 'Saúde', valor: 'R$ 4,2M', quantidade: 16, porcentagem: 41, cor: 'blue' },
        { nome: 'Infraestrutura', valor: 'R$ 3,0M', quantidade: 12, porcentagem: 29, cor: 'yellow' },
        { nome: 'Educação', valor: 'R$ 2,0M', quantidade: 9, porcentagem: 21, cor: 'green' },
        { nome: 'Turismo', valor: 'R$ 1,0M', quantidade: 5, porcentagem: 9, cor: 'pink' }
      ],
      color: '#156B32'
    }
  };

  // Color mappings for area cards
  const areaColors = {
    'blue': { text: 'text-brand-blue', fill: 'dashboard-progress-fill--blue' },
    'green': { text: 'text-brand-green', fill: 'dashboard-progress-fill--green' },
    'yellow': { text: 'text-brand-yellow', fill: 'dashboard-progress-fill--yellow' },
    'purple': { text: 'text-[#8B5CF6]', fill: 'dashboard-progress-fill--purple' },
    'pink': { text: 'text-[#EC4899]', fill: 'dashboard-progress-fill--pink' },
    'gray': { text: 'text-[#6B7280]', fill: 'dashboard-progress-fill--gray' },
    'teal': { text: 'text-[#14B8A6]', fill: 'dashboard-progress-fill--teal' }
  };

  // ========================================
  // STATE
  // ========================================
  
  let mapInstance = null;
  let currentRegion = null;
  let regionCtaHideTimeout = null;
  let userHasInteracted = false; // Track if user has clicked on a region

  // ========================================
  // DOM ELEMENTS
  // ========================================
  
  const elements = {
    statsSection: null,
    headerDefault: null,
    headerRegion: null,
    statsRegionIcon: null,
    statsRegionName: null,
    statsRegionDescription: null,
    clearFilterBtn: null,
    statEmendas: null,
    statValor: null,
    statMunicipios: null,
    statRegioes: null,
    statRegioesLabel: null,
    areasGrid: null,
    areasTitle: null,
    regionCtaContainer: null,
    regionCtaLink: null
  };

  // ========================================
  // DASHBOARD UPDATE FUNCTIONS
  // ========================================

  /**
   * Animate a value change with counting effect
   */
  function animateValue(element, newValue, duration = 300) {
    if (!element) return;
    
    element.classList.add('is-updating');
    
    setTimeout(() => {
      element.textContent = newValue;
      element.classList.remove('is-updating');
      element.classList.add('is-updated');
      
      setTimeout(() => {
        element.classList.remove('is-updated');
      }, 400);
    }, duration / 2);
  }

  /**
   * Update the stats section header based on selected region
   */
  function updateStatsHeader(data, regionId, regionElement) {
    if (!elements.headerDefault || !elements.headerRegion) return;

    if (regionId && data) {
      // Show region header
      elements.headerDefault.classList.add('hidden');
      elements.headerRegion.classList.remove('hidden');
      elements.headerRegion.classList.add('is-visible');
      
      elements.statsRegionName.textContent = data.nome;
      elements.statsRegionDescription.textContent = data.descricao;
      
      // Update region icon with SVG
      if (elements.statsRegionIcon && regionElement) {
        const pathData = regionElement.getAttribute('d');
        
        // Calculate proper viewBox for this region's bounding box
        let viewBoxStr = '0 0 854 661'; // fallback
        try {
          const bbox = regionElement.getBBox();
          // The bbox is in local coordinates, account for the transform
          // Transform is translate(935.77919,-281.37865)
          const tx = 935.77919;
          const ty = -281.37865;
          const transformedX = bbox.x + tx;
          const transformedY = bbox.y + ty;
          // Add 10% padding
          const padding = Math.max(bbox.width, bbox.height) * 0.1;
          viewBoxStr = `${transformedX - padding} ${transformedY - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;
        } catch (e) {
          console.warn('Could not calculate bounding box for region icon:', e);
        }
        
        elements.statsRegionIcon.innerHTML = `
          <svg viewBox="${viewBoxStr}" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(935.77919,-281.37865)">
              <path d="${pathData}" fill="${data.color || '#1E8F45'}" />
            </g>
          </svg>
        `;
      }
    } else {
      // Show default header
      elements.headerRegion.classList.add('hidden');
      elements.headerRegion.classList.remove('is-visible');
      elements.headerDefault.classList.remove('hidden');
    }
  }

  /**
   * Update the stats cards with new data
   */
  function updateStatsCards(data, isRegion = false) {
    animateValue(elements.statEmendas, data.totalEmendas);
    animateValue(elements.statValor, data.valorTotal);
    animateValue(elements.statMunicipios, data.municipios);
    
    if (isRegion) {
      animateValue(elements.statRegioes, data.areas.length);
      if (elements.statRegioesLabel) {
        elements.statRegioesLabel.textContent = 'Áreas Atendidas';
      }
    } else {
      animateValue(elements.statRegioes, data.regioes || 12);
      if (elements.statRegioesLabel) {
        elements.statRegioesLabel.textContent = 'Mesorregiões Atendidas';
      }
    }
  }

  /**
   * Generate area card HTML
   */
  function createAreaCardHTML(area, index) {
    const colors = areaColors[area.cor] || areaColors['gray'];
    
    return `
      <div class="dashboard-area-card" data-area="${area.nome.toLowerCase().replace(/\s+/g, '-')}" style="animation-delay: ${0.1 * index}s;">
        <div class="flex items-center justify-between mb-3">
          <span class="font-inter font-semibold text-[#171717] area-name">${area.nome}</span>
          <span class="font-inter font-bold ${colors.text} area-value">${area.valor}</span>
        </div>
        <div class="dashboard-progress-bar">
          <div class="dashboard-progress-fill ${colors.fill}" style="--progress-width: ${area.porcentagem}%; width: 0;"></div>
        </div>
        <span class="text-xs font-inter text-[#171717]/60 mt-2 block area-count">${area.quantidade} emendas</span>
      </div>
    `;
  }

  /**
   * Update the areas grid with new data
   */
  function updateAreasGrid(data, isRegion = false) {
    if (!elements.areasGrid) return;

    // Add exit animation
    elements.areasGrid.classList.add('is-updating');
    
    setTimeout(() => {
      // Generate new area cards
      const areasHTML = data.areas.map((area, index) => createAreaCardHTML(area, index)).join('');
      elements.areasGrid.innerHTML = areasHTML;
      
      // Update title
      if (elements.areasTitle) {
        elements.areasTitle.textContent = isRegion 
          ? `Áreas Beneficiadas - ${data.nome}` 
          : 'Distribuição por Área';
      }
      
      // Trigger entrance animation
      elements.areasGrid.classList.remove('is-updating');
      elements.areasGrid.classList.add('is-updated');
      
      // Trigger progress bar animations
      requestAnimationFrame(() => {
        const progressBars = elements.areasGrid.querySelectorAll('.dashboard-progress-fill');
        progressBars.forEach((bar, i) => {
          setTimeout(() => {
            const targetWidth = bar.style.getPropertyValue('--progress-width');
            bar.style.width = targetWidth;
          }, 100 + (i * 50));
        });
      });
      
      setTimeout(() => {
        elements.areasGrid.classList.remove('is-updated');
      }, 600);
    }, 200);
  }

  /**
   * Update the region CTA button
   */
  function updateRegionCTA(regionId, show = true) {
    if (!elements.regionCtaContainer || !elements.regionCtaLink) return;

    // Cancel any pending hide timeout to prevent race conditions
    if (regionCtaHideTimeout !== null) {
      clearTimeout(regionCtaHideTimeout);
      regionCtaHideTimeout = null;
    }

    if (show && regionId) {
      elements.regionCtaContainer.classList.remove('hidden');
      elements.regionCtaLink.href = `emendas-regiao.html?regiao=${encodeURIComponent(regionId)}`;
      
      requestAnimationFrame(() => {
        elements.regionCtaContainer.classList.add('is-visible');
      });
    } else {
      elements.regionCtaContainer.classList.remove('is-visible');
      
      regionCtaHideTimeout = setTimeout(() => {
        elements.regionCtaContainer.classList.add('hidden');
        regionCtaHideTimeout = null;
      }, 300);
    }
  }

  /**
   * Select a region and update the dashboard
   * @param {string} regionId - The region identifier
   * @param {Element|null} regionElement - The map region element (can be null)
   * @param {boolean} shouldScroll - Whether to scroll to stats section (default: true)
   */
  function selectRegion(regionId, regionElement, shouldScroll = true) {
    // Validate that regionId is a direct property of emendasData (prevent prototype pollution)
    if (!Object.hasOwn(emendasData, regionId)) {
      console.warn(`Invalid region ID: ${regionId}`);
      return;
    }
    
    const data = emendasData[regionId];
    if (!data) return;

    currentRegion = regionId;
    
    // Update section data attribute
    if (elements.statsSection) {
      elements.statsSection.dataset.region = regionId;
      elements.statsSection.classList.add('is-filtered');
    }

    // Scroll to stats section smoothly if requested
    if (shouldScroll && elements.statsSection) {
      const header = document.getElementById('main-header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = elements.statsSection.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition - headerHeight - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // Update all dashboard components
    updateStatsHeader(data, regionId, regionElement);
    updateStatsCards(data, true);
    updateAreasGrid(data, true);
    updateRegionCTA(regionId, true);
  }

  /**
   * Clear region filter and show default data
   */
  function clearRegionFilter() {
    currentRegion = null;
    
    // Update section data attribute
    if (elements.statsSection) {
      elements.statsSection.dataset.region = '';
      elements.statsSection.classList.remove('is-filtered');
    }

    // Deselect on map
    if (mapInstance) {
      mapInstance.deselectAll();
    }

    // Clear URL parameter
    updateURLWithRegion(null);

    // Update all dashboard components with default data
    updateStatsHeader(null, null, null);
    updateStatsCards(defaultData, false);
    updateAreasGrid(defaultData, false);
    updateRegionCTA(null, false);
  }

  // ========================================
  // URL PARAMETER HANDLING
  // ========================================

  /**
   * Get region ID from URL hash fragment
   * Supports format: #regiao=path3038
   * 
   * Security Note: This function extracts user input from the URL hash.
   * The returned value MUST be validated with Object.hasOwn() before
   * accessing emendasData to prevent prototype pollution attacks.
   */
  function getRegionFromURL() {
    const hash = window.location.hash;
    if (!hash) return null;
    
    // Parse hash fragment like "#regiao=path3038"
    const match = hash.match(/regiao=([^&]+)/);
    if (match && match[1]) {
      try {
        return decodeURIComponent(match[1]);
      } catch (e) {
        // Handle malformed percent-encoded URLs (e.g., #regiao=%E0 or #regiao=%)
        // Log error and return null to prevent dashboard initialization crash
        console.warn('Invalid URL-encoded region parameter:', match[1], e);
        return null;
      }
    }
    return null;
  }

  /**
   * Update URL with region hash fragment (without page reload)
   */
  function updateURLWithRegion(regionId) {
    if (regionId) {
      window.history.replaceState({}, '', `#regiao=${encodeURIComponent(regionId)}`);
    } else {
      // Remove hash without causing scroll
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }
  }

  // ========================================
  // MAP INITIALIZATION
  // ========================================
  
  function initDashboardMap() {
    if (typeof MinasMap === 'undefined') {
      console.warn('MinasMap module not loaded');
      return;
    }

    const mapContainer = document.getElementById('dashboard-map');
    if (!mapContainer) return;

    // Initialize map with custom options - disable the built-in card
    mapInstance = MinasMap.init(mapContainer, {
      showCard: false, // We update the dashboard instead
      showTooltip: true
    });

    // Listen for region clicks
    mapContainer.addEventListener('minas-map:region-click', function(e) {
      const { region, element, selected } = e.detail;
      
      // Mark that user has explicitly interacted with the map
      userHasInteracted = true;
      
      if (selected && Object.hasOwn(emendasData, region)) {
        selectRegion(region, element);
        updateURLWithRegion(region);
      } else {
        clearRegionFilter();
        updateURLWithRegion(null);
      }
    });

    // Check if we have a region in the URL and select it after map loads
    const urlRegion = getRegionFromURL();
    if (urlRegion && Object.hasOwn(emendasData, urlRegion)) {
      // Wait for the SVG map to load, then select the region
      waitForMapAndSelectRegion(mapContainer, urlRegion);
    }
  }

  /**
   * Wait for the map SVG to load, then select the specified region
   */
  function waitForMapAndSelectRegion(mapContainer, regionId) {
    const checkInterval = 100; // ms
    const maxWait = 5000; // ms
    let waited = 0;

    function checkAndSelect() {
      // Try to find by data-region attribute (set after map processes) 
      // or by original id attribute (the path id in SVG)
      let regionElement = mapContainer.querySelector(`[data-region="${regionId}"]`);
      
      if (!regionElement) {
        // Try by id attribute directly
        regionElement = mapContainer.querySelector(`#${regionId}`);
      }
      
      // Check if the element has data-region (meaning map is fully initialized)
      const isMapReady = regionElement && regionElement.hasAttribute('data-region');
      
      if (isMapReady) {
        // Check if user has already interacted before applying URL selection
        if (userHasInteracted) {
          console.log('User already selected a region, skipping URL-based selection');
          return;
        }
        
        // Found the region and map is ready, select it
        setTimeout(() => {
          // Double-check user hasn't interacted during this delay
          if (userHasInteracted) {
            console.log('User interacted during delay, skipping URL-based selection');
            return;
          }
          
          // Use the mapInstance to select the region visually
          if (mapInstance) {
            mapInstance.selectRegion(regionId);
          }
          // Update the dashboard with region data (no scroll since user came directly to this page)
          selectRegion(regionId, regionElement, false);
        }, 100); // Small delay to ensure everything is rendered
      } else if (waited < maxWait) {
        // Keep waiting
        waited += checkInterval;
        setTimeout(checkAndSelect, checkInterval);
      } else {
        // Timeout - try to at least update the dashboard without map selection
        console.warn('Map did not fully load in time, updating dashboard only');
        const data = Object.hasOwn(emendasData, regionId) ? emendasData[regionId] : null;
        if (data) {
          // Set currentRegion so Escape key handler works correctly
          currentRegion = regionId;
          updateStatsHeader(data, regionId, null);
          updateStatsCards(data, true);
          updateAreasGrid(data, true);
          updateRegionCTA(regionId, true);
          if (elements.statsSection) {
            elements.statsSection.dataset.region = regionId;
            elements.statsSection.classList.add('is-filtered');
          }
        }
      }
    }

    checkAndSelect();
  }

  // ========================================
  // PROGRESS BAR ANIMATION
  // ========================================
  
  function initProgressBars() {
    const progressBars = document.querySelectorAll('.dashboard-progress-fill');
    
    progressBars.forEach(bar => {
      const targetWidth = bar.style.width;
      if (targetWidth) {
        bar.style.setProperty('--progress-width', targetWidth);
        bar.style.width = '0';
        
        // Animate after a brief delay
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 500);
      }
    });
  }

  // ========================================
  // CACHE DOM ELEMENTS
  // ========================================
  
  function cacheElements() {
    elements.statsSection = document.getElementById('dashboard-stats');
    elements.headerDefault = document.getElementById('stats-header-default');
    elements.headerRegion = document.getElementById('stats-header-region');
    elements.statsRegionIcon = document.getElementById('stats-region-icon');
    elements.statsRegionName = document.getElementById('stats-region-name');
    elements.statsRegionDescription = document.getElementById('stats-region-description');
    elements.clearFilterBtn = document.getElementById('stats-clear-filter');
    elements.statEmendas = document.getElementById('stat-emendas');
    elements.statValor = document.getElementById('stat-valor');
    elements.statMunicipios = document.getElementById('stat-municipios');
    elements.statRegioes = document.getElementById('stat-regioes');
    elements.statRegioesLabel = document.getElementById('stat-regioes-label');
    elements.areasGrid = document.getElementById('areas-grid');
    elements.areasTitle = document.getElementById('areas-title');
    elements.regionCtaContainer = document.getElementById('region-cta-container');
    elements.regionCtaLink = document.getElementById('region-cta-link');
  }

  // ========================================
  // EVENT BINDINGS
  // ========================================
  
  function bindEvents() {
    // Clear filter button
    if (elements.clearFilterBtn) {
      elements.clearFilterBtn.addEventListener('click', clearRegionFilter);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && currentRegion) {
        // Don't clear filter if mobile menu is open (let mobile menu handler take priority)
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          return;
        }
        clearRegionFilter();
      }
    });
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  
  function init() {
    // Initialize viewport height handling (from shared-utils)
    initViewportHeight();

    // Cache DOM elements
    cacheElements();

    // Initialize components
    initMobileMenu();      // from shared-utils.js
    initStickyHeader();    // from shared-utils.js
    initDashboardMap();
    initProgressBars();
    bindEvents();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
