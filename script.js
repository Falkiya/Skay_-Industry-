/**
 * SKAY INDUSTRIES - Modern uPVC Doors & Windows
 * Interactive Functionality: Product Carousel, Search Modal, Nav Drawer, FAQ Accordion, Message Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // =========================================================================
  // 2. HERO PRODUCT CAROUSEL
  // =========================================================================
  const carouselTrack = document.getElementById('carousel-track');
  const carouselSlides = carouselTrack ? Array.from(carouselTrack.children) : [];
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const dotsContainer = document.getElementById('carousel-dots-container');

  let currentIndex = 0;
  let autoPlayTimer = null;

  function getVisibleSlidesCount() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 640) return 2;
    return 1;
  }

  function getMaxIndex() {
    const visibleCount = getVisibleSlidesCount();
    return Math.max(0, carouselSlides.length - visibleCount);
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIndex = getMaxIndex();

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    if (!carouselTrack || carouselSlides.length === 0) return;
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const visibleCount = getVisibleSlidesCount();
    const slidePercent = 100 / visibleCount;
    carouselTrack.style.transform = `translateX(-${currentIndex * slidePercent}%)`;

    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    const maxIndex = getMaxIndex();
    if (index < 0) {
      currentIndex = maxIndex;
    } else if (index > maxIndex) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateCarousel();
  }

  if (prevBtn && nextBtn && carouselTrack) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      restartAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      restartAutoplay();
    });

    renderDots();
    updateCarousel();

    window.addEventListener('resize', () => {
      renderDots();
      updateCarousel();
    });

    // Autoplay
    function startAutoplay() {
      stopAutoplay();
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 3500);
    }

    function stopAutoplay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    carouselTrack.addEventListener('mouseenter', stopAutoplay);
    carouselTrack.addEventListener('mouseleave', startAutoplay);
    carouselTrack.addEventListener('touchstart', stopAutoplay, { passive: true });
    carouselTrack.addEventListener('touchend', startAutoplay, { passive: true });

    startAutoplay();
  }

  // =========================================================================
  // 3. SEARCH MODAL FUNCTIONALITY
  // =========================================================================
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchModal = document.getElementById('search-modal');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('site-search-input');
  const searchResultsList = document.getElementById('search-results-list');

  // Search items database
  const searchDatabase = [
    { title: 'Sliding Windows & Doors', category: 'Products', anchor: '#products' },
    { title: 'Casement Windows & Doors', category: 'Products', anchor: '#products' },
    { title: 'Tilt & Turn Windows', category: 'Products', anchor: '#products' },
    { title: 'Slide & Fold System', category: 'Products', anchor: '#products' },
    { title: 'Fixed Glass Windows', category: 'Products', anchor: '#products' },
    { title: 'Combination Windows', category: 'Products', anchor: '#products' },
    { title: 'Single Hunge Windows', category: 'Products', anchor: '#products' },
    { title: 'Double Hunge Windows', category: 'Products', anchor: '#products' },
    { title: 'L-Window Corner Units', category: 'Products', anchor: '#products' },
    { title: 'Milk White & Solid Colours', category: 'Colours', anchor: '#colours' },
    { title: 'Golden Oak & Walnut Woodgrains', category: 'Colours', anchor: '#colours' },
    { title: 'Dark Oak & Jet Black Finishes', category: 'Colours', anchor: '#colours' },
    { title: '60 Series Casement System', category: 'Profile Series', anchor: '#profiles' },
    { title: '62, 80, 90, 99, 112 Series Sliding System', category: 'Profile Series', anchor: '#profiles' },
    { title: 'Monorail Sliding System', category: 'Profile Series', anchor: '#profiles' },
    { title: 'About SKAY Industries & Commitment', category: 'About', anchor: '#about' },
    { title: 'Workshop Machinery & Fabrication', category: 'Workshop', anchor: '#workshop' },
    { title: 'Why Choose uPVC Benefits', category: 'Features', anchor: '#why-upvc' },
    { title: 'Customer Reviews & Ratings (4.8 / 5)', category: 'Reviews', anchor: '#reviews' },
    { title: 'Customization & Installation FAQs', category: 'FAQs', anchor: '#faq' },
    { title: 'Call 24/7 & Contact Info', category: 'Contact', anchor: '#contact' },
    { title: 'Send Message / Enquire Now', category: 'Contact', anchor: '#contact' }
  ];

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.add('active');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      searchInput?.focus();
      renderSearchResults('');
    }, 100);
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('active');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderSearchResults(query) {
    if (!searchResultsList) return;
    const q = query.trim().toLowerCase();
    searchResultsList.innerHTML = '';

    const filtered = q
      ? searchDatabase.filter(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      : searchDatabase.slice(0, 6);

    if (filtered.length === 0) {
      searchResultsList.innerHTML = `<p style="padding: 1rem; color: #64748b; font-size: 0.95rem; text-align: center;">No matches found for "${query}". Please call us at +91 98803 09808.</p>`;
      return;
    }

    filtered.forEach(item => {
      const a = document.createElement('a');
      a.className = 'search-result-item';
      a.href = item.anchor;
      a.innerHTML = `
        <span>${item.title}</span>
        <span style="font-size: 0.8rem; opacity: 0.7; text-transform: uppercase;">${item.category}</span>
      `;
      a.addEventListener('click', () => {
        closeSearch();
      });
      searchResultsList.appendChild(a);
    });
  }

  searchToggleBtn?.addEventListener('click', openSearch);
  searchCloseBtn?.addEventListener('click', closeSearch);
  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  searchInput?.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  // ESC key to close search or drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeDrawer();
    }
  });

  // =========================================================================
  // 4. NAVIGATION DRAWER
  // =========================================================================
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navDrawer = document.getElementById('nav-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');

  function openDrawer() {
    navDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggleBtn?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // =========================================================================
  // 5. FAQ ACCORDIONS
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-header')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      header.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });

  // =========================================================================
  // 6. MESSAGE US FORM HANDLING
  // =========================================================================
  const messageForm = document.getElementById('message-form');
  const formStatus = document.getElementById('form-status');

  if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('first-name')?.value.trim();
      const lastName = document.getElementById('last-name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!firstName || !lastName) {
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status-msg';
          formStatus.style.backgroundColor = '#fee2e2';
          formStatus.style.color = '#991b1b';
          formStatus.style.border = '1px solid #fecaca';
          formStatus.textContent = 'Please fill in both First Name and Last Name.';
        }
        return;
      }

      // Submit feedback
      const submitBtn = messageForm.querySelector('.btn-submit-exact');
      const originalText = submitBtn ? submitBtn.textContent : 'SUBMIT';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTING...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }

        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status-msg success';
          formStatus.textContent = `Thank you, ${firstName}! Your message has been received. Our team will contact you shortly at ${phone || email || '+91 98803 09808'}.`;
        }

        messageForm.reset();

        setTimeout(() => {
          if (formStatus) formStatus.style.display = 'none';
        }, 8000);
      }, 700);
    });
  }
});