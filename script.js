/**
 * SKAY Industries - Modern uPVC Doors & Windows
 * Interactive Architectural Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ==========================================
  // 1. SIDEBAR DRAWER TOGGLE (DESKTOP & MOBILE)
  // ==========================================
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarDrawer = document.getElementById('sidebar-drawer');

  function openSidebar() {
    sidebarOverlay?.classList.add('active');
    sidebarDrawer?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebarOverlay?.classList.remove('active');
    sidebarDrawer?.classList.remove('active');
    document.body.style.overflow = '';
  }

  sidebarToggleBtn?.addEventListener('click', openSidebar);
  mobileMenuBtn?.addEventListener('click', openSidebar);
  sidebarCloseBtn?.addEventListener('click', closeSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);

  // Close sidebar when any link inside it is clicked
  sidebarDrawer?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });


  // ==========================================
  // 2. STICKY NAVBAR SCROLL EFFECT
  // ==========================================
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('shadow-md');
    } else {
      header?.classList.remove('shadow-md');
    }
  });

  // ==========================================
  // 3. ACTIVE NAV LINK HIGHLIGHTING
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('header nav a');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('text-accent');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-accent');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // ==========================================
  // 4. INLINE ENQUIRY FORM SUBMISSION
  // ==========================================
  const enquiryForm = document.getElementById('inline-enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('enquiry-name')?.value;
      const phone = document.getElementById('enquiry-phone')?.value;
      const project = document.getElementById('enquiry-interest')?.value || 'General Inquiry';

      // Provide immediate feedback
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <span class="inline-flex items-center space-x-2">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Sending...</span>
        </span>
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = `
          <span class="inline-flex items-center space-x-2 text-emerald-100">
            <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span>Enquiry Received!</span>
          </span>
        `;
        submitBtn.classList.remove('bg-accent');
        submitBtn.classList.add('bg-emerald-600');

        // Optional WhatsApp prefill trigger or alert
        setTimeout(() => {
          alert(`Thank you ${name}! Your enquiry for "${project}" has been sent. Our team will contact you at ${phone} within 2 business hours.`);
          enquiryForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.add('bg-accent');
          submitBtn.classList.remove('bg-emerald-600');
          if (window.lucide) window.lucide.createIcons();
        }, 1500);

      }, 1000);
    });
  }

  // ==========================================
  // 5. HERO HEADER SLIDER CAROUSEL
  // ==========================================
  const sliderWrap = document.getElementById('hero-slider-wrap');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot-btn');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');

  if (sliderWrap && slides.length > 0) {
    let currentSlide = 0;
    let slideInterval = null;
    const slideDuration = 4500; // 4.5s autoplay interval
    const slideData = [
      {
        badge: 'INNOVATIVE SOLUTIONS FOR INSPIRED LIVING',
        title: 'A Brighter Tomorrow <br><span class="text-accent">Starts Here</span>',
        desc: 'Leading manufacturer of high-quality uPVC doors and windows, delivering modern, durable, and energy-efficient solutions for homes and commercial spaces across Mysuru.'
      },
      {
        badge: '3-PANEL SLIDING WINDOWS',
        title: 'Seamless Horizons, <br><span class="text-accent">Effortless Living</span>',
        desc: 'Authentic brochure precision multi-track soundproof sliding systems crafted for smooth glide performance and expansive views.'
      },
      {
        badge: 'PANORAMIC PICTURE WINDOWS',
        title: 'Frame Your World <br><span class="text-accent">In Pure Luxury</span>',
        desc: 'Expansive floor-to-ceiling glass architecture delivering 40 dB noise cut, multi-point security, and thermal insulation.'
      },
      {
        badge: 'SLIDE & FOLD PATIO DOORS',
        title: 'Where Indoors Meet <br><span class="text-accent">The Outdoors</span>',
        desc: 'Contemporary villa bi-fold patio systems opening up your living room directly into open terraces and fresh garden breeze.'
      }
    ];

    const badgeText = document.getElementById('hero-badge-text');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const slideCounter = document.getElementById('hero-slide-counter');

    function goToSlide(index) {
      if (index < 0) {
        currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      // Update slides visibility with cross-fade
      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.remove('opacity-0', 'z-0', 'pointer-events-none');
          slide.classList.add('opacity-100', 'z-10', 'active');
        } else {
          slide.classList.remove('opacity-100', 'z-10', 'active');
          slide.classList.add('opacity-0', 'z-0', 'pointer-events-none');
        }
      });

      // Update slide counter
      if (slideCounter) {
        slideCounter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      }

      // Update slide text with subtle smooth transition
      if (badgeText && heroTitle && heroDesc && slideData[currentSlide]) {
        heroTitle.classList.add('opacity-0', 'translate-y-2');
        heroDesc.classList.add('opacity-0', 'translate-y-2');

        setTimeout(() => {
          badgeText.textContent = slideData[currentSlide].badge;
          heroTitle.innerHTML = slideData[currentSlide].title;
          heroDesc.textContent = slideData[currentSlide].desc;
          heroTitle.classList.remove('opacity-0', 'translate-y-2');
          heroDesc.classList.remove('opacity-0', 'translate-y-2');
        }, 250);
      }

      // Update pagination dots (active slide pill)
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.remove('bg-white/40', 'w-2');
          dot.classList.add('bg-accent', 'w-6');
        } else {
          dot.classList.remove('bg-accent', 'w-6');
          dot.classList.add('bg-white/40', 'w-2');
        }
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoPlay() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    // Previous / Next button listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoPlay();
      });
    }

    // Indicator dots click listeners
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const target = parseInt(dot.getAttribute('data-target'), 10);
        if (!isNaN(target)) {
          goToSlide(target);
          startAutoPlay();
        }
      });
    });

    // Pause on hover
    sliderWrap.addEventListener('mouseenter', stopAutoPlay);
    sliderWrap.addEventListener('mouseleave', startAutoPlay);

    // Mobile touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    sliderWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    sliderWrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
      startAutoPlay();
    }, { passive: true });

    // Initial activation
    goToSlide(0);
    startAutoPlay();
  }

  // Refresh icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});