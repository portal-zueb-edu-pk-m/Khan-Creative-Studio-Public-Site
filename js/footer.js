/**
 * Khan Creative Studio — Dynamic Footer
 */

import { db } from './supabase.js';

export async function initFooter() {
  const footer = document.querySelector('.kcs-footer');
  if (!footer) return;

  try {
    const settings = await db.getSettings();
    if (settings) {
      const descEl = footer.querySelector('[data-footer-desc]');
      if (descEl && settings.business_description) {
        descEl.textContent = settings.business_description;
      }

      const emailEl = footer.querySelector('[data-footer-email]');
      if (emailEl && settings.contact_email) {
        emailEl.textContent = settings.contact_email;
        emailEl.href = `mailto:${settings.contact_email}`;
      }

      const phoneEl = footer.querySelector('[data-footer-phone]');
      if (phoneEl && settings.phone_number) {
        phoneEl.textContent = settings.phone_number;
        phoneEl.href = `tel:${settings.phone_number.replace(/\s+/g, '')}`;
      }

      const addressEl = footer.querySelector('[data-footer-address]');
      if (addressEl && settings.business_address) {
        addressEl.textContent = settings.business_address;
      }
    }
  } catch (err) {
    console.warn('Footer settings load error:', err);
  }

  const yearEl = footer.querySelector('[data-current-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
