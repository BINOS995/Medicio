/**
* Template Name: Medicio
* Template URL: https://bootstrapmade.com/medicio-free-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Toggle nested dropdowns (News, WNTD, etc.)
   */
  document.querySelectorAll('.navmenu .dropdown .bi-chevron-right').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top') || document.querySelector('.back-to-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Auto generate the carousel indicators
   */
  document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
    carouselIndicator.closest('.carousel').querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
      if (index === 0) {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}" class="active"></li>`;
      } else {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}"></li>`;
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Hero Title Motion Effects for Mobile
   */
  function initHeroTitleMotion() {
    const heroTitles = document.querySelectorAll('.hero h2');
    let isMobile = window.innerWidth <= 768;
    
    function updateTitleMotion() {
      heroTitles.forEach((title, index) => {
        // Add motion class for mobile devices
        if (isMobile) {
          title.classList.add('hero-title-mobile');
          
          // Create typing effect
          const originalText = title.textContent;
          title.textContent = '';
          let charIndex = 0;
          
          function typeText() {
            if (charIndex < originalText.length) {
              title.textContent += originalText.charAt(charIndex);
              charIndex++;
              setTimeout(typeText, 100);
            }
          }
          
          // Start typing effect with delay based on carousel item
          setTimeout(() => {
            typeText();
          }, index * 500);
          
          // Add fade-in animation
          title.style.opacity = '0';
          title.style.transform = 'translateY(20px)';
          title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          
          setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
          }, 200);
          
        } else {
          title.classList.remove('hero-title-mobile');
          title.style.opacity = '';
          title.style.transform = '';
          title.style.transition = '';
        }
      });
    }
    
    // Initial setup
    updateTitleMotion();
    
    // Listen for window resize
    window.addEventListener('resize', () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        updateTitleMotion();
      }
    });
    
    // Listen for carousel slide changes
    const carousel = document.querySelector('#hero-carousel');
    if (carousel) {
      carousel.addEventListener('slid.bs.carousel', () => {
        // Re-apply motion effects when carousel slides
        setTimeout(updateTitleMotion, 100);
      });
    }
  }
  
  // Initialize hero title motion effects
  window.addEventListener('load', initHeroTitleMotion);

  /**
   * Site Name Animation
   */
  function initSiteNameAnimation() {
    const siteName = document.querySelector('.sitename');
    if (!siteName) return;

    let isMobile = window.innerWidth <= 768;
    const originalText = siteName.textContent;
    
    function applySiteNameAnimation() {
      if (isMobile) {
        // Add animation class for mobile
        siteName.classList.add('sitename-animated');
        
        // Create typing effect for mobile
        siteName.textContent = '';
        siteName.style.opacity = '0';
        siteName.style.transform = 'translateX(-20px)';
        siteName.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        let charIndex = 0;
        function typeSiteName() {
          if (charIndex < originalText.length) {
            siteName.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeSiteName, 80);
          }
        }
        
        // Start animation after short delay
        setTimeout(() => {
          siteName.style.opacity = '1';
          siteName.style.transform = 'translateX(0)';
          typeSiteName();
        }, 500);
        
      } else {
        // Reset for desktop
        siteName.classList.remove('sitename-animated');
        siteName.textContent = originalText;
        siteName.style.opacity = '';
        siteName.style.transform = '';
        siteName.style.transition = '';
      }
    }
    
    // Initial application
    applySiteNameAnimation();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        applySiteNameAnimation();
      }
    });
    
    // Add scroll-triggered animation for mobile
    if (isMobile) {
      let hasAnimated = false;
      window.addEventListener('scroll', () => {
        if (!hasAnimated && window.scrollY > 50) {
          hasAnimated = true;
          applySiteNameAnimation();
        }
      });
    }
  }
  
  // Initialize site name animation
  window.addEventListener('load', initSiteNameAnimation);

  /**
   * Partners Section Functionality
   */
  
  // Partners filtering system
  function initPartnersFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const partnerItems = document.querySelectorAll('.partner-item');
    
    if (filterBtns.length === 0 || partnerItems.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter partners
        partnerItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            item.classList.remove('hide');
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 100);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
              item.classList.add('hide');
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // Animated counters for statistics
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observerOptions = {
      threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-count'));
          let current = 0;
          const increment = Math.ceil(target / 50);
          
          counter.classList.add('animate');
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
              clearInterval(timer);
            } else {
              counter.textContent = current;
            }
          }, 30);
          
          observer.unobserve(counter);
        }
      });
    }, observerOptions);

    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  // Enhanced partner card interactions
  function initPartnerCards() {
    const partnerCards = document.querySelectorAll('.partner-card');
    
    partnerCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Initialize partners functionality
  function initPartners() {
    initPartnersFilter();
    initCounters();
    initPartnerCards();
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initPartners);
  window.addEventListener('load', initPartners);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

})();