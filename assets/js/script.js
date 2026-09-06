document.addEventListener('DOMContentLoaded', function () {

  // Preloader
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    if (preloader) {
      setTimeout(function () { preloader.classList.add('hide'); }, 250);
    }
  });

  // Navbar scroll state
  var nav = document.getElementById('mainNav');
  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll);

  // Mobile off-canvas nav menu
  var navLinks = document.querySelectorAll('.main-nav .nav-link');
  var navToggle = document.getElementById('navToggle');
  var navCollapseEl = document.getElementById('navContent');
  var navOverlay = document.getElementById('navOverlay');

  var navToggleIcon = navToggle ? navToggle.querySelector('i') : null;

  function openMobileNav() {
    navCollapseEl.classList.add('is-open');
    navOverlay.classList.add('is-open');
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    if (navToggleIcon) { navToggleIcon.className = 'bi bi-x-lg'; }
  }
  function closeMobileNav() {
    navCollapseEl.classList.remove('is-open');
    navOverlay.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (navToggleIcon) { navToggleIcon.className = 'bi bi-list'; }
  }
  if (navToggle && navCollapseEl && navOverlay) {
    navToggle.addEventListener('click', function () {
      if (navCollapseEl.classList.contains('is-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
    navOverlay.addEventListener('click', closeMobileNav);
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992) closeMobileNav();
    });
  }

  // Scrollspy active link highlight (simple)
  var sections = document.querySelectorAll('section[id]');
  function onScrollSpy() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      var id = sec.getAttribute('id');
      var link = document.querySelector('.main-nav .nav-link[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', onScrollSpy);
  onScrollSpy();

  // Counter animation for stats
  var counters = document.querySelectorAll('.counter');
  var counted = false;
  function animateCounters() {
    counters.forEach(function (counter) {
      var target = +counter.getAttribute('data-target');
      var current = 0;
      var increment = target / 60;
      function update() {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }
      update();
    });
  }
  var statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          animateCounters();
          counted = true;
        }
      });
    }, { threshold: 0.4 });
    observer.observe(statsSection);
  }

  // Subtle tilt-on-mousemove for the hero image card
  var heroCard = document.querySelector('.hero-card');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroCard && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    var heroVisual = document.querySelector('.hero-visual');
    heroVisual.addEventListener('mousemove', function (e) {
      var rect = heroCard.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = 'rotateY(' + (x * 8) + 'deg) rotateX(' + (y * -8) + 'deg) translateZ(0)';
    });
    heroVisual.addEventListener('mouseleave', function () {
      heroCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  // Gallery lightbox
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxSub = document.getElementById('lightboxSub');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var currentIndex = 0;

    function showSlide(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      var item = galleryItems[currentIndex];
      var img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.getAttribute('data-caption') || img.alt;
      lightboxSub.textContent = item.getAttribute('data-sub') || '';
    }
    function openLightbox(index) {
      showSlide(index);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () { openLightbox(index); });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function () { showSlide(currentIndex - 1); });
    lightboxNext.addEventListener('click', function () { showSlide(currentIndex + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) { closeLightbox(); }
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    });
  }

  // Back to top button
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Contact form (static demo submit)
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }
      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending...';
      setTimeout(function () {
        btn.innerHTML = 'Message Sent <i class="bi bi-check2"></i>';
        contactForm.reset();
        contactForm.classList.remove('was-validated');
        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 2200);
      }, 900);
    });
  }

  // Simple reveal-on-scroll for elements with data-aos attribute
  var aosEls = document.querySelectorAll('[data-aos]');
  if ('IntersectionObserver' in window) {
    var aosObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-in');
          aosObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    aosEls.forEach(function (el) { aosObserver.observe(el); });
  }
});
