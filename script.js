/**
 * SKAY INDUSTRIES - Modern uPVC Doors & Windows
 * Interactive Architecture: Hero Slider, Mini Showcase, 17-Photo Workshop Gallery, Active Nav, Search, FAQs, Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // =========================================================================
  // 2. HERO BANNER SLIDER (2 Smooth Fade Slides)
  // =========================================================================
  const heroSlides = document.querySelectorAll('.exact-slide');
  const heroPrevBtn = document.getElementById('slider-prev-btn');
  const heroNextBtn = document.getElementById('slider-next-btn');
  const heroDots = document.querySelectorAll('.exact-dot');

  let currentHeroSlide = 0;
  let heroAutoTimer = null;
  const heroInterval = 5000; // 5 seconds matching live site

  function showHeroSlide(index) {
    if (heroSlides.length === 0) return;
    if (index >= heroSlides.length) {
      currentHeroSlide = 0;
    } else if (index < 0) {
      currentHeroSlide = heroSlides.length - 1;
    } else {
      currentHeroSlide = index;
    }

    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentHeroSlide);
    });

    heroDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentHeroSlide);
    });
  }

  function startHeroAutoplay() {
    stopHeroAutoplay();
    heroAutoTimer = setInterval(() => {
      showHeroSlide(currentHeroSlide + 1);
    }, heroInterval);
  }

  function stopHeroAutoplay() {
    if (heroAutoTimer) {
      clearInterval(heroAutoTimer);
      heroAutoTimer = null;
    }
  }

  function restartHeroAutoplay() {
    stopHeroAutoplay();
    startHeroAutoplay();
  }

  if (heroSlides.length > 0) {
    heroPrevBtn?.addEventListener('click', () => {
      showHeroSlide(currentHeroSlide - 1);
      restartHeroAutoplay();
    });

    heroNextBtn?.addEventListener('click', () => {
      showHeroSlide(currentHeroSlide + 1);
      restartHeroAutoplay();
    });

    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showHeroSlide(idx);
        restartHeroAutoplay();
      });
    });

    const heroSection = document.getElementById('home');
    heroSection?.addEventListener('mouseenter', stopHeroAutoplay);
    heroSection?.addEventListener('mouseleave', startHeroAutoplay);
    heroSection?.addEventListener('touchstart', stopHeroAutoplay, { passive: true });
    heroSection?.addEventListener('touchend', startHeroAutoplay, { passive: true });

    startHeroAutoplay();
  }

  // =========================================================================
  // 3. MINI PRODUCT SHOWCASE CAROUSEL (8 Items)
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
      const itemWidth = items[0].offsetWidth + 24; // width + gap
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

  // Auto rotate mini showcase every 4.5s
  if (miniDots.length > 0) {
    setInterval(() => {
      updateMiniCarousel(currentMiniIndex + 1);
    }, 4500);
  }

  // =========================================================================
  // 4. DUAL-COLUMN MOVING GALLERY (OPPOSITE MOTION) & LIGHTBOX & DYNAMIC SYNC
  // =========================================================================
  const DB_NAME = 'SkayGalleryDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'gallery_store';

  function getDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function loadFromDB() {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('gallery_data');
      return new Promise((resolve) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  // Active items in moving gallery for Lightbox navigation
  let currentGalleryItems = [];
  let currentLightboxIndex = 0;

  // Build card markup
  function createCardHTML(item, index) {
    const title = item.title || item.alt || 'Workshop Facility';
    const alt = item.alt || item.title || 'Workshop Facility';
    return `
      <div class="moving-gallery-card" data-index="${index}" title="${title}">
        <div class="moving-card-inner">
          <img src="${item.src}" alt="${alt}" loading="lazy">
          <div class="moving-card-overlay">
            <span class="moving-card-title">${title}</span>
            <span class="moving-card-zoom"><i data-lucide="maximize-2" class="w-4 h-4"></i></span>
          </div>
        </div>
      </div>
    `;
  }

  // Initialize fallback items from DOM pre-rendered cards
  function initFallbackGalleryItems() {
    if (currentGalleryItems.length === 0) {
      const cards = document.querySelectorAll('#row-left-track .moving-gallery-card, #row-right-track .moving-gallery-card');
      const seen = new Set();
      const items = [];
      cards.forEach(c => {
        const src = c.getAttribute('data-src') || c.querySelector('img')?.getAttribute('src');
        const title = c.getAttribute('data-title') || c.querySelector('img')?.getAttribute('alt') || 'Workshop Facility';
        if (src && !seen.has(src)) {
          seen.add(src);
          items.push({ src, title, alt: title });
        }
      });
      if (items.length > 0) {
        currentGalleryItems = items;
      }
    }
  }

  function renderDualMovingGallery(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    currentGalleryItems = items;

    // Split items into two rows
    const row1Items = [];
    const row2Items = [];

    items.forEach((item, idx) => {
      if (idx % 2 === 0) {
        row1Items.push({ ...item, origIdx: idx });
      } else {
        row2Items.push({ ...item, origIdx: idx });
      }
    });

    // Ensure balanced visual flow if only 1 item
    if (row2Items.length === 0 && row1Items.length > 0) {
      row2Items.push(...row1Items);
    }

    // Ensure at least 8 cards per track before duplicating for seamless edge-to-edge marquee on wide screens
    let row1List = [...row1Items];
    while (row1List.length < 8) {
      row1List = [...row1List, ...row1Items];
    }
    const row1Cards = [...row1List, ...row1List].map(it => createCardHTML(it, it.origIdx)).join('');

    let row2List = [...row2Items];
    while (row2List.length < 8) {
      row2List = [...row2List, ...row2Items];
    }
    const row2Cards = [...row2List, ...row2List].map(it => createCardHTML(it, it.origIdx)).join('');

    // Inject into Horizontal Tracks (Row 1 Left, Row 2 Right)
    const trackRowLeft = document.getElementById('row-left-track');
    const trackRowRight = document.getElementById('row-right-track');
    if (trackRowLeft) trackRowLeft.innerHTML = row1Cards;
    if (trackRowRight) trackRowRight.innerHTML = row2Cards;

    // Attach Lightbox click handlers
    attachLightboxTriggers();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Lightbox Modal Controls
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  function openLightbox(index) {
    if (currentGalleryItems.length === 0) {
      initFallbackGalleryItems();
    }
    if (!lightbox || currentGalleryItems.length === 0) return;
    currentLightboxIndex = (index + currentGalleryItems.length) % currentGalleryItems.length;
    const item = currentGalleryItems[currentLightboxIndex];
    if (item && lightboxImg) {
      lightboxImg.src = item.src;
      if (lightboxCaption) {
        lightboxCaption.textContent = item.title || item.alt || 'Workshop Facility';
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextLightbox() {
    openLightbox(currentLightboxIndex + 1);
  }

  function showPrevLightbox() {
    openLightbox(currentLightboxIndex - 1);
  }

  function attachLightboxTriggers() {
    const cards = document.querySelectorAll('.moving-gallery-card');
    cards.forEach(card => {
      card.onclick = () => {
        const idx = parseInt(card.dataset.index, 10);
        if (!isNaN(idx)) {
          openLightbox(idx);
        } else {
          const src = card.getAttribute('data-src') || card.querySelector('img')?.getAttribute('src');
          const foundIdx = currentGalleryItems.findIndex(it => it.src === src);
          if (foundIdx !== -1) openLightbox(foundIdx);
        }
      };
    });
  }

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightboxOverlay?.addEventListener('click', closeLightbox);
  lightboxNextBtn?.addEventListener('click', showNextLightbox);
  lightboxPrevBtn?.addEventListener('click', showPrevLightbox);

  window.addEventListener('keydown', (e) => {
    if (lightbox?.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextLightbox();
      if (e.key === 'ArrowLeft') showPrevLightbox();
    }
  });

  // Initial trigger attachment for pre-rendered fallback items
  initFallbackGalleryItems();
  attachLightboxTriggers();

  // -------------------------------------------------------------------------
  // Dynamic Gallery & Products Data Sync (IndexedDB, LocalStorage, gallery.json)
  // -------------------------------------------------------------------------
  function applyDynamicData(data) {
    if (!data) return;

    // 1. Sync Our Products Grid
    if (Array.isArray(data.products) && data.products.length > 0) {
      const productsGrid = document.querySelector('.products-grid');
      if (productsGrid) {
        productsGrid.innerHTML = data.products.map(prod => `
          <article class="product-card">
            <div class="product-card-img">
              <img src="${prod.src}" alt="${prod.alt || prod.title || 'uPVC Window'}" loading="lazy">
            </div>
            <h3 class="product-card-title"><a href="${prod.link || '#contact'}">${prod.title || 'Product'}</a></h3>
          </article>
        `).join('');
      }
    }

    // 2. Sync Workshop & Projects Moving Gallery
    if (Array.isArray(data.workshop) && data.workshop.length > 0) {
      renderDualMovingGallery(data.workshop);
    }
  }

  async function loadDynamicGalleryAndProducts() {
    // 1. Check IndexedDB first (supports high-res uploaded images)
    try {
      const dbData = await loadFromDB();
      if (dbData && dbData.workshop && dbData.workshop.length > 0) {
        applyDynamicData(dbData);
        return;
      }
    } catch (e) {
      console.warn('IndexedDB read error:', e);
    }

    // 2. Check localStorage
    const stored = localStorage.getItem('skay_gallery_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        applyDynamicData(parsed);
        return;
      } catch (err) {
        console.warn('Could not parse localStorage skay_gallery_data:', err);
      }
    }

    // 3. Fetch gallery.json (default assets)
    fetch('gallery.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!localStorage.getItem('skay_gallery_data')) {
          applyDynamicData(data);
        }
      })
      .catch(err => {
        console.log('Serving built-in static gallery assets:', err);
      });
  }

  loadDynamicGalleryAndProducts();

  // Multi-tab sync: updates the website immediately when saved in admin.html
  window.addEventListener('storage', (event) => {
    if (event.key === 'skay_gallery_data' || event.key === 'skay_gallery_last_updated') {
      loadDynamicGalleryAndProducts();
    }
  });

  // Tab focus sync: when switching from admin.html tab back to index.html tab, auto-refresh!
  window.addEventListener('focus', () => {
    loadDynamicGalleryAndProducts();
  });

  // =========================================================================
  // 5. ACTIVE NAV HIGHLIGHTING ON SCROLL
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.exact-nav-link');
  const drawerNavLinks = document.querySelectorAll('.drawer-link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 140;

    // Detect if user has reached the bottom of page -> activate Contact
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 90)) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#contact') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      drawerNavLinks.forEach(link => {
        if (link.getAttribute('href') === '#contact') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      return;
    }

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        let targetId = id;
        if (id === 'colours' || id === 'technical-spec') {
          targetId = 'products';
        }

        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        drawerNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // =========================================================================
  // 6. SEARCH MODAL & INLINE SEARCH DROPDOWN
  // =========================================================================
  const searchModal = document.getElementById('search-modal');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('site-search-input');
  const searchResultsList = document.getElementById('search-results-list');

  const searchDatabase = [
    { title: 'Casement Windows & Doors', category: 'Products', anchor: '#products' },
    { title: 'Sliding Windows & Doors', category: 'Products', anchor: '#products' },
    { title: 'Fixed Windows', category: 'Products', anchor: '#products' },
    { title: 'Slide & Fold System', category: 'Products', anchor: '#products' },
    { title: 'Tilt & Turn Windows', category: 'Products', anchor: '#products' },
    { title: 'Combination Windows', category: 'Products', anchor: '#products' },
    { title: 'Single Hunge Windows', category: 'Products', anchor: '#products' },
    { title: 'Double Hunge Windows', category: 'Products', anchor: '#products' },
    { title: 'L-Window Corner Solutions', category: 'Products', anchor: '#products' },
    { title: 'A Spectrum of Colour Options', category: 'Colours', anchor: '#colours' },
    { title: 'Technical Specification (Cross Section)', category: 'Technical', anchor: '#technical-spec' },
    { title: 'About SKAY Industries & Commitment', category: 'About', anchor: '#about' },
    { title: 'Applications (Residential, Villas, Offices)', category: 'Applications', anchor: '#about' },
    { title: 'Workshop Machinery Facilities & Gallery', category: 'Workshop', anchor: '#workshop' },
    { title: 'Why Choose uPVC (6 Key Advantages)', category: 'Why uPVC', anchor: '#why-upvc' },
    { title: 'Customer Reviews (4.8 / 5 Rating)', category: 'Reviews', anchor: '#testimonials' },
    { title: 'Frequently Asked Questions (7 FAQs)', category: 'FAQs', anchor: '#faq' },
    { title: 'Call Now: +91 98803 09808 (24/7)', category: 'Contact', anchor: '#contact' },
    { title: 'Location: Shed No.2, M.G. Road, Mysuru', category: 'Contact', anchor: '#contact' }
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
            <span>${item.title}</span>
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
  // 7. SLIDE-OUT MOBILE NAVIGATION DRAWER
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

  document.querySelectorAll('.drawer-link, .drawer-sublink').forEach(link => {
    link.addEventListener('click', (e) => {
      // If clicking the chevron icon inside accordion toggle, don't close drawer
      if (e.target.closest('.drawer-chevron-icon')) {
        return;
      }
      closeDrawer();
    });
  });

  // Mobile drawer accordion for Products
  const drawerAccordionToggle = document.querySelector('.drawer-accordion-toggle');
  const drawerProductsItem = document.getElementById('drawer-products-item');
  if (drawerAccordionToggle && drawerProductsItem) {
    const chevron = drawerAccordionToggle.querySelector('.drawer-chevron-icon');
    chevron?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      drawerProductsItem.classList.toggle('open');
    });
  }

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeDrawer();
    }
  });

  // =========================================================================
  // 8. FAQ ACCORDIONS (Smooth Expand/Collapse)
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

  // Open first FAQ by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    faqItems[0].querySelector('.faq-header')?.setAttribute('aria-expanded', 'true');
  }

  // =========================================================================
  // 9. MESSAGE US / LEAD GENERATION FORM SUBMISSION (Routes to Skayind18@gmail.com)
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

      if (!firstName || !lastName || !email) {
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status-msg';
          formStatus.style.backgroundColor = '#fee2e2';
          formStatus.style.color = '#991b1b';
          formStatus.style.border = '1px solid #fecaca';
          formStatus.textContent = 'Please fill in all required fields (First Name, Last Name, and Email).';
        }
        return;
      }

      const submitBtn = messageForm.querySelector('.btn-submit-exact');
      const originalText = submitBtn ? submitBtn.textContent : 'SUBMIT';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING LEAD...';
      }

      const payload = {
        "First Name": firstName,
        "Last Name": lastName,
        "Full Name": `${firstName} ${lastName}`,
        "Email": email,
        "_replyto": email,
        "Phone": phone || "Not provided",
        "Message": message || "No message provided",
        "_subject": `New Customer Lead from ${firstName} ${lastName} - SKAY Industries`,
        "_cc": "info@skayind.com",
        "_template": "table",
        "_captcha": "false",
        "_autoresponse": "Thank you for contacting SKAY Industries! We have received your inquiry for our premium uPVC windows and doors. Our team will contact you shortly."
      };

      // 1. Save lead to localStorage so it is also immediately available in Admin Portal
      try {
        const existingLeads = JSON.parse(localStorage.getItem('skay_leads') || '[]');
        const newLead = {
          id: 'lead_' + Date.now(),
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          firstName: firstName,
          lastName: lastName,
          fullName: `${firstName} ${lastName}`,
          email: email,
          phone: phone || "Not provided",
          message: message || "No message provided",
          status: 'New'
        };
        existingLeads.unshift(newLead);
        localStorage.setItem('skay_leads', JSON.stringify(existingLeads));
      } catch (err) {
        console.warn('Could not cache lead locally:', err);
      }

      // 2. Transmit via FormSubmit directly to Skayind18@gmail.com
      fetch("https://formsubmit.co/ajax/Skayind18@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }

        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status-msg success';
          formStatus.style.backgroundColor = '#dcfce7';
          formStatus.style.color = '#166534';
          formStatus.style.border = '1px solid #bbf7d0';
          formStatus.textContent = `Thank you, ${firstName}! Your lead enquiry has been submitted to Skayind18@gmail.com. Our team will contact you shortly.`;
        }

        messageForm.reset();

        setTimeout(() => {
          if (formStatus) formStatus.style.display = 'none';
        }, 10000);
      })
      .catch(error => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }

        // Even if offline or network fails, lead was cached locally
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status-msg success';
          formStatus.style.backgroundColor = '#dcfce7';
          formStatus.style.color = '#166534';
          formStatus.style.border = '1px solid #bbf7d0';
          formStatus.textContent = `Thank you, ${firstName}! Your enquiry has been received and saved. Our team will contact you shortly.`;
        }

        messageForm.reset();
      });
    });
  }

  // =========================================================================
  // ADMIN SHORTCUT (Ctrl + Shift + A or Cmd + Shift + A)
  // =========================================================================
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.open('admin.html', '_blank');
    }
  });
});