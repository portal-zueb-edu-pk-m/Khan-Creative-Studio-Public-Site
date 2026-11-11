/**
 * Khan Creative Studio — Contact Form Controller (contact.js)
 */

import { db } from './supabase.js';
import { showToast } from './utils.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { setupSEO } from './seo.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFooter();

  setupSEO({
    title: 'Contact Us | Khan Creative Studio Pakistan',
    description: 'Get in touch with Khan Creative Studio for bespoke website development, branding, graphic design, and marketing inquiries.',
    canonicalUrl: 'https://khancreativestudio.com/contact.html'
  });

  const contactForm = document.getElementById('agency-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Spam honeypot check
    const honeypot = contactForm.querySelector('input[name="website_url_hp"]');
    if (honeypot && honeypot.value) {
      console.warn('Bot detected by honeypot.');
      return;
    }

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const phone = contactForm.phone ? contactForm.phone.value.trim() : '';
    const serviceRequested = contactForm.service ? contactForm.service.value : 'General Inquiry';
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Message...';

    const payload = {
      name,
      email,
      phone,
      service_requested: serviceRequested,
      message,
      lead_type: 'contact_form'
    };

    try {
      await db.submitLead(payload);
      showToast('Thank you! Your message has been received. Our team will contact you shortly.', 'success');
      contactForm.reset();
    } catch (err) {
      console.error('Contact submission error:', err);
      showToast('Failed to send message. Please contact us via WhatsApp.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
