/**
 * Khan Creative Studio — Reviews Page Controller (reviews.js)
 */

import { db } from './supabase.js';
import { escapeHTML, showToast } from './utils.js';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { setupSEO } from './seo.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initFooter();

  setupSEO({
    title: 'Client Reviews & Testimonials | Khan Creative Studio',
    description: 'Read authentic reviews from clients who trusted Khan Creative Studio for their digital platforms, branding, and creative campaigns.',
    canonicalUrl: 'https://khancreativestudio.com/reviews.html'
  });

  const grid = document.getElementById('reviews-full-grid');
  const modal = document.getElementById('submit-review-modal');
  const openModalBtn = document.getElementById('open-review-modal-btn');
  const closeModalBtn = document.getElementById('close-review-modal-btn');
  const reviewForm = document.getElementById('public-review-form');

  // Load Approved Reviews
  async function loadReviews() {
    if (!grid) return;
    try {
      const reviews = await db.getReviews();
      const approved = reviews.filter(r => r.is_approved);

      if (approved.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No reviews published yet. Be the first to share your experience!</p>';
        return;
      }

      grid.innerHTML = approved.map(r => `
        <div class="review-card animate-fade-up">
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
      console.error('Failed to load reviews:', err);
    }
  }

  // Modal handlers
  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => modal.classList.add('active'));
  }
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  // Handle Review Submission
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = reviewForm.client_name.value.trim();
      const role = reviewForm.client_role ? reviewForm.client_role.value.trim() : 'Business Owner';
      const rating = Number(reviewForm.rating.value || 5);
      const text = reviewForm.review_text.value.trim();

      if (!name || !text) {
        showToast('Please enter your name and review message.', 'error');
        return;
      }

      const submitBtn = reviewForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting for moderation...';

      try {
        await db.submitReview({
          client_name: name,
          client_role: role,
          rating,
          review_text: text
        });

        showToast('Thank you! Your review has been submitted for moderation and will appear once approved.', 'success');
        reviewForm.reset();
        if (modal) modal.classList.remove('active');
      } catch (err) {
        console.error('Review submission error:', err);
        showToast('Unable to submit review right now. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
      }
    });
  }

  loadReviews();
});
