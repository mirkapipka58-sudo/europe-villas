/* =========================================================
   Europe Villas & Apartments — page logic
   ========================================================= */
document.addEventListener("ev:ready", () => {
  const { t, icon, fmtPrice, countryName, imgStyle, pl, plWord } = EV;
  const page = document.body.dataset.page;
  const $ = s => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const countOf = id => VILLAS.filter(v => v.country === id).length;

  /* ---------- Villa card ---------- */
  function card(v, i = 0) {
    return `
    <article class="villa-card reveal" data-delay="${(i % 3) * 120}" data-cursor="card.view">
      <a href="villa.html?id=${v.id}">
        <div class="vc-media">
          <div class="vc-img" style="${imgStyle(v.images[0])}"></div>
          <span class="vc-badge">${t("type." + v.type)}</span>
          ${v.rating ? `<span class="vc-rating">${icon("star")} ${v.rating.toFixed(1)}</span>` : ""}
        </div>
        <div class="vc-body">
          <div class="vc-loc">${v.region}, ${countryName(v.country)}</div>
          <h3>${v.name}</h3>
          <div class="vc-specs">
            <span>${icon("users")} ${pl(v.guests, "guests")}</span>
            <span>${icon("bed")} ${pl(v.beds, "beds")}</span>
            ${v.area ? `<span>${icon("area")} ${v.area} ${t("v.area")}</span>` : ""}
          </div>
          <div class="vc-foot">
            <div class="vc-price"><small>${t("v.from")}</small><b>${fmtPrice(v.price)}</b><span>${t("card.night")}</span></div>
            <span class="vc-arrow">${icon("arrow")}</span>
          </div>
        </div>
      </a>
    </article>`;
  }

  const countryOptions = (allKey, sel) => `<option value="">${t(allKey)}</option>` +
    COUNTRIES.map(c => `<option value="${c.id}" ${c.id === sel ? "selected" : ""}>${c.name[EV.lang]}</option>`).join("");
  const typeOptions = (allKey, sel) => `<option value="">${t(allKey)}</option>` +
    ["villa", "apartment", "penthouse", "chalet"].map(x => `<option value="${x}" ${x === sel ? "selected" : ""}>${t("type." + x)}</option>`).join("");
  const numOptions = (anyKey, list, sel) => `<option value="">${t(anyKey)}</option>` +
    list.map(n => `<option value="${n}" ${String(n) === String(sel) ? "selected" : ""}>${n}+</option>`).join("");

  /* ---------- Shared blocks ---------- */
  document.querySelectorAll(".wa-inline").forEach(el => el.outerHTML = EV.WA_SVG);
  function iconCards(sel, items, cls) {
    const box = $(sel); if (!box) return;
    const r = () => box.innerHTML = items.map(([ic, k], i) => `
      <div class="${cls} reveal" data-delay="${i * 90}">
        <span class="svc-num">0${i + 1}</span>
        <div class="svc-ic">${icon(ic)}</div>
        <h3>${t(k + ".t")}</h3><p>${t(k + ".d")}</p>
      </div>`).join("");
    r(); EV.onLang(r);
  }
  iconCards("#svc-grid", [["concierge", "s1"], ["chef", "s2"], ["yacht", "s3"], ["car", "s4"], ["broom", "s5"], ["sparkle", "s6"]], "svc");
  iconCards("#values-grid", [["gem", "val1"], ["heart", "val2"], ["tag", "val3"], ["lock", "val4"]], "value");
  iconCards("#ct-facts", [["chat", "ct.f1"], ["clock", "ct.f2"], ["globe", "ct.f3"], ["pin", "ct.f4"]], "ct-fact");

  // videos: fall back to poster image if the file is missing
  document.querySelectorAll("video[data-fallback]").forEach(v => {
    v.addEventListener("error", () => v.replaceWith(Object.assign(document.createElement("div"), { className: v.className + " vfallback", style: `background-image:url('${v.dataset.fallback}')` })), true);
  });
  // energy saving: play videos only while they are on screen
  const vio = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) v.play && v.play().catch(() => {}); else v.pause && v.pause();
  }), { threshold: 0.05 });
  document.querySelectorAll("video").forEach(v => vio.observe(v));

  /* =============================== HOME =============================== */
  if (page === "home") {
    const real = VILLAS.filter(v => v.real);
    const showcase = real[0] || VILLAS[0];
    const chip = () => {
      $("#hero-chip").innerHTML = `<small>${showcase.region}, ${countryName(showcase.country)}</small><b>${showcase.name}</b><span>${t("hero.from")} ${fmtPrice(showcase.price)} ${t("card.night")}</span>`;
    };
    chip(); EV.onLang(chip);

    const hsf = () => {
      $("#hs-country").innerHTML = countryOptions("search.anywhere", $("#hs-country").value);
      $("#hs-type").innerHTML = typeOptions("search.anyType", $("#hs-type").value);
      $("#hs-guests").innerHTML = numOptions("search.any", [2, 4, 6, 8, 10, 12, 14, 16], $("#hs-guests").value);
    };
    hsf(); EV.onLang(hsf);
    $("#hero-search").addEventListener("submit", e => {
      e.preventDefault();
      const q = new URLSearchParams();
      ["country", "type", "guests"].forEach(k => { const v = $("#hs-" + k).value; if (v) q.set(k, v); });
      location.href = "villas.html" + (q.toString() ? "?" + q : "");
    });

    $("#stat-deals").dataset.to = CONFIG.deals;
    $("#stat-countries").dataset.to = COUNTRIES.length;
    $("#stat-villas").dataset.to = VILLAS.length;

    const mq = () => {
      const items = COUNTRIES.map(c => `<span>${c.name[EV.lang]}</span><i>✦</i>`).join("");
      document.querySelectorAll(".marquee-track").forEach(tr => tr.innerHTML = items + items);
    };
    mq(); EV.onLang(mq);

    // horizontal showcase
    const list = real.length >= 4 ? real : VILLAS.slice(0, 8);
    const renderHS = () => {
      $("#hs-track").innerHTML = list.map((v, i) => `
        <a class="hs-card" href="villa.html?id=${v.id}" data-cursor="card.view">
          <div class="hs-img"><div style="${imgStyle(v.images[0])}"></div></div>
          <div class="hs-info">
            <span class="hs-idx">${String(i + 1).padStart(2, "0")}</span>
            <div><h3>${v.name}</h3><p>${v.region} · ${pl(v.guests, "guests")}</p></div>
            <div class="hs-price"><small>${t("v.from")}</small><b>${fmtPrice(v.price)}</b><span>${t("card.night")}</span></div>
          </div>
        </a>`).join("") + `
        <a class="hs-card hs-all" href="villas.html">
          <span class="hs-all-num">${VILLAS.length}+</span>
          <span class="hs-all-t">${t("featured.all")}</span>
          <span class="hs-all-ic">${icon("arrow")}</span>
        </a>`;
      requestAnimationFrame(EV.measure);
    };
    renderHS(); EV.onLang(renderHS);

    // destinations bento
    const renderDest = () => {
      $("#dest-bento").innerHTML = COUNTRIES.slice(0, 7).map((c, i) => `
        <a class="dest-card reveal-clip ${i === 0 ? "big" : ""} ${i === 3 ? "wide" : ""}" href="villas.html?country=${c.id}" data-delay="${i * 90}">
          <div class="dc-img" style="${imgStyle(c.img)}"></div>
          <div class="dc-body">
            <span class="dc-code">${c.code}</span>
            <h3>${c.name[EV.lang]}</h3>
            <p>${c.desc[EV.lang]}</p>
            <span class="dc-count">${t("dest.count", { n: countOf(c.id) })} ${icon("arrow")}</span>
          </div>
        </a>`).join("") + `
        <a class="dest-card dest-more reveal-clip" href="destinations.html" data-delay="630">
          <div class="dc-body"><span class="dc-plus">+${COUNTRIES.length - 7}</span><h3>${t("dest.all")}</h3><span class="dc-count">${icon("arrow")}</span></div>
        </a>`;
    };
    renderDest(); EV.onLang(renderDest);

    // testimonials
    let ti = 0, timer;
    const renderTesti = () => {
      $("#testi-track").innerHTML = TESTIMONIALS.map((x, i) => `
        <figure class="testi ${i === ti ? "active" : ""}">
          <div class="testi-stars">${icon("star").repeat(5)}</div>
          <blockquote>“${x.text[EV.lang]}”</blockquote>
          <figcaption><span class="testi-ava">${x.name[0]}</span><span><b>${x.name}</b><small>${x.from} → ${x.villa}</small></span></figcaption>
        </figure>`).join("");
      $("#testi-dots").innerHTML = TESTIMONIALS.map((_, i) => `<button class="${i === ti ? "active" : ""}" data-i="${i}" aria-label="${i + 1}"></button>`).join("");
    };
    const go = i => {
      ti = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
      document.querySelectorAll(".testi").forEach((el, k) => el.classList.toggle("active", k === ti));
      document.querySelectorAll("#testi-dots button").forEach((el, k) => el.classList.toggle("active", k === ti));
      clearInterval(timer); timer = setInterval(() => go(ti + 1), 7000);
    };
    renderTesti(); EV.onLang(renderTesti); go(0);
    $("#testi-dots").addEventListener("click", e => { const b = e.target.closest("button"); if (b) go(+b.dataset.i); });
    $("#testi-prev").addEventListener("click", () => go(ti - 1));
    $("#testi-next").addEventListener("click", () => go(ti + 1));
  }

  /* =============================== CATALOG =============================== */
  if (page === "villas") {
    const maxPrice = Math.ceil(Math.max(...VILLAS.map(v => v.price)) / 500) * 500;
    const state = {
      q: params.get("q") || "", country: params.get("country") || "", region: params.get("region") || "",
      type: params.get("type") || "", guests: params.get("guests") || "", beds: params.get("beds") || "",
      price: maxPrice, pool: false, sea: false, sort: "popular", shown: 12
    };
    const price = $("#f-price");
    price.max = maxPrice; price.min = 150; price.step = 50; price.value = maxPrice;

    const fillSelects = () => {
      $("#f-country").innerHTML = countryOptions("f.allCountries", state.country);
      $("#f-type").innerHTML = typeOptions("f.allTypes", state.type);
      $("#f-guests").innerHTML = numOptions("f.any", [2, 4, 6, 8, 10, 12, 14, 16], state.guests);
      $("#f-beds").innerHTML = numOptions("f.any", [1, 2, 3, 4, 5, 6, 7, 8], state.beds);
      $("#f-sort").innerHTML = ["popular", "priceAsc", "priceDesc", "rating", "size"].map(s => `<option value="${s}" ${s === state.sort ? "selected" : ""}>${t("sort." + s)}</option>`).join("");
      $("#f-q").value = state.q;
    };
    const priceLabel = () => $("#f-price-val").textContent = fmtPrice(state.price);
    const updateRange = () => price.style.setProperty("--p", ((state.price - price.min) / (price.max - price.min) * 100) + "%");

    const renderRegions = () => {
      const box = $("#f-regions");
      const c = COUNTRIES.find(x => x.id === state.country);
      if (!c) { box.innerHTML = ""; box.classList.remove("show"); return; }
      box.classList.add("show");
      box.innerHTML = `<button class="chip ${!state.region ? "active" : ""}" data-r="">${t("f.allRegions")}</button>` +
        c.regions.filter(r => VILLAS.some(v => v.country === c.id && v.region === r.name))
          .map(r => `<button class="chip ${state.region === r.name ? "active" : ""}" data-r="${r.name}">${r.name}</button>`).join("");
    };

    function filtered() {
      const q = state.q.trim().toLowerCase();
      const list = VILLAS.filter(v =>
        (!state.country || v.country === state.country) &&
        (!state.region || v.region === state.region) &&
        (!state.type || v.type === state.type) &&
        (!state.guests || v.guests >= +state.guests) &&
        (!state.beds || v.beds >= +state.beds) &&
        v.price <= state.price &&
        (!state.pool || v.features.includes("pool")) &&
        (!state.sea || v.features.includes("seaView")) &&
        (!q || (v.name + " " + v.region + " " + countryName(v.country) + " " + v.id).toLowerCase().includes(q))
      );
      const S = { popular: (a, b) => b.popular - a.popular, priceAsc: (a, b) => a.price - b.price, priceDesc: (a, b) => b.price - a.price, rating: (a, b) => (b.rating || 5) - (a.rating || 5), size: (a, b) => (b.area || b.guests * 50) - (a.area || a.guests * 50) };
      return list.sort(S[state.sort]);
    }

    function render(reset = true) {
      if (reset) state.shown = 12;
      const list = filtered();
      $("#v-count").innerHTML = t("villas.found", { n: `<b>${list.length}</b>` });
      $("#v-grid").innerHTML = list.length ? list.slice(0, state.shown).map(card).join("") : `<div class="empty">${icon("search")}<p>${t("villas.none")}</p><button class="btn btn-outline" id="v-reset2">${t("f.reset")}</button></div>`;
      $("#v-more").style.display = list.length > state.shown ? "" : "none";
      $("#v-reset2")?.addEventListener("click", reset_);
      const u = new URLSearchParams();
      ["country", "region", "type", "guests", "beds", "q"].forEach(k => state[k] && u.set(k, state[k]));
      history.replaceState(null, "", "villas.html" + (u.toString() ? "?" + u : ""));
      EV.observeReveals();
    }
    function reset_() {
      Object.assign(state, { q: "", country: "", region: "", type: "", guests: "", beds: "", price: maxPrice, pool: false, sea: false, sort: "popular" });
      price.value = maxPrice; $("#f-pool").checked = false; $("#f-sea").checked = false;
      fillSelects(); renderRegions(); priceLabel(); updateRange(); render();
    }

    fillSelects(); renderRegions(); priceLabel(); updateRange(); render();
    EV.onLang(() => { fillSelects(); renderRegions(); priceLabel(); render(false); });

    $("#f-country").addEventListener("change", e => { state.country = e.target.value; state.region = ""; renderRegions(); render(); });
    ["type", "guests", "beds", "sort"].forEach(k => $("#f-" + k).addEventListener("change", e => { state[k] = e.target.value; render(); }));
    let qt; $("#f-q").addEventListener("input", e => { clearTimeout(qt); qt = setTimeout(() => { state.q = e.target.value; render(); }, 220); });
    price.addEventListener("input", () => { state.price = +price.value; priceLabel(); updateRange(); });
    price.addEventListener("change", () => render());
    $("#f-pool").addEventListener("change", e => { state.pool = e.target.checked; render(); });
    $("#f-sea").addEventListener("change", e => { state.sea = e.target.checked; render(); });
    $("#f-regions").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; state.region = b.dataset.r; renderRegions(); render(); });
    $("#f-reset").addEventListener("click", reset_);
    $("#v-more").addEventListener("click", () => { state.shown += 12; render(false); });
    $("#f-toggle").addEventListener("click", () => $(".filters").classList.toggle("open"));
  }

  /* =============================== VILLA =============================== */
  if (page === "villa") {
    const v = VILLAS.find(x => x.id === +params.get("id")) || VILLAS[0];
    const c = COUNTRIES.find(x => x.id === v.country);
    let li = 0;

    const render = () => {
      const cn = c.name[EV.lang];
      document.title = `${v.name} — ${v.region}, ${cn} | Europe Villas & Apartments`;
      const msg = t("wa.msgVilla", { name: v.name, id: v.id, region: v.region, country: cn }).replace(/"/g, "&quot;");
      const tabWa = document.querySelector(".m-tab-wa"); // mobile tab bar: message about this villa
      if (tabWa) tabWa.dataset.waMsg = t("wa.msgVilla", { name: v.name, id: v.id, region: v.region, country: cn });
      const imgs = v.images.slice(0, 5);
      $("#villa-hero").innerHTML = `
        <div class="ph-bg" style="${imgStyle(v.images[0])}" data-parallax="0.2"></div>
        <div class="ph-overlay"></div>
        <div class="container ph-content">
          <a class="back-link reveal" href="villas.html">${icon("arrowL")} ${t("v.back")}</a>
          <div class="vh-tags reveal" data-delay="100"><span class="tag-glass">${t("type." + v.type)}</span><span class="tag-glass">ID ${v.id}</span>${v.rating ? `<span class="tag-glass">${icon("star")} ${v.rating.toFixed(1)} · ${pl(v.reviews, "reviews")}</span>` : ""}</div>
          <h1 class="ph-title split-reveal"><span class="split">${v.name}</span></h1>
          <p class="ph-sub reveal" data-delay="300">${icon("pin")} ${v.region}, ${cn}</p>
        </div>`;
      // split the villa name for the letter animation
      const sp = $("#villa-hero .split"); sp.textContent = v.name;
      sp.innerHTML = [...v.name].map((ch, i) => ch === " " ? " " : `<span class="char" style="--i:${i}">${ch}</span>`).join("");

      const specs = [["users", v.guests, plWord(v.guests, "guests")], ["bed", v.beds, plWord(v.beds, "beds")], ["bath", v.baths, plWord(v.baths, "baths")]].concat(v.area ? [["area", v.area, t("v.area")]] : []);
      $("#villa-body").innerHTML = `
        <div class="container">
          <div class="gallery n${imgs.length} reveal-clip">
            ${imgs.map((src, i) => `<button class="g-item g${i}" data-i="${i}" style="${imgStyle(src)}" aria-label="photo ${i + 1}"></button>`).join("")}
            ${imgs.length > 1 ? `<button class="g-all btn btn-ghost btn-sm" data-i="0">${icon("grid")} ${t("v.photos")}</button>` : ""}
          </div>
          <div class="villa-layout">
            <div class="villa-main">
              <div class="spec-row s${specs.length} reveal">${specs.map(([ic, n, l]) => `<div class="spec">${icon(ic)}<b>${n}</b><span>${l}</span></div>`).join("")}</div>
              <section class="v-sec reveal"><h2>${t("v.overview")}</h2>
                <p>${t(v.area ? "v.p1" : "v.p1n", { name: v.name, typeA: t("typeA." + v.type), region: v.region, country: cn, area: v.area, beds: v.beds, guests: v.guests })}</p>
                <p>${t("kind." + v.kind)}</p>
                <p>${t("v.p3")}</p>
              </section>
              <section class="v-sec reveal"><h2>${t("v.amenities")}</h2>
                <div class="amenities">${v.features.map(f => `<div class="amenity">${icon(f)}<span>${t("am." + f)}</span></div>`).join("")}</div>
              </section>
              <section class="v-sec reveal"><h2>${t("v.included")}</h2>
                <ul class="included">${[1, 2, 3, 4].map(n => `<li>${icon("check")}${t("v.inc" + n)}</li>`).join("")}</ul>
              </section>
              <section class="v-sec reveal"><h2>${icon("pin")} ${v.region}, ${cn}</h2><p>${c.desc[EV.lang]}</p></section>
            </div>
            <aside class="book-card reveal-right">
              <div class="bc-price"><small>${t("v.from")}</small><b>${fmtPrice(v.price)}</b><span>${t("card.night")}</span></div>
              <ul class="bc-list">
                <li>${icon("users")} ${pl(v.guests, "guests")}</li>
                <li>${icon("bed")} ${pl(v.beds, "beds")}</li>
                <li>${icon("pin")} ${v.region}, ${cn}</li>
              </ul>
              <button class="btn btn-wa btn-block magnetic" data-wa data-wa-msg="${msg}">${EV.WA_SVG}<span>${t("v.book")}</span></button>
              <p class="bc-note">${icon("lock")} ${t("v.bookNote")}</p>
            </aside>
          </div>
          <section class="similar">
            <div class="section-head"><h2 class="section-title reveal">${t("v.similar")}</h2></div>
            <div class="villa-grid">${VILLAS.filter(x => x.id !== v.id && (x.country === v.country || x.type === v.type)).sort((a, b) => (b.real ? 1 : 0) - (a.real ? 1 : 0) || (b.country === v.country) - (a.country === v.country) || b.popular - a.popular).slice(0, 3).map(card).join("")}</div>
          </section>
        </div>`;
      EV.observeReveals();
    };
    render(); EV.onLang(render);

    const lb = $("#lightbox");
    const show = i => { li = (i + v.images.length) % v.images.length; lb.querySelector(".lb-img").style.backgroundImage = `url('${v.images[li]}')`; lb.querySelector(".lb-count").textContent = `${li + 1} / ${v.images.length}`; };
    document.addEventListener("click", e => {
      const g = e.target.closest(".g-item, .g-all"); if (g) { show(+g.dataset.i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    });
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", () => show(li - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => show(li + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => { if (!lb.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(li - 1); if (e.key === "ArrowRight") show(li + 1); });
  }

  /* =============================== DESTINATIONS =============================== */
  if (page === "destinations") {
    const render = () => {
      $("#dest-list").innerHTML = COUNTRIES.map((c, i) => `
        <article class="dest-row ${i % 2 ? "rev" : ""}">
          <a class="dr-media reveal-clip" href="villas.html?country=${c.id}" data-cursor="card.view">
            <div class="dr-img" style="${imgStyle(c.img)}" data-parallax="-0.06"></div>
            <span class="dr-num">${String(i + 1).padStart(2, "0")}</span>
          </a>
          <div class="dr-body reveal" data-delay="150">
            <span class="eyebrow">${c.code} · ${t("dest.count", { n: countOf(c.id) })}</span>
            <h2>${c.name[EV.lang]}</h2>
            <p>${c.desc[EV.lang]}</p>
            <h4>${t("dp.regions")}</h4>
            <div class="chips">${c.regions.map(r => `<a class="chip" href="villas.html?country=${c.id}&region=${encodeURIComponent(r.name)}">${r.name}</a>`).join("")}</div>
            <a class="btn btn-dark magnetic" href="villas.html?country=${c.id}"><span>${t("dp.view")}</span>${icon("arrow")}</a>
          </div>
        </article>`).join("");
      $("#dest-index").innerHTML = COUNTRIES.map(c => `<a href="#" data-go="${c.id}">${c.name[EV.lang]}</a>`).join("");
      EV.observeReveals();
    };
    render(); EV.onLang(render);
    $("#dest-index").addEventListener("click", e => {
      const a = e.target.closest("[data-go]"); if (!a) return; e.preventDefault();
      const i = COUNTRIES.findIndex(c => c.id === a.dataset.go);
      document.querySelectorAll(".dest-row")[i].scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
});
