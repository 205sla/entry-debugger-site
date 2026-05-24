/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakColor */

const { useEffect: useEffectApp, useState: useStateApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroMood": "mood",
  "accent": "pink",
  "showLabs": true,
  "showCharacter": true,
  "tone": "playful"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const root = document.documentElement;
  // Hero background
  const heroEl = document.querySelector(".hero");
  if (heroEl) {
    heroEl.dataset.mood = t.heroMood;
  }
  // Accent color override
  const accentMap = {
    mint:  { primary: "#5DD3C8", deep: "#2E8F87", soft: "#E5F7F4", glow: "#5DD3C8" },
    pink:  { primary: "#FF9DBE", deep: "#C75A82", soft: "#FFEFF5", glow: "#FF9DBE" },
    purple:{ primary: "#6E5AE6", deep: "#4F3DBA", soft: "#F1EEFF", glow: "#6E5AE6" }
  };
  const a = accentMap[t.accent] || accentMap.mint;
  root.style.setProperty("--accent",        a.primary);
  root.style.setProperty("--accent-deep",   a.deep);
  root.style.setProperty("--accent-soft",   a.soft);

  // Labs section
  const labs = document.getElementById("labs");
  if (labs) labs.style.display = t.showLabs ? "" : "none";

  // Character signature
  document.querySelectorAll("[data-205-character]").forEach(el => {
    el.style.display = t.showCharacter ? "" : "none";
  });

  // Tone affects hero pill copy
  document.querySelectorAll("[data-tone-playful]").forEach(el => {
    el.style.display = t.tone === "playful" ? "" : "none";
  });
  document.querySelectorAll("[data-tone-serious]").forEach(el => {
    el.style.display = t.tone === "serious" ? "" : "none";
  });
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffectApp(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="시각 무드" />
      <TweakRadio
        label="히어로 배경"
        value={t.heroMood}
        options={["mood", "ink", "paper"]}
        onChange={(v) => setTweak("heroMood", v)}
      />
      <TweakColor
        label="강조 색"
        value={t.accent}
        options={["mint", "pink", "purple"]}
        onChange={(v) => setTweak("accent", v)}
        renderSwatch={null}
      />
      <TweakSection label="섹션" />
      <TweakToggle
        label="실험실 섹션"
        value={t.showLabs}
        onChange={(v) => setTweak("showLabs", v)}
      />
      <TweakToggle
        label="205 작성자 카드"
        value={t.showCharacter}
        onChange={(v) => setTweak("showCharacter", v)}
      />
      <TweakSection label="카피 톤" />
      <TweakRadio
        label="문체"
        value={t.tone}
        options={["playful", "serious"]}
        onChange={(v) => setTweak("tone", v)}
      />
    </TweaksPanel>
  );
}

const tweaksRoot = document.getElementById("tweaks-root");
if (tweaksRoot) {
  ReactDOM.createRoot(tweaksRoot).render(<TweaksApp />);
}

// Apply initial tweak side effects (e.g. accent CSS vars) on first paint
applyTweaks(TWEAK_DEFAULTS);

// -----------------------------
// Hero mood swap (CSS via data-attr)
// -----------------------------
const moodStyle = document.createElement("style");
moodStyle.textContent = `
  .hero[data-mood="ink"] {
    background:
      radial-gradient(70% 60% at 80% 25%, rgba(255,157,190,0.30) 0%, transparent 60%),
      radial-gradient(60% 50% at 10% 80%, rgba(93,211,200,0.18) 0%, transparent 60%),
      linear-gradient(180deg, #1F2025 0%, #14161B 100%);
  }
  .hero[data-mood="paper"] {
    background:
      radial-gradient(70% 60% at 80% 25%, rgba(255,157,190,0.18) 0%, transparent 55%),
      radial-gradient(60% 50% at 10% 80%, rgba(93,211,200,0.14) 0%, transparent 55%),
      linear-gradient(180deg, #FAF6F4 0%, #F2EDE8 100%);
    color: var(--entry-ink);
  }
  .hero[data-mood="paper"] h1 { color: var(--entry-ink); }
  .hero[data-mood="paper"] h1 .accent { color: var(--c205-mint-deep); }
  .hero[data-mood="paper"] h1 .pink { color: var(--c205-pink-press); }
  .hero[data-mood="paper"] .hero-lede { color: var(--fg-2); }
  .hero[data-mood="paper"] .hero-meta { color: var(--fg-3); }
  .hero[data-mood="paper"] .hero-pill { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.08); color: var(--fg-1); }
  .hero[data-mood="paper"] .hero-pill .ver { color: var(--fg-3); border-color: rgba(0,0,0,0.12); }
  .hero[data-mood="paper"] .btn-ghost { background: #fff; border-color: var(--border-1); }
`;
document.head.appendChild(moodStyle);

// -----------------------------
// Scroll animations (IntersectionObserver)
// -----------------------------
(function setupScrollAnimations() {
  const prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Targets: pick semantically meaningful elements across the page.
  // [selector, optional motion variant, optional stagger-per-sibling]
  const groups = [
    [".eyebrow",                            null,           0],
    [".section-title",                      null,           0],
    [".section-sub",                        null,           0],
    [".problem",                            null,           60],
    [".features-grid > .feature",           null,           80],
    [".compare > .col",                     "from-side",    120],
    [".labs-header > *",                    null,           80],
    [".labs-grid > .lab-card",              null,           70],
    [".boost-inner > *",                    "from-side",    160],
    [".popup-grid > *",                     "from-side",    160],
    [".safety-grid > .safety-card",         null,           50],
    [".faq-list > .faq-item",               null,           60],
    [".credits-grid > .credit-card",        null,           80],
    [".console-grid > *",                   "from-side",    120],
    ["#debug-demo-root .demo-frame",        "scale",        0],
    [".hero-real",                          null,           0],
    [".foot-inner > *",                     null,           80],
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px"
  });

  groups.forEach(([sel, variant, stagger]) => {
    const els = Array.from(document.querySelectorAll(sel));
    els.forEach((el, i) => {
      // Skip if it's already inside an in-viewport hero band — those have
      // their own keyframe entrance.
      if (el.closest(".hero")) return;

      el.classList.add("sa");
      if (variant === "from-side") {
        // Alternate left/right for visual rhythm
        el.classList.add(i % 2 === 0 ? "sa-from-left" : "sa-from-right");
      } else if (variant === "scale") {
        el.classList.add("sa-scale");
      } else if (variant === "blur") {
        el.classList.add("sa-blur");
      }
      if (stagger) {
        el.style.setProperty("--sa-delay", (i * stagger) + "ms");
      }
      observer.observe(el);
    });
  });
})();

// -----------------------------
// Subtle parallax on hero screenshot
// -----------------------------
(function setupHeroParallax() {
  const prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
  const heroReal = document.querySelector(".hero-real");
  if (!heroReal) return;

  let ticking = false;
  const update = () => {
    const rect = heroReal.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when card center is at viewport center, +/- otherwise
    const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
    const clamped = Math.max(-1, Math.min(1, progress));
    const ty = clamped * -18; // px
    const rot = -0.4 + clamped * 0.6; // deg
    heroReal.style.transform = `translateY(${ty}px) rotate(${rot}deg)`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
})();

// -----------------------------
// FAQ accordion
// -----------------------------
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  if (!q) return;
  q.addEventListener("click", () => {
    const wasOpen = item.classList.contains("is-open");
    document.querySelectorAll(".faq-item.is-open").forEach(o => o.classList.remove("is-open"));
    if (!wasOpen) item.classList.add("is-open");
  });
});
// open first one by default
const firstFaq = document.querySelector(".faq-item");
if (firstFaq) firstFaq.classList.add("is-open");

// -----------------------------
// Popup toggle interactivity
// -----------------------------
document.querySelectorAll(".popup .ptoggle").forEach((row) => {
  row.addEventListener("click", () => {
    const sw = row.querySelector(".sw");
    if (sw) sw.classList.toggle("off");
  });
});

// -----------------------------
// Boost mock toggle
// -----------------------------
document.querySelectorAll(".boost-mock .toggle-row").forEach((row) => {
  row.addEventListener("click", () => {
    const sw = row.querySelector(".sw");
    if (sw) sw.classList.toggle("off");
  });
});
