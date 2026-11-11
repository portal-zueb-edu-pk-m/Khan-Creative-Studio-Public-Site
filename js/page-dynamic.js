/**
 * Khan Creative Studio — Dynamic CMS Page Loader (page-dynamic.js)
 */

import { db } from './supabase.js';
import { getQueryParam, escapeHTML } from './utils.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { setupSEO } from './seo.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initFooter();

  const slug = getQueryParam('slug') || 'privacy-policy';
  const pageTitleEl = document.getElementById('cms-page-title');
  const pageContentEl = document.getElementById('cms-page-content');

  try {
    const page = await db.getPageBySlug(slug);
    if (page) {
      if (pageTitleEl) pageTitleEl.textContent = page.title;
      if (pageContentEl) pageContentEl.innerHTML = page.content;

      setupSEO({
        title: `${page.title} | Khan Creative Studio`,
        description: page.seo_description || `${page.title} - Khan Creative Studio`,
        canonicalUrl: `https://khancreativestudio.com/page.html?slug=${encodeURIComponent(page.slug)}`
      });
      return;
    }
  } catch (err) {
    console.warn('CMS Page dynamic fetch error:', err);
  }

  // Fallback defaults for Privacy & Terms
  if (slug === 'privacy-policy') {
    if (pageTitleEl) pageTitleEl.textContent = 'Privacy Policy';
    if (pageContentEl) {
      pageContentEl.innerHTML = `
        <p>Khan Creative Studio is committed to protecting your privacy. This policy outlines how we handle personal data received through project inquiries, order requests, and newsletter signups.</p>
        <h3>Data Collection & Usage</h3>
        <p>We collect contact details provided by you solely to respond to project requirements, execute creative deliverables, and process orders.</p>
        <h3>Data Security</h3>
        <p>All information submitted to Khan Creative Studio is protected under strict security policies. We never sell or distribute your data to third parties.</p>
      `;
    }
  } else if (slug === 'terms-and-conditions') {
    if (pageTitleEl) pageTitleEl.textContent = 'Terms and Conditions';
    if (pageContentEl) {
      pageContentEl.innerHTML = `
        <p>By engaging Khan Creative Studio for digital services, you agree to our commercial project terms and client responsibilities.</p>
        <h3>Project Timelines & Milestones</h3>
        <p>Creative timelines begin upon receipt of complete client briefs and initial retainer milestone payments. Deliverables are finalized per agreed revision cycles.</p>
        <h3>Intellectual Property</h3>
        <p>Final project assets, source vectors, and software deliverables are transferred upon complete invoice settlement.</p>
      `;
    }
  } else {
    if (pageTitleEl) pageTitleEl.textContent = 'Page Not Found';
    if (pageContentEl) {
      pageContentEl.innerHTML = '<p>The requested page could not be located. <a href="index.html">Return to homepage</a>.</p>';
    }
  }
});
