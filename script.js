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
  // 4. WORKSHOP 17-PHOTO GALLERY CAROUSEL
  // =========================================================================
  const workshopTrack = document.getElementById('workshop-gallery-track');
  const workshopPrevBtn = document.getElementById('workshop-prev-btn');
  const workshopNextBtn = document.getElementById('workshop-next-btn');
  const workshopDotsContainer = document.getElementById('workshop-dots');
  const workshopSlides = document.querySelectorAll('.gallery-slide');

  let currentWorkshopIndex = 0;
  let workshopAutoTimer = null;

  if (workshopSlides.length > 0 && workshopTrack) {
    // Generate dots dynamically based on number of slides
    const itemsPerView = window.innerWidth > 992 ? 3 : (window.innerWidth > 600 ? 2 : 1);
    const totalPages = Math.ceil(workshopSlides.length / itemsPerView);

    if (workshopDotsContainer) {
      workshopDotsContainer.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `workshop-dot ${i === 0 ? 'active' : ''}`;
        btn.setAttribute('aria-label', `Page ${i + 1}`);
        btn.dataset.index = i;
        btn.addEventListener('click', () => {
          goToWorkshopPage(i);
        });
        workshopDotsContainer.appendChild(btn);
      }
    }

    function updateWorkshopCarousel() {
      const slide = workshopSlides[0];
      if (!slide) return;
      const slideWidth = slide.offsetWidth + 24; // item width + gap
      const maxShift = workshopTrack.scrollWidth - (workshopTrack.parentElement ? workshopTrack.parentElement.clientWidth : 0);
      const targetShift = Math.min(currentWorkshopIndex * slideWidth, Math.max(0, maxShift));
      workshopTrack.style.transform = `translateX(-${targetShift}px)`;

      // Update dots
      const dots = workshopDotsContainer?.querySelectorAll('.workshop-dot');
      if (dots && dots.length > 0) {
        const curPage = Math.min(Math.floor(currentWorkshopIndex / (window.innerWidth > 992 ? 3 : (window.innerWidth > 600 ? 2 : 1))), dots.length - 1);
        dots.forEach((d, i) => d.classList.toggle('active', i === curPage));
      }
    }

    function goToWorkshopPage(pageIndex) {
      const perView = window.innerWidth > 992 ? 3 : (window.innerWidth > 600 ? 2 : 1);
      currentWorkshopIndex = Math.min(pageIndex * perView, workshopSlides.length - 1);
      updateWorkshopCarousel();
    }

    workshopPrevBtn?.addEventListener('click', () => {
      currentWorkshopIndex = Math.max(0, currentWorkshopIndex - 1);
      updateWorkshopCarousel();
    });

    workshopNextBtn?.addEventListener('click', () => {
      const perView = window.innerWidth > 992 ? 3 : (window.innerWidth > 600 ? 2 : 1);
      const maxIndex = workshopSlides.length - perView;
      currentWorkshopIndex = currentWorkshopIndex >= maxIndex ? 0 : currentWorkshopIndex + 1;
      updateWorkshopCarousel();
    });

    // Auto rotate every 5 seconds
    workshopAutoTimer = setInterval(() => {
      const perView = window.innerWidth > 992 ? 3 : (window.innerWidth > 600 ? 2 : 1);
      const maxIndex = workshopSlides.length - perView;
      currentWorkshopIndex = currentWorkshopIndex >= maxIndex ? 0 : currentWorkshopIndex + 1;
      updateWorkshopCarousel();
    }, 5000);

    window.addEventListener('resize', () => {
      updateWorkshopCarousel();
    });
  }

  // =========================================================================
  // 5. ACTIVE NAV HIGHLIGHTING ON SCROLL
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.exact-nav-link');

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
  // 9. MESSAGE US / ENQUIRY FORM SUBMISSION (Routes to info@skayind.com)
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
        submitBtn.textContent = 'SENDING TO OUTLOOK...';
      }

      const payload = {
        "First Name": firstName,
        "Last Name": lastName,
        "Full Name": `${firstName} ${lastName}`,
        "Email": email,
        "Phone": phone || "Not provided",
        "Message": message || "No message provided",
        "_subject": `New Website Enquiry from ${firstName} ${lastName} - SKAY Industries`,
        "_template": "table",
        "_captcha": "false"
      };

      fetch("https://formsubmit.co/ajax/info@skayind.com", {
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
          formStatus.textContent = `Thank you, ${firstName}! Your enquiry has been sent to our Outlook inbox (info@skayind.com). We will contact you shortly.`;
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

        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status-msg';
          formStatus.style.backgroundColor = '#fee2e2';
          formStatus.style.color = '#991b1b';
          formStatus.style.border = '1px solid #fecaca';
          formStatus.textContent = 'Unable to send message right now. Please call us directly at +91 98803 09808 or email info@skayind.com.';
        }
      });
    });
  }
});