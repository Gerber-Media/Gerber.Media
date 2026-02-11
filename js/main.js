// Gerber.Media — Main Script

(function () {
  'use strict';

  // --- Navbar scroll effect ---
  var nav = document.querySelector('.nav');

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile menu toggle ---
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (toggle) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Language dropdown ---
  var langDropdown = document.querySelector('.lang-dropdown');
  var langButton = document.querySelector('.lang-switch');

  if (langDropdown && langButton) {
    langButton.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = langDropdown.classList.toggle('open');
      langButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function () {
      langDropdown.classList.remove('open');
      langButton.setAttribute('aria-expanded', 'false');
    });

    langDropdown.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && langDropdown.classList.contains('open')) {
        langDropdown.classList.remove('open');
        langButton.setAttribute('aria-expanded', 'false');
        langButton.focus();
      }
    });
  }

  // --- Legal modals ---
  document.querySelectorAll('[data-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var modalId = this.getAttribute('data-modal');
      var overlay = document.getElementById(modalId);
      if (overlay) {
        overlay.classList.add('active');
        document.body.classList.add('modal-open');
        var closeBtn = overlay.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
      }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    // Close on overlay click (not modal content)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });

    // Close button
    var closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
      });
    }
  });

  // Close modal on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    }
  });

  // --- Scroll animations (IntersectionObserver) ---
  var animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link highlight ---
  var sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.style.color = 'var(--text)';
        } else {
          link.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
})();
