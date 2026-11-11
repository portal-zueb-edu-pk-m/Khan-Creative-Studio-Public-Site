/**
 * Khan Creative Studio — Homepage Logic (main.js)
 */

import { db } from './supabase.js';
import { formatPKR, escapeHTML, getSvgIcon } from './utils.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { initNewsletter } from './newsletter.js';
import { cart } from './cart.js';
import { setupSEO } from './seo.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize common UI controllers
  initNavbar();
  initFooter();
  initNewsletter();

  setupSEO({
    title: 'Khan Creative Studio | Elite Digital & Creative Agency in Pakistan',
    description: 'Bespoke website development, graphic design in Pakistan, branding, AI video advertisements, and digital marketing.',
    canonicalUrl: 'https://khancreativestudio.com/'
  });

  // Load Hero Settings dynamically
  try {
    const settings = await db.getSettings();
    if (settings) {
      const headlineEl = document.querySelector('[data-hero-headline]');
      const subheadEl = document.querySelector('[data-hero-subheadline]');
      const ctaBtn = document.querySelector('[data-hero-primary-cta]');

      if (headlineEl && settings.hero_headline) headlineEl.textContent = settings.hero_headline;
      if (subheadEl && settings.hero_subheadline) subheadEl.textContent = settings.hero_subheadline;
      if (ctaBtn && settings.hero_primary_cta_text) {
        ctaBtn.textContent = settings.hero_primary_cta_text;
        if (settings.hero_primary_cta_url) ctaBtn.href = settings.hero_primary_cta_url;
      }
    }
  } catch (err) {
    console.warn('Hero settings load error:', err);
  }

  // Load Services for Homepage Grid
  const servicesGrid = document.getElementById('featured-services-grid');
  if (servicesGrid) {
    try {
      const services = await db.getServices();
      const featured = services.filter(s => s.is_featured).slice(0, 6);
      
      servicesGrid.innerHTML = featured.map(service => `
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
              Details ${getSvgIcon('arrowRight')}
            </a>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to load services on homepage:', err);
    }
  }

  // Load Featured Packages
  const packagesGrid = document.getElementById('featured-packages-grid');
  if (packagesGrid) {
    try {
      const packages = await db.getPackages();
      const activePackages = packages.filter(p => p.is_active).slice(0, 3);

      packagesGrid.innerHTML = activePackages.map(pkg => {
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
            <ul class="package-feature-list">
              ${featureList.map(feat => `
                <li class="package-feature-item">
                  ${getSvgIcon('check')}
                  <span>${escapeHTML(feat)}</span>
                </li>
              `).join('')}
            </ul>
            <button class="btn ${pkg.is_featured ? 'btn-mint' : 'btn-primary'} btn-block add-package-btn" data-id="${pkg.id}" data-name="${escapeHTML(pkg.name)}" data-price="${pkg.discount_price || pkg.price}">
              Select Package
            </button>
          </div>
        `;
      }).join('');

      // Add to Cart Handlers
      packagesGrid.querySelectorAll('.add-package-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const name = btn.getAttribute('data-name');
          const price = Number(btn.getAttribute('data-price'));
          cart.addItem({ id, name, price, type: 'package' });
          window.location.href = 'cart.html';
        });
      });
    } catch (err) {
      console.error('Failed to load packages on homepage:', err);
    }
  }

  // Load Approved Reviews
  const reviewsGrid = document.getElementById('homepage-reviews-grid');
  if (reviewsGrid) {
    try {
      const reviews = await db.getReviews();
      const approved = reviews.filter(r => r.is_approved).slice(0, 3);

      if (approved.length === 0) {
        reviewsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-secondary-text);">No reviews published yet. <a href="reviews.html" style="font-weight: 600;">Be the first to share your experience!</a></p>';
        return;
      }

      reviewsGrid.innerHTML = approved.map(r => `
        <div class="review-card">
          <div class="review-stars">
            ${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}
          </div>
          <p class="review-quote">"${escapeHTML(r.review_text)}"</p>
          <div class="review-author">
            <div class="review-avatar">
              ${escapeHTML(r.client_name ? r.client_name.charAt(0) : 'K')}
            </div>
            <div>
              <div class="review-author-name">${escapeHTML(r.client_name)}</div>
              <div class="review-author-role">${escapeHTML(r.client_role || 'Client')}</div>
            </div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to load reviews on homepage:', err);
    }
  }
});
