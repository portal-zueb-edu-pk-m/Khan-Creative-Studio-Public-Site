/**
 * Khan Creative Studio — Individual Service Detail Controller (service-detail.js)
 */

import { db } from './supabase.js';
import { formatPKR, escapeHTML, getQueryParam, getSvgIcon, showToast } from './utils.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { setupSEO } from './seo.js';
import { cart } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initFooter();

  const slug = getQueryParam('slug') || 'website-development';
  let currentService = null;

  try {
    currentService = await db.getServiceBySlug(slug);
  } catch (err) {
    console.error('Failed to load service detail:', err);
  }

  if (!currentService) {
    const mainEl = document.getElementById('service-detail-container');
    if (mainEl) {
      mainEl.innerHTML = `
        <div class="container section-pad" style="text-align: center;">
          <h2>Service Not Found</h2>
          <p>The requested creative service does not exist or has been moved.</p>
          <a href="services.html" class="btn btn-primary" style="margin-top: 20px;">Browse All Services</a>
        </div>
      `;
    }
    return;
  }

  // Set Page SEO & Title
  setupSEO({
    title: `${currentService.title} in Pakistan | Khan Creative Studio`,
    description: currentService.short_description,
    canonicalUrl: `https://khancreativestudio.com/service.html?slug=${encodeURIComponent(currentService.slug)}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'serviceType': currentService.title,
      'provider': {
        '@type': 'ProfessionalService',
        'name': 'Khan Creative Studio',
        'url': 'https://khancreativestudio.com'
      },
      'offers': {
        '@type': 'Offer',
        'price': currentService.starting_price,
        'priceCurrency': 'PKR'
      },
      'description': currentService.short_description
    }
  });

  // Render Service Elements
  const titleEl = document.getElementById('service-title');
  const catEl = document.getElementById('service-category');
  const descEl = document.getElementById('service-desc');
  const priceEl = document.getElementById('service-price');
  const deliveryEl = document.getElementById('service-delivery');
  const featuresList = document.getElementById('service-features');
  const serviceIconBox = document.getElementById('service-icon-box');

  if (titleEl) titleEl.textContent = currentService.title;
  if (catEl) catEl.textContent = currentService.category;
  if (descEl) descEl.innerHTML = escapeHTML(currentService.full_description).replace(/\n/g, '<br/>');
  if (priceEl) priceEl.textContent = formatPKR(currentService.starting_price);
  if (deliveryEl) deliveryEl.textContent = currentService.delivery_time || '5-7 business days';
  if (serviceIconBox) serviceIconBox.innerHTML = getSvgIcon(currentService.icon || 'code');

  if (featuresList) {
    let feats = [];
    try {
      feats = Array.isArray(currentService.features) ? currentService.features : JSON.parse(currentService.features || '[]');
    } catch {
      feats = ['Bespoke Custom Execution', 'Performance Optimization', 'Commercial Usage License', 'Full Revision Cycle'];
    }

    featuresList.innerHTML = feats.map(f => `
      <li style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 1.05rem;">
        <span style="color: var(--color-dark-mint);">${getSvgIcon('check')}</span>
        <span>${escapeHTML(f)}</span>
      </li>
    `).join('');
  }

  // Add To Cart Button for Service
  const addCartBtn = document.getElementById('service-add-cart-btn');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      cart.addItem({
        id: currentService.id,
        name: currentService.title,
        price: currentService.starting_price,
        type: 'service'
      });
      showToast(`${currentService.title} added to cart!`, 'success');
    });
  }

  // Service Inquiry / Booking Form
  const enquiryForm = document.getElementById('service-enquiry-form');
  const couponInput = document.getElementById('enquiry-coupon-input');
  const couponBtn = document.getElementById('enquiry-coupon-btn');
  const couponMsg = document.getElementById('enquiry-coupon-msg');
  let enquiryCoupon = null;
  let enquiryDiscount = 0;

  async function applyEnquiryCoupon() {
    const code = couponInput ? couponInput.value.trim().toUpperCase() : '';
    enquiryCoupon = null;
    enquiryDiscount = 0;
    if (!code) {
      if (couponMsg) couponMsg.textContent = '';
      return false;
    }
    try {
      const coupon = await db.validateCoupon(code);
      if (!coupon) {
        if (couponMsg) { couponMsg.style.color = '#DC2626'; couponMsg.textContent = 'Invalid or expired coupon code.'; }
        showToast('Invalid or expired coupon code.', 'error');
        return false;
      }
      const base = Number(currentService.starting_price) || 0;
      if (coupon.min_order_amount && base < coupon.min_order_amount) {
        if (couponMsg) { couponMsg.style.color = '#DC2626'; couponMsg.textContent = `This coupon needs a minimum order of ${formatPKR(coupon.min_order_amount)}.`; }
        showToast('Coupon minimum order amount not met for this service.', 'error');
        return false;
      }
      enquiryCoupon = coupon;
      enquiryDiscount = coupon.discount_type === 'percentage'
        ? (base * coupon.discount_value) / 100
        : Math.min(coupon.discount_value, base);
      if (couponMsg) {
        couponMsg.style.color = '#059669';
        couponMsg.textContent = `Coupon ${coupon.code} applied` + (enquiryDiscount > 0 ? ` — about ${formatPKR(enquiryDiscount)} off the starting price.` : '.');
      }
      return true;
    } catch (err) {
      console.error('Coupon check error:', err);
      showToast('Could not verify coupon right now.', 'error');
      return false;
    }
  }

  if (couponBtn) couponBtn.addEventListener('click', applyEnquiryCoupon);

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const leadData = {
        name: enquiryForm.name.value.trim(),
        email: enquiryForm.email.value.trim(),
        phone: enquiryForm.phone.value.trim(),
        service_requested: currentService.title,
        message: enquiryForm.message.value.trim(),
        lead_type: 'service_booking'
      };

      if (!leadData.name || !leadData.email || !leadData.message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Coupon: if the visitor typed a code, make sure it is valid before sending
      const typedCode = couponInput ? couponInput.value.trim().toUpperCase() : '';
      if (typedCode && (!enquiryCoupon || enquiryCoupon.code !== typedCode)) {
        const ok = await applyEnquiryCoupon();
        if (!ok) return;
      }
      if (enquiryCoupon) {
        leadData.coupon_code = enquiryCoupon.code;
        leadData.discount_amount = enquiryDiscount;
        leadData.message += `\n\n[Coupon applied: ${enquiryCoupon.code}${enquiryDiscount > 0 ? ' — estimated discount Rs. ' + Math.round(enquiryDiscount).toLocaleString() + ' on starting price' : ''}]`;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Request...';

      try {
        await db.submitLead(leadData);
        showToast('Your booking request has been submitted! Our creative team will contact you shortly.', 'success');
        enquiryForm.reset();
        enquiryCoupon = null;
        enquiryDiscount = 0;
        if (couponMsg) couponMsg.textContent = '';
      } catch (err) {
        console.error('Lead submit error:', err);
        showToast('Failed to submit. Please contact us directly via WhatsApp or phone.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});
