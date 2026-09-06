document.addEventListener('DOMContentLoaded', function () {

  // Preloader
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    if (preloader) setTimeout(function () { preloader.classList.add('hide'); }, 250);
  });

  // Scroll progress bar
  var progress = document.getElementById('scrollProgress');
  function updateProgress() {
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = scrolled + '%';
  }
  window.addEventListener('scroll', updateProgress);
  updateProgress();

  // Navbar scroll state
  var nav = document.getElementById('mainNav2');
  function handleNavScroll() {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  if (nav) { handleNavScroll(); window.addEventListener('scroll', handleNavScroll); }

  // Mobile nav collapse on link click
  var navLinks = document.querySelectorAll('.main-nav .nav-link');
  var navCollapseEl = document.getElementById('navContent2');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navCollapseEl && navCollapseEl.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(navCollapseEl).hide();
      }
    });
  });

  // Custom cursor
  var cursorDot = document.getElementById('cursorDot');
  var cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var rx = 0, ry = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) {
      cursorDot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
      tx = e.clientX; ty = e.clientY;
    });
    (function animateRing() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      cursorRing.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(animateRing);
    })();
    document.querySelectorAll('a, button, .showcase-item, .bento-tile, .marquee-track .m-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorRing.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { cursorRing.classList.remove('is-active'); });
    });
  } else {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Counter animation
  var counters = document.querySelectorAll('.counter');
  var counted = false;
  function animateCounters() {
    counters.forEach(function (counter) {
      var target = +counter.getAttribute('data-target');
      var current = 0;
      var increment = target / 60;
      (function update() {
        current += increment;
        if (current < target) { counter.textContent = Math.ceil(current); requestAnimationFrame(update); }
        else counter.textContent = target;
      })();
    });
  }
  var statsSection = document.querySelector('.stats-strip2');
  if (statsSection && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) { animateCounters(); counted = true; }
      });
    }, { threshold: 0.4 });
    so.observe(statsSection);
  }

  // Tilt card (About section)
  var tiltCard = document.querySelector('.tilt-card');
  if (tiltCard && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    tiltCard.addEventListener('mousemove', function (e) {
      var r = tiltCard.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      tiltCard.style.transform = 'rotateY(' + (px * 8) + 'deg) rotateX(' + (-py * 8) + 'deg)';
    });
    tiltCard.addEventListener('mouseleave', function () {
      tiltCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  // Category showcase (tabs)
  var showcaseItems = document.querySelectorAll('.showcase-item');
  var showcaseSlides = document.querySelectorAll('.showcase-slide');
  var showcaseTimer = null;
  function activateShowcase(key) {
    showcaseItems.forEach(function (it) { it.classList.toggle('active', it.dataset.key === key); });
    showcaseSlides.forEach(function (sl) { sl.classList.toggle('active', sl.dataset.key === key); });
  }
  function nextShowcase() {
    var activeIdx = 0;
    showcaseItems.forEach(function (it, i) { if (it.classList.contains('active')) activeIdx = i; });
    var next = (activeIdx + 1) % showcaseItems.length;
    activateShowcase(showcaseItems[next].dataset.key);
  }
  function restartAutoplay() {
    if (showcaseTimer) clearInterval(showcaseTimer);
    showcaseTimer = setInterval(nextShowcase, 4200);
  }
  if (showcaseItems.length) {
    showcaseItems.forEach(function (item) {
      item.addEventListener('click', function () {
        activateShowcase(item.dataset.key);
        restartAutoplay();
      });
    });
    restartAutoplay();
  }

  // Timeline progress line
  var timelineEl = document.querySelector('.timeline2');
  var timelineFill = document.querySelector('.timeline2-line-fill');
  function updateTimeline() {
    if (!timelineEl || !timelineFill) return;
    var r = timelineEl.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = r.height;
    var visible = Math.min(Math.max(vh * 0.75 - r.top, 0), total);
    var pct = total > 0 ? (visible / total) * 100 : 0;
    timelineFill.style.height = pct + '%';
  }
  window.addEventListener('scroll', updateTimeline);
  window.addEventListener('resize', updateTimeline);
  updateTimeline();

  // Back to top
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('show', window.scrollY > 500);
    });
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Contact form demo submit
  var contactForm = document.getElementById('contactForm2');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) { e.stopPropagation(); contactForm.classList.add('was-validated'); return; }
      var btn = contactForm.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending...';
      setTimeout(function () {
        btn.innerHTML = 'Message Sent <i class="bi bi-check2"></i>';
        contactForm.reset();
        contactForm.classList.remove('was-validated');
        setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 2200);
      }, 900);
    });
  }
});
