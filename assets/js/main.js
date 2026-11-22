/* =========================================================
   Europe Villas & Apartments — core
   ========================================================= */
(function () {
  const LANGS = ["en", "es", "pt", "uk", "ru"];
  const LOCALE = { en: "en-GB", es: "es-ES", pt: "pt-PT", uk: "uk-UA", ru: "ru-RU" };
  const LANG_LABEL = { en: "EN", es: "ES", pt: "PT", uk: "UA", ru: "RU" };
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Language ---------- */
  function detectLang() {
    const saved = localStorage.getItem("ev-lang");
    if (LANGS.includes(saved)) return saved;
    const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    for (const l of list) {
      const c = String(l).slice(0, 2).toLowerCase();
      if (LANGS.includes(c)) return c;
      if (["ca", "gl", "eu"].includes(c)) return "es";
    }
    return "en";
  }
  let lang = detectLang();
  const hooks = [];

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) ?? I18N.en[key] ?? key;
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }
  /* ---------- Plurals (1 гость / 2 гостя / 5 гостей) ---------- */
  const PL = {
    en: { guests: { one: "guest", other: "guests" }, beds: { one: "bedroom", other: "bedrooms" }, baths: { one: "bathroom", other: "bathrooms" }, reviews: { one: "review", other: "reviews" } },
    es: { guests: { one: "huésped", other: "huéspedes" }, beds: { one: "dormitorio", other: "dormitorios" }, baths: { one: "baño", other: "baños" }, reviews: { one: "reseña", other: "reseñas" } },
    pt: { guests: { one: "hóspede", other: "hóspedes" }, beds: { one: "quarto", other: "quartos" }, baths: { one: "casa de banho", other: "casas de banho" }, reviews: { one: "avaliação", other: "avaliações" } },
    uk: { guests: { one: "гість", few: "гості", many: "гостей", other: "гостя" }, beds: { one: "спальня", few: "спальні", many: "спалень", other: "спальні" }, baths: { one: "ванна", few: "ванні", many: "ванних", other: "ванної" }, reviews: { one: "відгук", few: "відгуки", many: "відгуків", other: "відгуку" } },
    ru: { guests: { one: "гость", few: "гостя", many: "гостей", other: "гостя" }, beds: { one: "спальня", few: "спальни", many: "спален", other: "спальни" }, baths: { one: "ванная", few: "ванные", many: "ванных", other: "ванной" }, reviews: { one: "отзыв", few: "отзыва", many: "отзывов", other: "отзыва" } }
  };
  const plWord = (n, key) => { const f = PL[lang][key]; return f[new Intl.PluralRules(LOCALE[lang]).select(n)] || f.other; };
  const pl = (n, key) => n + " " + plWord(n, key);

  const fmtPrice = n => new Intl.NumberFormat(LOCALE[lang], { style: "currency", currency: "EUR", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(n);
  const fmtNum = n => new Intl.NumberFormat(LOCALE[lang]).format(n);
  const countryName = id => { const c = COUNTRIES.find(x => x.id === id); return c ? c.name[lang] : id; };

  function splitChars(el) {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    let i = 0;
    el.innerHTML = text.split(" ").map(w =>
      `<span class="word" aria-hidden="true">${[...w].map(ch => `<span class="char" style="--i:${i++}">${ch}</span>`).join("")}</span>`
    ).join(" ");
  }
  function splitWords(el) {
    el.innerHTML = el.textContent.split(" ").map(w => `<span class="w">${w}</span>`).join(" ");
  }

  function applyI18n(root = document) {
    document.documentElement.lang = lang;
    root.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.dataset.i18n);
      if (el.classList.contains("split")) splitChars(el);
      if (el.classList.contains("hl")) splitWords(el);
    });
    root.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
    const tk = document.body.dataset.title;
    if (tk) document.title = t(tk) + " | Europe Villas & Apartments";
  }

  function setLang(l) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l;
    localStorage.setItem("ev-lang", l);
    document.body.classList.add("lang-switching");
    setTimeout(() => {
      applyI18n();
      hooks.forEach(fn => fn(lang));
      updateLangPill();
      observeReveals();
      measure();
      document.body.classList.remove("lang-switching");
    }, 250);
  }

  /* ---------- WhatsApp (номер не показывается на сайте) ---------- */
  const _p = ["0313", "7966", "9083"];
  const waNumber = () => _p.join("").split("").reverse().join("");
  function openWhatsApp(message) {
    window.open("https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(message || t("wa.msg")), "_blank", "noopener");
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-wa]");
    if (!b) return;
    e.preventDefault();
    openWhatsApp(b.dataset.waMsg || t("wa.msg"));
  });

  /* ---------- Icons ---------- */
  const P = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    bed: '<path d="M3 19v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M6 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    bath: '<path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V5.5a2 2 0 0 1 4 0M7 20l-1 2M17 20l1 2"/>',
    area: '<path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6M15 4h5v5M9 20H4v-5"/>',
    pool: '<path d="M2 19c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8M8 12.5h8"/>',
    seaView: '<path d="M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="17" cy="5.5" r="2.2"/>',
    beachfront: '<path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 12v9M8 21h8"/>',
    view: '<path d="M2 20l6-9 4 5 3-4 7 8z"/><circle cx="17" cy="6" r="2"/>',
    chef: '<path d="M7 14a4 4 0 1 1 1.5-7.7 4 4 0 0 1 7 0A4 4 0 1 1 17 14v6H7zM7 17h10"/>',
    gym: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
    cinema: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4M10 9l4 2-4 2z"/>',
    spa: '<path d="M12 21c-4-2-7-5-7-9 3 0 5.5 1.5 7 4 1.5-2.5 4-4 7-4 0 4-3 7-7 9zM12 16c-1.5-3-1.5-7 0-12 1.5 5 1.5 9 0 12z"/>',
    sauna: '<path d="M4 20h16M6 20v-6a6 6 0 0 1 12 0v6M9 8c0-1.5 1.5-1.5 1.5-3.5M13.5 8c0-1.5 1.5-1.5 1.5-3.5"/>',
    fireplace: '<path d="M3 21h18M5 21V6h14v15M8 21v-5a4 4 0 0 1 8 0v5M12 19c-1.2 0-2-.8-2-2 0-1.5 2-2.5 2-4 0 1.5 2 2.5 2 4 0 1.2-.8 2-2 2z"/>',
    ski: '<path d="M3 20l18-6M14 4.5a1.5 1.5 0 1 1 0 .01M8 13l3-4 3 2 3-1M11 9l-1 6"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    ac: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M9 4l3 2 3-2M9 20l3-2 3 2"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    garden: '<path d="M12 22V12M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 15c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5z"/>',
    bbq: '<path d="M4 10h16a8 8 0 0 1-16 0zM8 17.5L6 22M16 17.5l2 4.5M9 7c0-1 1-1.5 1-3M13.5 7c0-1 1-1.5 1-3"/>',
    star: '<path fill="currentColor" stroke="none" d="M12 2l3 6.6 7 .7-5.3 4.7 1.6 7L12 17.3 5.7 21l1.6-7L2 9.3l7-.7z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    concierge: '<path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 9V7M10 7h4M3 21h18"/>',
    yacht: '<path d="M3 17l2 4h14l2-4zM12 3v14M12 3l7 11h-7M11 6l-5 8h5"/>',
    car: '<path d="M5 17v-5l2-5h10l2 5v5M3 17h18v3H3zM7.5 14h.01M16.5 14h.01M5 12h14"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    broom: '<path d="M15 3l-3 9M6 12h11l2 9H4zM9 16v5M13 16v5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4"/>',
    gem: '<path d="M6 3h12l3 6-9 12L3 9zM3 9h18M12 21L8 9l4-6 4 6z"/>',
    heart: '<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20z"/>',
    tag: '<path d="M3 12V3h9l9 9-9 9zM7.5 7.5h.01"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.2-4.6A8 8 0 1 1 21 12z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    quote: '<path fill="currentColor" stroke="none" d="M4 18v-5.5C4 8 6.5 5.2 10 4.5l.7 1.8C8.4 7.2 7.3 9 7.2 11H10v7zm10 0v-5.5c0-4.5 2.5-7.3 6-8l.7 1.8c-2.3.9-3.4 2.7-3.5 4.7H20v7z"/>'
  };
  const icon = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;
  const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.430 9.430 0 0 1-4.8-1.32l-.35-.2-3.57.93.95-3.48-.22-.36a9.42 9.42 0 0 1-1.45-5.02c0-5.2 4.24-9.44 9.46-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.33 11.33 0 0 0 5.37 1.37h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03z"/></svg>';

  /* ---------- Layout ---------- */
  const NAV = [["index.html", "nav.home", "home"], ["villas.html", "nav.villas", "villas"], ["destinations.html", "nav.destinations", "destinations"], ["about.html", "nav.about", "about"], ["contact.html", "nav.contact", "contact"]];

  function buildLayout() {
    const page = document.body.dataset.page;
    const links = NAV.map(([h, k, p]) => `<a href="${h}" class="${p === page || (page === "villa" && p === "villas") ? "active" : ""}"><span data-i18n="${k}"></span></a>`).join("");
    const langBtns = LANGS.map(l => `<button type="button" data-lang="${l}">${LANG_LABEL[l]}</button>`).join("");

    const header = document.getElementById("site-header");
    if (header) header.outerHTML = `
      <div class="scroll-progress"><span></span></div>
      <header class="site-header" id="header">
        <div class="container nav">
          <a href="index.html" class="brand" aria-label="Europe Villas & Apartments">
            <img src="assets/img/logo.jpg" alt="">
            <span class="brand-text"><b>Europe</b><small>Villas & Apartments</small></span>
          </a>
          <nav class="nav-links">${links}</nav>
          <div class="nav-actions">
            <div class="lang" role="group" aria-label="Language"><span class="lang-pill"></span>${langBtns}</div>
            <button class="btn btn-light btn-sm nav-book magnetic" data-wa><span data-i18n="nav.book"></span></button>
            <button class="burger" aria-label="Menu"><span></span><span></span></button>
          </div>
        </div>
      </header>
      <div class="mobile-menu" id="mobile-menu">
        <nav>${NAV.map(([h, k], i) => `<a href="${h}" style="--d:${i}"><small>0${i + 1}</small><span data-i18n="${k}"></span></a>`).join("")}</nav>
        <div class="mm-foot">
          <div class="lang lang-mobile"><span class="lang-pill"></span>${langBtns}</div>
          <button class="btn btn-wa" data-wa>${WA_SVG}<span data-i18n="footer.wa"></span></button>
        </div>
      </div>`;

    const footer = document.getElementById("site-footer");
    if (footer) footer.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top">
            <img src="assets/img/logo.jpg" alt="" class="footer-logo">
            <div class="footer-big" aria-hidden="true">Europe Villas <em>&amp;</em> Apartments</div>
          </div>
          <div class="footer-grid">
            <div class="footer-brand">
              <p data-i18n="footer.text"></p>
              <div class="footer-tag">DISCOVER · STAY · ENJOY</div>
            </div>
            <div><h4 data-i18n="footer.nav"></h4><ul>${NAV.map(([h, k]) => `<li><a href="${h}" data-i18n="${k}"></a></li>`).join("")}</ul></div>
            <div><h4 data-i18n="footer.dest"></h4><ul>${COUNTRIES.slice(0, 6).map(c => `<li><a href="villas.html?country=${c.id}" data-country="${c.id}"></a></li>`).join("")}</ul></div>
            <div><h4 data-i18n="footer.contact"></h4>
              <button class="btn btn-wa btn-sm" data-wa>${WA_SVG}<span data-i18n="footer.wa"></span></button>
              <p class="footer-meta">${icon("clock")}<span data-i18n="footer.hours"></span></p>
              <p class="footer-meta">${icon("globe")}<span data-i18n="footer.langs"></span></p>
            </div>
          </div>
          <div class="footer-bottom"><span>© ${new Date().getFullYear()} Europe Villas & Apartments. <span data-i18n="footer.rights"></span></span><span>Spain · Europe</span></div>
        </div>
      </footer>`;

    // mobile app-like tab bar
    const tab = (href, key, ic, p) => `<a href="${href}" class="${p === page || (page === "villa" && p === "villas") ? "active" : ""}">${icon(ic)}<span data-i18n="${key}"></span></a>`;
    document.body.insertAdjacentHTML("beforeend", `
      <nav class="m-tabbar" aria-label="Mobile navigation">
        ${tab("index.html", "nav.home", "home", "home")}
        ${tab("villas.html", "nav.villas", "pool", "villas")}
        <button class="m-tab-wa" data-wa aria-label="WhatsApp"><span class="wa-ring"></span>${WA_SVG}</button>
        ${tab("destinations.html", "nav.destShort", "globe", "destinations")}
        <button class="m-tab-menu" type="button">${icon("menu")}<span data-i18n="nav.menu"></span></button>
      </nav>`);
    document.body.insertAdjacentHTML("beforeend", `
      <button class="wa-float" data-wa aria-label="WhatsApp">
        <span class="wa-ring"></span><span class="wa-ring r2"></span>
        <span class="wa-icon">${WA_SVG}</span>
        <span class="wa-label" data-i18n="wa.float"></span>
      </button>
      ${finePointer && !reduceMotion ? '<div class="cursor-dot"></div><div class="cursor-ring"><span></span></div>' : ""}`);

    const fill = () => document.querySelectorAll("[data-country]").forEach(a => a.textContent = countryName(a.dataset.country));
    fill(); hooks.push(fill);
  }

  function updateLangPill() {
    document.querySelectorAll(".lang").forEach(box => {
      const btn = box.querySelector(`[data-lang="${lang}"]`);
      const pill = box.querySelector(".lang-pill");
      box.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
      if (btn && pill) { pill.style.width = btn.offsetWidth + "px"; pill.style.transform = `translateX(${btn.offsetLeft - 4}px)`; }
    });
  }

  function bindHeader() {
    const burger = document.querySelector(".burger");
    const menu = document.getElementById("mobile-menu");
    const closeMenu = () => { menu.classList.remove("open"); burger.classList.remove("open"); document.body.classList.remove("menu-open"); };
    document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => { setLang(b.dataset.lang); closeMenu(); }));
    burger.addEventListener("click", () => {
      const open = !menu.classList.contains("open");
      menu.classList.toggle("open", open); burger.classList.toggle("open", open); document.body.classList.toggle("menu-open", open);
      setTimeout(updateLangPill, 50);
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.querySelector(".m-tab-menu")?.addEventListener("click", () => burger.click());
    window.addEventListener("resize", () => { updateLangPill(); measure(); updateCarousels(); });
  }

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveals() {
    if (!io) io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal-clip").forEach(el => { if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + "ms"; });
    requestAnimationFrame(revealClips);
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .split-reveal, .line-reveal").forEach(el => {
      if (el.classList.contains("in")) return;
      if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + "ms";
      io.observe(el);
    });
    bindCounters(); bindTilt(); bindMagnetic();
  }

  // shrink big titles until the longest word fits the screen (any phone, any language)
  function fitTitles() {
    document.querySelectorAll(".hero-title, .ph-title").forEach(h => {
      h.style.fontSize = "";
      let fs = parseFloat(getComputedStyle(h).fontSize), guard = 0;
      const max = h.clientWidth + 1;
      const tooWide = () => [...h.querySelectorAll(".word")].some(w => w.getBoundingClientRect().width > max);
      while (tooWide() && guard++ < 40) { fs *= .96; h.style.fontSize = fs + "px"; }
    });
  }

  // clip-path hides the element from IntersectionObserver, so check by position
  function revealClips() {
    const vh = innerHeight;
    document.querySelectorAll(".reveal-clip:not(.in)").forEach(el => {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("in");
    });
  }

  function bindCounters() {
    document.querySelectorAll(".counter:not([data-bound])").forEach(el => {
      el.dataset.bound = 1;
      const ob = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; ob.disconnect();
        const to = +el.dataset.to, dur = 2400, start = performance.now();
        const step = now => {
          const p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 4);
          el.textContent = fmtNum(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, { threshold: .5 });
      ob.observe(el);
    });
  }

  function bindTilt() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll(".tilt:not([data-bound])").forEach(el => {
      el.dataset.bound = 1;
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  function bindMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll(".magnetic:not([data-mbound])").forEach(el => {
      el.dataset.mbound = 1;
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      el.addEventListener("pointerleave", () => el.style.transform = "");
    });
  }

  /* ---------- Cursor with label ---------- */
  function bindCursor() {
    const dot = document.querySelector(".cursor-dot"), ring = document.querySelector(".cursor-ring");
    if (!dot) return;
    const label = ring.querySelector("span");
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    let running = false;
    const loop = () => {
      rx += (x - rx) * .15; ry += (y - ry) * .15;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      if (Math.abs(x - rx) + Math.abs(y - ry) > .3) requestAnimationFrame(loop); else running = false; // sleep when idle
    };
    window.addEventListener("pointermove", e => {
      x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px)`; document.body.classList.add("cursor-on");
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.addEventListener("pointerover", e => {
      const big = e.target.closest("[data-cursor]");
      ring.classList.toggle("label", !!big);
      if (big) label.textContent = t(big.dataset.cursor);
      ring.classList.toggle("hover", !big && !!e.target.closest("a, button, select, input, label"));
    });
    document.addEventListener("pointerleave", () => document.body.classList.remove("cursor-on"));
  }

  /* ---------- Scroll engine: parallax, hero, word highlight, horizontal ---------- */
  let hs = null; // horizontal scroll section
  let lastY = 0;

  /* ---------- Mobile swipe carousels (centre card larger) ---------- */
  const CAROUSELS = "#dest-bento, .svc-grid, .values";
  function setupCarousels() {
    document.querySelectorAll(CAROUSELS).forEach(el => {
      if (el.classList.contains("m-carousel")) return;
      el.classList.add("m-carousel");
      el.insertAdjacentHTML("afterend", '<div class="m-progress"><i></i></div>');
    });
    updateCarousels();
  }
  function updateCarousels() {
    if (innerWidth > 900) return;
    document.querySelectorAll(".m-carousel").forEach(el => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
      [...el.children].forEach(ch => {
        const c = ch.getBoundingClientRect();
        const d = Math.min(1, Math.abs(c.left + c.width / 2 - cx) / r.width);
        ch.style.setProperty("--cs", (1 - d * .1).toFixed(3));
        ch.style.setProperty("--cb", (1 - d * .35).toFixed(3));
      });
      const max = el.scrollWidth - el.clientWidth;
      const bar = el.nextElementSibling?.querySelector("i");
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.max(.12, el.scrollLeft / max) : 1})`;
    });
  }
  let cRaf = 0;
  document.addEventListener("scroll", e => {
    if (e.target.classList && e.target.classList.contains("m-carousel") && !cRaf) cRaf = requestAnimationFrame(() => { updateCarousels(); cRaf = 0; });
  }, true);
  function measure() {
    const sec = document.querySelector(".hscroll");
    if (!sec) return;
    const track = sec.querySelector(".hs-track");
    if (innerWidth <= 900 || reduceMotion) { sec.style.height = ""; track.style.transform = ""; hs = null; return; }
    const dist = Math.max(0, track.scrollWidth - innerWidth + 80);
    sec.style.height = (innerHeight + dist) + "px";
    hs = { sec, track, dist };
    onScroll();
  }
  function onScroll() {
    const y = scrollY, vh = innerHeight;
    document.getElementById("header")?.classList.toggle("scrolled", y > 40);
    const prog = document.querySelector(".scroll-progress span");
    const h = document.documentElement.scrollHeight - vh;
    if (prog) prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    document.querySelector(".wa-float")?.classList.toggle("show", y > 300 || document.body.dataset.page !== "home");
    revealClips();
    // tab bar: hide while scrolling down, show when scrolling up
    const tb = document.querySelector(".m-tabbar");
    if (tb) {
      if (y > lastY + 6 && y > 300) tb.classList.add("hide");
      else if (y < lastY - 6 || y < 300) tb.classList.remove("hide");
      lastY = y;
    }
    if (reduceMotion) return;

    // hero: content drifts, frame lifts
    const hero = document.querySelector(".hero");
    if (hero && y < vh * 1.2) {
      const p = y / vh;
      hero.style.setProperty("--hp", p.toFixed(4));
    }
    // parallax
    document.querySelectorAll("[data-parallax]").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax)}px, 0)`;
    });
    // word highlight
    document.querySelectorAll(".hl").forEach(el => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const words = el.querySelectorAll(".w"), n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    });
    // horizontal scroll
    if (hs) {
      const top = hs.sec.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / hs.dist));
      hs.track.style.transform = `translate3d(${-p * hs.dist}px,0,0)`;
      hs.sec.style.setProperty("--hsp", p.toFixed(4));
    }
  }

  /* ---------- Hero mouse depth ---------- */
  function bindHeroMouse() {
    const hero = document.querySelector(".hero");
    if (!hero || !finePointer || reduceMotion) return;
    hero.addEventListener("pointermove", e => {
      hero.style.setProperty("--mx", ((e.clientX / innerWidth) - .5).toFixed(3));
      hero.style.setProperty("--my", ((e.clientY / innerHeight) - .5).toFixed(3));
    });
  }

  /* ---------- Preloader ---------- */
  function runPreloader(done) {
    const pl = document.getElementById("preloader");
    if (!pl) return done();
    const num = pl.querySelector(".pl-num");
    const seen = sessionStorage.getItem("ev-seen");
    const dur = seen ? 500 : 1800, start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      if (num) num.textContent = v;
      pl.style.setProperty("--p", v / 100);
      if (p < 1) requestAnimationFrame(step);
      else { sessionStorage.setItem("ev-seen", 1); pl.classList.add("hide"); done(); setTimeout(() => pl.remove(), 1600); }
    })(start);
  }

  /* ---------- Public API ---------- */
  window.EV = {
    t, icon, WA_SVG, pl, plWord, fmtPrice, fmtNum, countryName, openWhatsApp, observeReveals, measure, updateCarousels,
    get lang() { return lang; },
    onLang(fn) { hooks.push(fn); },
    imgStyle: (url, grad = "var(--grad-deep)") => `background-image:url('${url}'), ${grad}`
  };

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loading");
    buildLayout();
    applyI18n();
    document.dispatchEvent(new CustomEvent("ev:ready"));
    applyI18n();
    setupCarousels();
    fitTitles();
    hooks.push(() => requestAnimationFrame(() => { updateCarousels(); fitTitles(); }));
    window.addEventListener("resize", fitTitles);
    document.fonts && document.fonts.ready.then(fitTitles);
    bindHeader();
    bindCursor();
    bindHeroMouse();
    observeReveals();
    window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
    onScroll();
    requestAnimationFrame(() => { updateLangPill(); measure(); });
    document.fonts && document.fonts.ready.then(() => { updateLangPill(); measure(); });
    window.addEventListener("load", measure);
    runPreloader(() => { document.body.classList.remove("loading"); document.body.classList.add("loaded"); });
  });
})();
