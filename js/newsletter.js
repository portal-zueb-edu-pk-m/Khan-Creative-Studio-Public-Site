/**
 * Khan Creative Studio — Newsletter Subscription Handler
 */

import { db } from './supabase.js';
import { showToast } from './utils.js';

export function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      if (!input || !input.value) return;

      const email = input.value.trim();
      const originalText = btn ? btn.innerHTML : 'Subscribe';

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Subscribing...';
      }

      try {
        const res = await db.subscribeNewsletter(email);
        if (res.alreadySubscribed) {
          showToast('You are already subscribed to our newsletter!', 'success');
        } else {
          showToast('Thank you for subscribing to Khan Creative Studio insights!', 'success');
          input.value = '';
        }
      } catch {
        showToast('Unable to subscribe right now. Please try again.', 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    });
  });
}
