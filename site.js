/* Entry Debugger landing page runtime for static hosting. */
(function () {
  'use strict';

  var root = document.documentElement;
  var heroEl = document.querySelector('.hero');
  var labs = document.getElementById('labs');

  if (heroEl) {
    heroEl.dataset.mood = heroEl.dataset.mood || 'mood';
  }
  root.style.setProperty('--accent', '#FF9DBE');
  root.style.setProperty('--accent-deep', '#C75A82');
  root.style.setProperty('--accent-soft', '#FFEFF5');
  if (labs) {
    labs.style.display = '';
  }
  document.querySelectorAll('[data-205-character]').forEach(function (el) {
    el.style.display = '';
  });
  document.querySelectorAll('[data-tone-playful]').forEach(function (el) {
    el.style.display = '';
  });
  document.querySelectorAll('[data-tone-serious]').forEach(function (el) {
    el.style.display = 'none';
  });

  var moodStyle = document.createElement('style');
  moodStyle.textContent = [
    '.hero[data-mood="ink"] {',
    '  background:',
    '    radial-gradient(70% 60% at 80% 25%, rgba(255,157,190,0.30) 0%, transparent 60%),',
    '    radial-gradient(60% 50% at 10% 80%, rgba(93,211,200,0.18) 0%, transparent 60%),',
    '    linear-gradient(180deg, #1F2025 0%, #14161B 100%);',
    '}',
    '.hero[data-mood="paper"] {',
    '  background:',
    '    radial-gradient(70% 60% at 80% 25%, rgba(255,157,190,0.18) 0%, transparent 55%),',
    '    radial-gradient(60% 50% at 10% 80%, rgba(93,211,200,0.14) 0%, transparent 55%),',
    '    linear-gradient(180deg, #FAF6F4 0%, #F2EDE8 100%);',
    '  color: var(--entry-ink);',
    '}',
    '.hero[data-mood="paper"] h1 { color: var(--entry-ink); }',
    '.hero[data-mood="paper"] h1 .accent { color: var(--c205-mint-deep); }',
    '.hero[data-mood="paper"] h1 .pink { color: var(--c205-pink-press); }',
    '.hero[data-mood="paper"] .hero-lede { color: var(--fg-2); }',
    '.hero[data-mood="paper"] .hero-meta { color: var(--fg-3); }',
    '.hero[data-mood="paper"] .hero-pill { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.08); color: var(--fg-1); }',
    '.hero[data-mood="paper"] .hero-pill .ver { color: var(--fg-3); border-color: rgba(0,0,0,0.12); }',
    '.hero[data-mood="paper"] .btn-ghost { background: #fff; border-color: var(--border-1); }'
  ].join('\n');
  document.head.appendChild(moodStyle);

  setupScrollAnimations();
  setupHeroParallax();
  setupFaq();
  setupMockToggles();

  function setupScrollAnimations() {
    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') return;

    var groups = [
      ['.eyebrow', null, 0],
      ['.section-title', null, 0],
      ['.section-sub', null, 0],
      ['.problem', null, 60],
      ['.features-grid > .feature', null, 80],
      ['.compare > .col', 'from-side', 120],
      ['.labs-header > *', null, 80],
      ['.labs-grid > .lab-card', null, 70],
      ['.boost-inner > *', 'from-side', 160],
      ['.popup-grid > *', 'from-side', 160],
      ['.safety-grid > .safety-card', null, 50],
      ['.faq-list > .faq-item', null, 60],
      ['.credits-grid > .credit-card', null, 80],
      ['.console-grid > *', 'from-side', 120],
      ['#debug-demo-root .demo-frame', 'scale', 0],
      ['.hero-real', null, 0],
      ['.foot-inner > *', null, 80]
    ];

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    groups.forEach(function (group) {
      var selector = group[0];
      var variant = group[1];
      var stagger = group[2];
      Array.prototype.forEach.call(document.querySelectorAll(selector), function (el, index) {
        if (el.closest('.hero')) return;
        el.classList.add('sa');
        if (variant === 'from-side') {
          el.classList.add(index % 2 === 0 ? 'sa-from-left' : 'sa-from-right');
        } else if (variant === 'scale') {
          el.classList.add('sa-scale');
        } else if (variant === 'blur') {
          el.classList.add('sa-blur');
        }
        if (stagger) {
          el.style.setProperty('--sa-delay', (index * stagger) + 'ms');
        }
        observer.observe(el);
      });
    });
  }

  function setupHeroParallax() {
    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var heroReal = document.querySelector('.hero-real');
    if (!heroReal) return;

    var ticking = false;
    var update = function () {
      var rect = heroReal.getBoundingClientRect();
      var progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      var clamped = Math.max(-1, Math.min(1, progress));
      var ty = clamped * -18;
      var rot = -0.4 + clamped * 0.6;
      heroReal.style.transform = 'translateY(' + ty + 'px) rotate(' + rot + 'deg)';
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function setupFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var question = item.querySelector('.faq-q');
      if (!question) return;
      question.addEventListener('click', function () {
        var wasOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
          openItem.classList.remove('is-open');
        });
        if (!wasOpen) {
          item.classList.add('is-open');
        }
      });
    });

    var firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
      firstFaq.classList.add('is-open');
    }
  }

  function setupMockToggles() {
    document.querySelectorAll('.popup .ptoggle, .boost-mock .toggle-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var sw = row.querySelector('.sw');
        if (sw) {
          sw.classList.toggle('off');
        }
      });
    });
  }
})();
