// Real-time review updates with polling fallback
class ReviewManager {
  constructor() {
    this.pollInterval = 30000; // 30 seconds
    this.pollTimer = null;
    this.reviews = [];
    this.stats = { averageRating: 0, totalReviews: 0 };
    this.isInitialized = false;
  }

  // Initialize and start polling
  async init() {
    if (this.isInitialized) return;
    
    try {
      await this.loadReviews();
      this.startPolling();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize reviews:', error);
    }
  }

  // Load reviews from API
  async loadReviews() {
    try {
      const response = await window.API.reviews.getAll();
      this.reviews = response.data || [];
      this.stats = response.stats || { averageRating: 0, totalReviews: 0 };
      this.updateUI();
      return response;
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Show helpful error message in UI if container exists
      const container = document.getElementById('reviews-list');
      if (container) {
        const errorMessage = error.message || 'Failed to load reviews';
        if (errorMessage.includes('API_BASE_URL')) {
          container.innerHTML = '<div class="text-center text-muted py-4">API not configured. Please set API_BASE_URL in Vercel environment variables.</div>';
        } else if (errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch')) {
          container.innerHTML = '<div class="text-center text-muted py-4">Unable to connect to API. Check CORS settings and ensure backend is running.</div>';
        } else {
          container.innerHTML = `<div class="text-center text-muted py-4">Error loading reviews: ${errorMessage}</div>`;
        }
      }
      // Fallback: keep existing reviews
      return null;
    }
  }

  // Start polling for updates
  startPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }

    this.pollTimer = setInterval(() => {
      this.loadReviews();
    }, this.pollInterval);
  }

  // Stop polling
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  // Submit a new review
  async submitReview(reviewData) {
    try {
      const response = await window.API.reviews.create(reviewData);
      
      // Immediately update local state
      if (response.data) {
        this.reviews.unshift(response.data);
        this.stats = response.stats || this.stats;
        this.updateUI();
      }

      // Refresh from server to ensure sync
      setTimeout(() => this.loadReviews(), 1000);

      return response;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  // Update UI with current reviews and stats
  updateUI() {
    // Update average rating display
    const ratingElement = document.getElementById('average-rating-display');
    if (ratingElement) {
      ratingElement.textContent = this.stats.averageRating ? this.stats.averageRating.toFixed(1) : '0.0';
    }

    // Update star rating display
    const starDisplay = document.getElementById('star-rating-display');
    if (starDisplay && this.stats.averageRating) {
      const rating = Math.round(this.stats.averageRating);
      starDisplay.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        if (i <= rating) {
          star.innerHTML = '<i class="fas fa-star"></i>';
        } else {
          star.innerHTML = '<i class="far fa-star"></i>';
          star.classList.add('empty');
        }
        starDisplay.appendChild(star);
      }
    }

    // Update total reviews display
    const countElement = document.getElementById('review-count-display');
    if (countElement) {
      countElement.textContent = `(${this.stats.totalReviews || 0} Review${this.stats.totalReviews !== 1 ? 's' : ''})`;
    }

    // Update reviews list
    const reviewsContainer = document.getElementById('reviews-list');
    if (reviewsContainer) {
      this.renderReviews(reviewsContainer);
    }

    // Trigger custom event for other components
    window.dispatchEvent(new CustomEvent('reviewsUpdated', {
      detail: { reviews: this.reviews, stats: this.stats }
    }));
  }

  // Render reviews in container
  renderReviews(container) {
    if (!container) return;

    if (!this.reviews || this.reviews.length === 0) {
      container.innerHTML = '<div class="text-center text-muted py-4">No reviews yet. Be the first to review!</div>';
      return;
    }

    let html = '';
    this.reviews.slice(0, 10).forEach((review) => {
      const date = new Date(review.createdAt).toLocaleDateString();
      const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      
      html += `
        <div class="review-item">
          <div class="review-item-header">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: #DFB163; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px;">${initials}</div>
            <div class="review-item-info">
              <h5>${this.escapeHtml(review.name)}</h5>
              <i>${this.escapeHtml(review.email)} • ${date}</i>
            </div>
          </div>
          <div class="review-item-rating">
            ${this.renderStars(review.rating)}
          </div>
          <p class="review-item-comment">"${this.escapeHtml(review.comment)}"</p>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Render stars for display
  renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<i class="fas fa-star" style="color: #DFB163;"></i>';
      } else {
        stars += '<i class="far fa-star" style="color: #ddd;"></i>';
      }
    }
    return stars;
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Get current stats
  getStats() {
    return { ...this.stats };
  }

  // Get current reviews
  getReviews() {
    return [...this.reviews];
  }

  // Cleanup
  destroy() {
    this.stopPolling();
    this.reviews = [];
    this.stats = { averageRating: 0, totalReviews: 0 };
    this.isInitialized = false;
  }
}

// Initialize review manager on page load
const reviewManager = new ReviewManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.API) {
      reviewManager.init();
    } else {
      // Wait for API to load
      setTimeout(() => {
        if (window.API) reviewManager.init();
      }, 1000);
    }
  });
} else {
  if (window.API) {
    reviewManager.init();
  }
}

// Initialize star rating input
function initStarRating() {
  const starInput = document.getElementById('starRatingInput');
  const hiddenInput = document.getElementById('reviewRating');
  if (!starInput || !hiddenInput) return;

  let selectedRating = 0;

  const stars = Array.from(starInput.querySelectorAll('.star'));

  stars.forEach((star, index) => {
    // Click to select rating
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      hiddenInput.value = selectedRating;

      stars.forEach((s, i) => {
        if (i < selectedRating) {
          s.classList.add('active');
          s.innerHTML = '<i class="fas fa-star" style="color: #DFB163;"></i>'; // yellow
        } else {
          s.classList.remove('active');
          s.innerHTML = '<i class="far fa-star" style="color: #ddd;"></i>'; // gray
        }
      });
    });

    // Hover effect
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => {
        if (i <= index) {
          s.innerHTML = '<i class="fas fa-star" style="color: #DFB163;"></i>';
        } else {
          s.innerHTML = '<i class="far fa-star" style="color: #ddd;"></i>';
        }
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => {
        if (i < selectedRating) {
          s.innerHTML = '<i class="fas fa-star" style="color: #DFB163;"></i>';
        } else {
          s.innerHTML = '<i class="far fa-star" style="color: #ddd;"></i>';
        }
      });
    });
  });
}

// Initialize review form submission
function initReviewForm() {
  const form = document.getElementById('reviewForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const email = document.getElementById('reviewEmail').value.trim();
    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value.trim();
    const messageDiv = document.getElementById('reviewFormMessage');

    if (!rating || rating < 1 || rating > 5) {
      if (messageDiv) {
        messageDiv.innerHTML = '<span style="color: red;">Please select a rating.</span>';
      }
      return;
    }

    try {
      if (messageDiv) {
        messageDiv.innerHTML = '<span style="color: blue;">Submitting review...</span>';
      }

      const response = await reviewManager.submitReview({
        name,
        email,
        rating: parseInt(rating),
        comment
      });

      if (response.success) {
        if (messageDiv) {
          messageDiv.innerHTML = '<span style="color: green;">Review submitted successfully! Thank you.</span>';
        }
        form.reset();
        document.getElementById('starRatingInput').querySelectorAll('.star').forEach((s, i) => {
          s.classList.remove('active');
          s.innerHTML = '<i class="far fa-star"></i>';
        });
        
        // Clear message after 3 seconds
        setTimeout(() => {
          if (messageDiv) messageDiv.innerHTML = '';
        }, 3000);
      }
    } catch (error) {
      if (messageDiv) {
        messageDiv.innerHTML = `<span style="color: red;">Error: ${error.message || 'Failed to submit review. Please try again.'}</span>`;
      }
    }
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      initStarRating();
      initReviewForm();
    }, 500);
  });
} else {
  setTimeout(() => {
    initStarRating();
    initReviewForm();
  }, 500);
}

// Export for global access
window.ReviewManager = ReviewManager;
window.reviewManager = reviewManager;
