/**
 * Khan Creative Studio — Services Page Controller
 */

import { db } from './supabase.js';
import { formatPKR, escapeHTML, getSvgIcon } from './utils.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { setupSEO } from './seo.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initFooter();

  setupSEO({
    title: 'Digital & Creative Services in Pakistan | Khan Creative Studio',
    description: 'Explore our premium suite of creative services: Graphic Designing, Custom Web Development, AI Video Ads, Social Media Marketing, and Brand Identity.',
    canonicalUrl: 'https://khancreativestudio.com/services.html'
  });

  const grid = document.getElementById('services-list-grid');
  const searchInput = document.getElementById('services-search');
  const sortSelect = document.getElementById('services-sort');
  const categoryFilters = document.querySelectorAll('.category-filter-btn');

  let allServices = [];
  let currentCategory = 'All';

  async function loadServices() {
    try {
      allServices = await db.getServices();
      renderServices();
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }

  function renderServices() {
    if (!grid) return;

    let filtered = [...allServices];

    // Filter by Category
    if (currentCategory !== 'All') {
      filtered = filtered.filter(s => s.category.toLowerCase() === currentCategory.toLowerCase());
    }

    // Filter by Search Query
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.short_description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    // Sort by Price or Order
    const sortVal = sortSelect ? sortSelect.value : 'default';
    if (sortVal === 'price-low') {
      filtered.sort((a, b) => (a.starting_price || 0) - (b.starting_price || 0));
    } else if (sortVal === 'price-high') {
      filtered.sort((a, b) => (b.starting_price || 0) - (a.starting_price || 0));
    } else {
      filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <h3 style="margin-bottom: 8px;">No matching services found</h3>
          <p>Try refining your search keyword or switching category filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(service => `
      <div class="service-card animate-fade-up">
        <div class="service-icon-box">
          ${getSvgIcon(service.icon || 'code')}
        </div>
        <span class="service-category-badge">${escapeHTML(service.category)}</span>
        <h3 class="service-card-title">${escapeHTML(service.title)}</h3>
        <p class="service-card-desc">${escapeHTML(service.short_description)}</p>
        <div class="service-card-footer">
          <div>
            <span class="service-price-label">Starting from</span>
            <span class="service-price-val">${formatPKR(service.starting_price)}</span>
          </div>
          <a href="service.html?slug=${encodeURIComponent(service.slug)}" class="btn btn-sm btn-outline">
            View Details ${getSvgIcon('arrowRight')}
          </a>
        </div>
      </div>
    `).join('');
  }

  // Bind filter events
  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderServices();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => renderServices());
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => renderServices());
  }

  loadServices();
});
