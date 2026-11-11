/**
 * Khan Creative Studio — Cart & Checkout Page Controller (cart-page.js)
 */

import { cart } from './cart.js';
import { db } from './supabase.js';
import { formatPKR, escapeHTML, showToast, getSvgIcon } from './utils.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { setupSEO } from './seo.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFooter();

  setupSEO({
    title: 'Your Order Cart | Khan Creative Studio',
    description: 'Review your selected digital packages and confirm your booking with Khan Creative Studio.',
    canonicalUrl: 'https://khancreativestudio.com/cart.html'
  });

  const cartContainer = document.getElementById('cart-items-wrapper');
  const cartEmpty = document.getElementById('cart-empty-state');
  const cartContent = document.getElementById('cart-content-wrapper');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');
  const couponForm = document.getElementById('coupon-form');
  const couponInput = document.getElementById('coupon-code-input');
  const checkoutForm = document.getElementById('checkout-form');
  const successModal = document.getElementById('order-success-modal');

  let appliedCoupon = null;

  function renderCart() {
    const items = cart.getItems();

    if (items.length === 0) {
      if (cartContent) cartContent.style.display = 'none';
      if (cartEmpty) cartEmpty.style.display = 'block';
      return;
    }

    if (cartContent) cartContent.style.display = 'grid';
    if (cartEmpty) cartEmpty.style.display = 'none';

    if (cartContainer) {
      cartContainer.innerHTML = items.map(item => `
        <div class="cart-item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid var(--color-borders); gap: 16px;">
          <div style="flex-grow: 1;">
            <h4 style="font-size: 1.1rem; margin-bottom: 4px;">${escapeHTML(item.name)}</h4>
            <span style="font-size: 0.82rem; color: var(--color-mid-purple); font-weight: 600; text-transform: uppercase;">${escapeHTML(item.type)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="btn btn-sm btn-outline qty-btn" data-id="${item.id}" data-action="dec" style="padding: 4px 10px; border-radius: 4px;">-</button>
            <span style="font-weight: 700; width: 24px; text-align: center;">${item.quantity || 1}</span>
            <button class="btn btn-sm btn-outline qty-btn" data-id="${item.id}" data-action="inc" style="padding: 4px 10px; border-radius: 4px;">+</button>
          </div>
          <div style="min-width: 110px; text-align: right;">
            <div style="font-family: var(--font-heading); font-weight: 700; color: var(--color-dark-purple);">
              ${formatPKR(item.price * (item.quantity || 1))}
            </div>
            <button class="remove-item-btn" data-id="${item.id}" style="background: none; border: none; color: var(--color-danger); font-size: 0.8rem; cursor: pointer; margin-top: 4px;">Remove</button>
          </div>
        </div>
      `).join('');

      // Quantity buttons
      cartContainer.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const action = btn.getAttribute('data-action');
          const item = items.find(i => i.id === id);
          if (item) {
            const newQty = action === 'inc' ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
            cart.updateQuantity(id, newQty);
            renderCart();
          }
        });
      });

      // Remove buttons
      cartContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          cart.removeItem(id);
          renderCart();
          showToast('Item removed from cart.', 'success');
        });
      });
    }

    calculateTotals();
  }

  function calculateTotals() {
    const subtotal = cart.getSubtotal();
    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discount_type === 'percentage') {
        discount = (subtotal * appliedCoupon.discount_value) / 100;
      } else {
        discount = Math.min(appliedCoupon.discount_value, subtotal);
      }
    }

    const total = Math.max(0, subtotal - discount);

    if (subtotalEl) subtotalEl.textContent = formatPKR(subtotal);
    if (discountRow && discountEl) {
      if (discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `- ${formatPKR(discount)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
    if (totalEl) totalEl.textContent = formatPKR(total);
  }

  // Handle Coupon Application
  if (couponForm && couponInput) {
    couponForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = couponInput.value.trim().toUpperCase();
      if (!code) return;

      const subtotal = cart.getSubtotal();
      try {
        const coupon = await db.validateCoupon(code);
        if (!coupon) {
          showToast('Invalid or expired coupon code.', 'error');
          return;
        }

        if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
          showToast(`This coupon requires a minimum subtotal of ${formatPKR(coupon.min_order_amount)}.`, 'error');
          return;
        }

        appliedCoupon = coupon;
        calculateTotals();
        showToast(`Coupon "${code}" applied successfully!`, 'success');
      } catch (err) {
        console.error('Coupon check error:', err);
        showToast('Error verifying coupon.', 'error');
      }
    });
  }

  // Handle Order Checkout Submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const items = cart.getItems();
      if (items.length === 0) {
        showToast('Your cart is empty.', 'error');
        return;
      }

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      const subtotal = cart.getSubtotal();
      let discount = 0;
      if (appliedCoupon) {
        discount = appliedCoupon.discount_type === 'percentage' 
          ? (subtotal * appliedCoupon.discount_value) / 100 
          : Math.min(appliedCoupon.discount_value, subtotal);
      }
      const totalAmount = Math.max(0, subtotal - discount);

      // Generate Clean Order Identifier
      const randDigits = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `KCS-${new Date().getFullYear()}-${randDigits}`;

      const orderPayload = {
        order_number: orderNumber,
        customer_name: checkoutForm.customer_name.value.trim(),
        customer_email: checkoutForm.customer_email.value.trim(),
        customer_phone: checkoutForm.customer_phone.value.trim(),
        company_name: checkoutForm.company_name ? checkoutForm.company_name.value.trim() : '',
        subtotal: subtotal,
        discount_amount: discount,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        total_amount: totalAmount,
        currency: 'PKR',
        order_status: 'pending',
        payment_status: 'unpaid',
        notes: checkoutForm.notes ? checkoutForm.notes.value.trim() : ''
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing Order...';

      try {
        const result = await db.submitOrder(orderPayload, items);
        if (result && result.success) {
          // Clear cart
          cart.clear();

          // Show Success Modal
          if (successModal) {
            const numEl = successModal.querySelector('[data-order-num]');
            const totalSummaryEl = successModal.querySelector('[data-order-total]');
            const waLink = successModal.querySelector('[data-whatsapp-order-link]');

            if (numEl) numEl.textContent = orderNumber;
            if (totalSummaryEl) totalSummaryEl.textContent = formatPKR(totalAmount);
            if (waLink) {
              const waMsg = encodeURIComponent(`Hi Khan Creative Studio! I just submitted order #${orderNumber} for ${formatPKR(totalAmount)}. My name is ${orderPayload.customer_name}.`);
              waLink.href = `https://wa.me/923151342465?text=${waMsg}`;
            }

            successModal.classList.add('active');
          } else {
            showToast(`Order #${orderNumber} confirmed! We will contact you shortly.`, 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
          }
        }
      } catch (err) {
        console.error('Order submission error:', err);
        showToast('Failed to place order. Please try again or reach out directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // Initial render
  renderCart();
});
