/**
 * Khan Creative Studio — Dynamic Navigation Bar
 */

import { db } from './supabase.js';
import { cart } from './cart.js';
import { getSvgIcon } from './utils.js';

export async function initNavbar() {
  const header = document.querySelector('.kcs-header');
  if (!header) return;

  // Window scroll shadow effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const toggleBtn = header.querySelector('.mobile-toggle-btn');
  const navLinksContainer = header.querySelector('.nav-links');

  if (toggleBtn && navLinksContainer) {
    toggleBtn.innerHTML = getSvgIcon('menu');
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      toggleBtn.innerHTML = isOpen ? getSvgIcon('close') : getSvgIcon('menu');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navLinksContainer.classList.contains('open')) {
        navLinksContainer.classList.remove('open');
        toggleBtn.innerHTML = getSvgIcon('menu');
      }
    });
  }

  // Update Cart Counter Badge
  function updateCartBadge() {
    const counter = header.querySelector('.cart-counter');
    if (counter) {
      const count = cart.getCount();
      counter.textContent = count;
      counter.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  updateCartBadge();
  window.addEventListener('cart:updated', updateCartBadge);

  // Fetch navigation links dynamically from Supabase
  try {
    const links = await db.getNavLinks();
    if (links && links.length > 0 && navLinksContainer) {
      const currentPath = window.location.pathname;
      navLinksContainer.innerHTML = links.map(link => {
        const isActive = currentPath.endsWith(link.url) || (link.url === '/index.html' && (currentPath === '/' || currentPath.endsWith('/')));
        return `<a href="${link.url}" class="nav-item ${isActive ? 'active' : ''}">${link.title}</a>`;
      }).join('');
    }
  } catch (e) {
    console.warn('Navbar dynamic link load fallback', e);
  }
}
