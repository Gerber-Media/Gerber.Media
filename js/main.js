// Gerber.Media — Main Script

(function () {
  'use strict';

  // --- Dark Mode Toggle ---
  var themeToggle = document.querySelector('.theme-toggle');

  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    if (themeToggle) {
      themeToggle.textContent = '\u25CF';
      themeToggle.setAttribute('aria-label', mode === 'dark' ? 'Light Mode umschalten' : 'Dark Mode umschalten');
    }
    localStorage.setItem('theme', mode);
  }

  // Init: check saved preference, default to dark
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // --- Hero Equalizer Animation ---
  var waveCanvas = document.getElementById('hero-waves');
  if (waveCanvas) {
    var ctx = waveCanvas.getContext('2d');
    var heroSection = waveCanvas.parentElement;
    var animId = null;
    var time = 0;
    var barCount = 0;
    var barWidth = 6;
    var barGap = 2;

    // Color palette — vivid and saturated
    var colors = [
      { r: 255, g: 20, b: 60 },    // hot red
      { r: 255, g: 50, b: 120 },   // magenta
      { r: 160, g: 40, b: 255 },   // electric purple
      { r: 60, g: 120, b: 255 },   // vivid blue
      { r: 0, g: 200, b: 255 },    // cyan
      { r: 255, g: 140, b: 0 },    // orange
      { r: 255, g: 60, b: 180 }    // pink
    ];

    function resizeWaveCanvas() {
      waveCanvas.width = heroSection.offsetWidth;
      waveCanvas.height = heroSection.offsetHeight;
      barCount = Math.ceil(waveCanvas.width / (barWidth + barGap));
    }

    function lerpColor(a, b, t) {
      return {
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t)
      };
    }

    function getBarColor(barIndex, t) {
      // Slow color cycle across bars + time
      var phase = (barIndex / barCount * 2 + t * 0.15) % colors.length;
      var idx = Math.floor(phase);
      var frac = phase - idx;
      var c1 = colors[idx % colors.length];
      var c2 = colors[(idx + 1) % colors.length];
      return lerpColor(c1, c2, frac);
    }

    function drawEqualizer() {
      var w = waveCanvas.width;
      var h = waveCanvas.height;
      ctx.clearRect(0, 0, w, h);

      var centerY = h * 0.55;
      var maxBarHeight = h * 0.35;
      var slowTime = time * 0.008;

      for (var i = 0; i < barCount; i++) {
        var x = i * (barWidth + barGap);

        // Multiple sine waves for organic equalizer movement
        var barHeight =
          Math.sin(i * 0.08 + slowTime * 1.2) * 0.35 +
          Math.sin(i * 0.15 + slowTime * 0.7) * 0.25 +
          Math.sin(i * 0.03 + slowTime * 1.8) * 0.2 +
          Math.sin(i * 0.22 + slowTime * 0.4) * 0.15;

        // Normalize to 0..1
        barHeight = (barHeight + 0.95) / 1.9;
        var barH = barHeight * maxBarHeight;

        var col = getBarColor(i, slowTime);
        var opacity = 0.25 + barHeight * 0.35;

        // Bar going down from center
        var grad = ctx.createLinearGradient(x, centerY, x, centerY + barH);
        grad.addColorStop(0, 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + opacity + ')');
        grad.addColorStop(1, 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (opacity * 0.3) + ')');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, centerY, barWidth, barH, 2);
        ctx.fill();

        // Mirrored bar going up
        var gradUp = ctx.createLinearGradient(x, centerY, x, centerY - barH * 0.7);
        gradUp.addColorStop(0, 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (opacity * 0.8) + ')');
        gradUp.addColorStop(1, 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (opacity * 0.15) + ')');
        ctx.fillStyle = gradUp;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barH * 0.7, barWidth, barH * 0.7, 2);
        ctx.fill();
      }

      time++;
      animId = requestAnimationFrame(drawEqualizer);
    }

    resizeWaveCanvas();
    window.addEventListener('resize', resizeWaveCanvas);

    // Only animate when hero is visible
    if ('IntersectionObserver' in window) {
      var waveObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (!animId) drawEqualizer();
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      }, { threshold: 0 });
      waveObserver.observe(heroSection);
    } else {
      drawEqualizer();
    }
  }

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

    // Speichere Sprachauswahl wenn Benutzer auf einen Sprach-Link klickt
    var langLinks = document.querySelectorAll('.lang-menu a');
    langLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var hreflang = this.getAttribute('hreflang');
        if (hreflang) {
          localStorage.setItem('preferredLanguage', hreflang);
        }
      });
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

  // --- Ambient Drone (Web Audio API) ---
  var ambientStarted = false;
  var ambientCtx = null;
  var ambientGain = null;

  function startAmbient() {
    if (ambientStarted) return;
    ambientStarted = true;

    ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
    ambientGain = ambientCtx.createGain();
    ambientGain.gain.setValueAtTime(0, ambientCtx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.05, ambientCtx.currentTime + 3);
    ambientGain.connect(ambientCtx.destination);

    var t = ambientCtx.currentTime;

    // --- Deep sub bass pulse (podcast intro feel) ---
    var sub = ambientCtx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(45, t);
    var subGain = ambientCtx.createGain();
    subGain.gain.setValueAtTime(0.4, t);
    var subLfo = ambientCtx.createOscillator();
    subLfo.frequency.setValueAtTime(0.08, t);
    var subLfoGain = ambientCtx.createGain();
    subLfoGain.gain.setValueAtTime(0.15, t);
    subLfo.connect(subLfoGain);
    subLfoGain.connect(subGain.gain);
    subLfo.start();
    sub.connect(subGain);
    subGain.connect(ambientGain);
    sub.start();

    // --- Synth pad layers (techy, slightly detuned saw → filtered) ---
    var padNotes = [130.81, 196, 261.63, 392]; // C3, G3, C4, G4
    var padDetunes = [-6, 4, -3, 8];

    padNotes.forEach(function (freq, idx) {
      var osc = ambientCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.detune.setValueAtTime(padDetunes[idx], t);

      // Resonant lowpass → warm digital pad
      var filter = ambientCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400 + idx * 80, t);
      filter.Q.setValueAtTime(2, t);

      // Slow filter sweep
      var filterLfo = ambientCtx.createOscillator();
      filterLfo.frequency.setValueAtTime(0.06 + idx * 0.02, t);
      var filterLfoGain = ambientCtx.createGain();
      filterLfoGain.gain.setValueAtTime(120 + idx * 40, t);
      filterLfo.connect(filterLfoGain);
      filterLfoGain.connect(filter.frequency);
      filterLfo.start();

      var layerGain = ambientCtx.createGain();
      layerGain.gain.setValueAtTime(0.06, t);

      osc.connect(filter);
      filter.connect(layerGain);
      layerGain.connect(ambientGain);
      osc.start();
    });

    // --- Digital texture (filtered noise with bandpass = radio/mic hiss) ---
    var bufferSize = ambientCtx.sampleRate * 2;
    var noiseBuffer = ambientCtx.createBuffer(1, bufferSize, ambientCtx.sampleRate);
    var data = noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    var noise = ambientCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Bandpass for podcast mic/studio vibe
    var noiseBand = ambientCtx.createBiquadFilter();
    noiseBand.type = 'bandpass';
    noiseBand.frequency.setValueAtTime(2500, t);
    noiseBand.Q.setValueAtTime(0.8, t);

    var noiseGain = ambientCtx.createGain();
    noiseGain.gain.setValueAtTime(0.02, t);

    noise.connect(noiseBand);
    noiseBand.connect(noiseGain);
    noiseGain.connect(ambientGain);
    noise.start();

    // --- Subtle rhythmic pulse (tech click, very quiet) ---
    function schedulePulse() {
      if (!ambientCtx || ambientCtx.state === 'closed') return;
      var now = ambientCtx.currentTime;
      var click = ambientCtx.createOscillator();
      click.type = 'sine';
      click.frequency.setValueAtTime(800, now);
      click.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      var clickGain = ambientCtx.createGain();
      clickGain.gain.setValueAtTime(0.06, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      click.connect(clickGain);
      clickGain.connect(ambientGain);
      click.start(now);
      click.stop(now + 0.15);
      setTimeout(schedulePulse, 2400 + Math.random() * 1600);
    }
    setTimeout(schedulePulse, 3000);
  }

  // Sound toggle button
  var soundToggle = document.querySelector('.sound-toggle');
  var soundMuted = false;

  // Start on first interaction (browser autoplay policy)
  var interactionEvents = ['click', 'touchstart', 'keydown'];
  function onFirstInteraction(e) {
    // Don't start if mute button was the first click
    if (soundToggle && soundToggle.contains(e.target)) return;
    startAmbient();
    interactionEvents.forEach(function (evt) {
      document.removeEventListener(evt, onFirstInteraction);
    });
  }
  interactionEvents.forEach(function (evt) {
    document.addEventListener(evt, onFirstInteraction);
  });

  if (soundToggle) {
    soundToggle.addEventListener('click', function () {
      if (!ambientStarted) {
        startAmbient();
        interactionEvents.forEach(function (evt) {
          document.removeEventListener(evt, onFirstInteraction);
        });
        soundMuted = false;
        soundToggle.classList.remove('muted');
        return;
      }
      soundMuted = !soundMuted;
      if (ambientGain) {
        ambientGain.gain.linearRampToValueAtTime(
          soundMuted ? 0 : 0.04,
          ambientCtx.currentTime + 0.5
        );
      }
      soundToggle.classList.toggle('muted', soundMuted);
    });
  }

})();
