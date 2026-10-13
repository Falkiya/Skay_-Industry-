/**
 * SKAY INDUSTRIES - Modern uPVC Doors & Windows
 * Interactive Architecture: Full-Header Slider, Active Navigation, Search Modal, Drawer, FAQs, Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // =========================================================================
  // 2. FULL-HEADER HERO SLIDER (Exact Smooth 2-Slide System)
  // =========================================================================
  const slides = document.querySelectorAll('.exact-slide, .hero-slide');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const dots = document.querySelectorAll('.exact-dot, .hero-slider-dot');

  let currentSlide = 0;
  let autoSlideTimer = null;
  const slideInterval = 4500; // 4.5 seconds

  function showSlide(index) {
    if (slides.length === 0) return;

    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoSlideTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideInterval);
  }

  function stopAutoplay() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (slides.length > 0) {
    prevBtn?.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      restartAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      restartAutoplay();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        restartAutoplay();
      });
    });

    const heroSection = document.getElementById('home');
    heroSection?.addEventListener('mouseenter', stopAutoplay);
    heroSection?.addEventListener('mouseleave', startAutoplay);
    heroSection?.addEventListener('touchstart', stopAutoplay, { passive: true });
    heroSection?.addEventListener('touchend', startAutoplay, { passive: true });

    startAutoplay();
  }

  // =========================================================================
  // 3. ACTIVE NAV HIGHLIGHTING ON SCROLL
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.exact-nav-link, .header-nav .nav-link-item');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);

  // =========================================================================
  // 4. SEARCH MODAL OVERLAY
  // =========================================================================
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchModal = document.getElementById('search-modal');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('site-search-input');
  const searchResultsList = document.getElementById('search-results-list');

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
    { title: 'Workshop Machinery & Facilities', category: 'Workshop', anchor: '#workshop' },
    { title: 'Why Choose uPVC Benefits', category: 'Why uPVC', anchor: '#why-upvc' },
    { title: 'Customer Reviews (4.8 / 5)', category: 'Reviews', anchor: '#reviews' },
    { title: 'Frequently Asked Questions (FAQs)', category: 'FAQs', anchor: '#faq' },
    { title: 'Location: Shed No.2, M.G. Road, Mysuru', category: 'Location', anchor: '#contact' },
    { title: 'Enquiry Form & Call 24/7', category: 'Enquiry', anchor: '#contact' }
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
      searchResultsList.innerHTML = `<p style="padding: 1rem; color: #64748b; font-size: 0.95rem; text-align: center;">No matches found for "${query}". Call us directly at +91 98803 09808.</p>`;
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
      a.addEventListener('click', closeSearch);
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

  // Header Inline Search Box Handler
  const exactSearchInput = document.getElementById('exact-search-input');
  const exactSearchBtn = document.getElementById('exact-search-btn');
  const exactSearchDropdown = document.getElementById('exact-search-dropdown');

  if (exactSearchInput && exactSearchDropdown) {
    exactSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        exactSearchDropdown.innerHTML = '';
        exactSearchDropdown.classList.remove('active');
        return;
      }
      const matches = searchDatabase.filter(item =>
        item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
      ).slice(0, 5);

      if (matches.length === 0) {
        exactSearchDropdown.innerHTML = `<div style="padding: 0.75rem; color: #64748b; font-size: 0.8rem; text-align: center;">No matches found.</div>`;
      } else {
        exactSearchDropdown.innerHTML = matches.map(item => `
          <a href="${item.anchor}" class="exact-search-dropdown-item">
            <span class="exact-search-dropdown-title">${item.title}</span>
            <span class="exact-search-dropdown-cat">${item.category}</span>
          </a>
        `).join('');
      }
      exactSearchDropdown.classList.add('active');
    });

    document.addEventListener('click', (e) => {
      if (!exactSearchInput.contains(e.target) && !exactSearchDropdown.contains(e.target)) {
        exactSearchDropdown.classList.remove('active');
      }
    });

    const triggerFullSearch = () => {
      const q = exactSearchInput.value.trim();
      if (q) {
        openSearch();
        if (searchInput) {
          searchInput.value = q;
          renderSearchResults(q);
        }
      }
    };

    exactSearchBtn?.addEventListener('click', triggerFullSearch);
    exactSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        triggerFullSearch();
      }
    });
  }

  // =========================================================================
  // 5. SLIDE-OUT NAVIGATION DRAWER
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

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeDrawer();
    }
  });

  // =========================================================================
  // 6. FAQ ACCORDIONS
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-header')?.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isActive);
      header.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });

  // =========================================================================
  // 7. MESSAGE US / ENQUIRY FORM HANDLING
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
          formStatus.textContent = `Thank you, ${firstName}! Your enquiry has been received. Our team will contact you shortly at ${phone || email || '+91 98803 09808'}.`;
        }

        messageForm.reset();

        setTimeout(() => {
          if (formStatus) formStatus.style.display = 'none';
        }, 8000);
      }, 700);
    });
  }

  // =========================================================================
  // 8. MINI PRODUCT SHOWCASE CAROUSEL (Between Hero & Products)
  // =========================================================================
  const miniTrack = document.getElementById('mini-showcase-track');
  const miniDots = document.querySelectorAll('.mini-dot');
  let currentMiniIndex = 0;

  function updateMiniCarousel(index) {
    if (!miniTrack || miniDots.length === 0) return;
    const totalDots = miniDots.length;
    currentMiniIndex = (index + totalDots) % totalDots;

    const items = miniTrack.querySelectorAll('.mini-showcase-item');
    if (items.length > 0) {
      const itemWidth = items[0].offsetWidth + 24;
      const maxShift = miniTrack.scrollWidth - (miniTrack.parentElement ? miniTrack.parentElement.clientWidth : 0);
      const targetShift = Math.min(currentMiniIndex * itemWidth, Math.max(0, maxShift));
      miniTrack.style.transform = `translateX(-${targetShift}px)`;
    }

    miniDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentMiniIndex);
    });
  }

  miniDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateMiniCarousel(idx);
    });
  });

  // Auto rotate every 4.5 seconds
  if (miniDots.length > 0) {
    setInterval(() => {
      updateMiniCarousel(currentMiniIndex + 1);
    }, 4500);
  }
});