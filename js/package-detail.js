/**
 * Khan Creative Studio — Packages Page Controller (package-detail.js)
 */

import { db } from './supabase.js';
import { formatPKR, escapeHTML, getSvgIcon } from './utils.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { cart } from './cart.js';
import { setupSEO } from './seo.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initFooter();

  setupSEO({
    title: 'Agency Packages & Pricing in Pakistan | Khan Creative Studio',
    description: 'Transparent, high-value creative agency packages for website development, corporate branding, and full digital transformation in Pakistan.',
    canonicalUrl: 'https://khancreativestudio.com/package.html'
  });

  const grid = document.getElementById('packages-full-grid');
  if (!grid) return;

  try {
    const packages = await db.getPackages();
    grid.innerHTML = packages.map(pkg => {
      let featureList = [];
      try {
        featureList = Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features || '[]');
      } catch {
        featureList = ['Complete Project Deliverables', 'Commercial License Rights', 'Full Source Files'];
      }

      return `
        <div class="package-card ${pkg.is_featured ? 'featured' : ''} animate-fade-up">
          ${pkg.is_featured ? '<div class="package-badge-popular">Most Popular</div>' : ''}
          <span class="package-tier-name">${escapeHTML(pkg.tier || 'Package')}</span>
          <h3 class="package-name">${escapeHTML(pkg.name)}</h3>
          <p class="package-desc">${escapeHTML(pkg.description)}</p>
          <div class="package-price-wrap">
            <span class="package-price-current">${formatPKR(pkg.discount_price || pkg.price)}</span>
            ${pkg.discount_price ? `<span class="package-price-original">${formatPKR(pkg.price)}</span>` : ''}
          </div>
          <div style="font-size: 0.88rem; color: var(--color-secondary-text); margin-bottom: 20px;">
            ⏱ Delivery: <strong>${escapeHTML(pkg.delivery_time || '7-10 days')}</strong> | ↺ Revisions: <strong>${escapeHTML(pkg.revisions || 'Standard')}</strong>
          </div>
          <ul class="package-feature-list">
            ${featureList.map(feat => `
              <li class="package-feature-item">
                ${getSvgIcon('check')}
                <span>${escapeHTML(feat)}</span>
              </li>
            `).join('')}
          </ul>
          <button class="btn ${pkg.is_featured ? 'btn-mint' : 'btn-primary'} btn-block add-pkg-btn"
                  data-id="${pkg.id}" 
                  data-name="${escapeHTML(pkg.name)}" 
                  data-price="${pkg.discount_price || pkg.price}"
                  data-tier="${escapeHTML(pkg.tier || 'Standard')}">
            Order This Package
          </button>
        </div>
      `;
    }).join('');

    // Attach click handlers
    grid.querySelectorAll('.add-pkg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = Number(btn.getAttribute('data-price'));
        const tier = btn.getAttribute('data-tier');
        cart.addItem({ id, name, price, tier, type: 'package' });
        window.location.href = 'cart.html';
      });
    });
  } catch (err) {
    console.error('Failed to load packages:', err);
  }
});
