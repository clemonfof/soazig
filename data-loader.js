/* data-loader.js — VERSION CORRIGÉE + MODE CLAIR/SOMBRE + FILTRES ACTUALITÉS
   - Ajoute un toggle theme (auto = suit l’appareil si aucun choix)
   - Stocke le choix utilisateur en localStorage
   - Injecte les filtres Actualités si absents + rend les vignettes homogènes

   ✅ FIX DEMANDÉ :
   - Le bouton thème n’est plus “collé” uniquement au header.
   - Il est UNIQUE et se DÉPLACE :
       1) Priorité au slot #nav-theme-slot (menu overlay, bas à droite)
       2) Sinon fallback dans .site-header .header-inner (toutes pages)
   - Re-place automatique quand le menu s’ouvre/se ferme + robustesse MutationObserver
*/

console.log("BUILD:", window.__BUILD__);

// =========================
// THEME (LIGHT / DARK)
// =========================

const THEME_STORAGE_KEY = "soazig_theme"; // "light" | "dark" | null (null = auto)

function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function setStoredTheme(v) {
  try {
    if (!v) localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, v);
  } catch {}
}

function applyTheme(themeOrNull) {
  const html = document.documentElement;

  if (!themeOrNull) {
    // Auto (système) : on retire l’override
    html.removeAttribute("data-theme");
    updateThemeToggleIcon(getSystemTheme(), true);
    return;
  }

  html.setAttribute("data-theme", themeOrNull);
  updateThemeToggleIcon(themeOrNull, false);
}

function updateThemeToggleIcon(effectiveTheme, isAuto) {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  // ✅ Si AUTO : bouton allongé (CSS .theme-toggle.is-auto)
  btn.classList.toggle("is-auto", !!isAuto);

  const sun = "☀";
  const moon = "☾";

  // ✅ Pas de styles inline dégueu : on utilise une classe .auto-chip (dans ton CSS)
  const autoChip = isAuto ? `<span class="auto-chip">AUTO</span>` : "";

  // ✅ structure propre (si tu ajoutes .theme-toggle-inner en CSS c'est mieux)
  btn.innerHTML = `
    <span class="theme-toggle-inner" style="display:inline-flex;align-items:center;gap:8px;font-size:16px;line-height:1">
      <span aria-hidden="true">${effectiveTheme === "dark" ? moon : sun}</span>
      ${autoChip}
    </span>
  `;

  // ✅ Accessibilité + tooltip propre
  btn.setAttribute(
    "aria-label",
    isAuto
      ? `Thème automatique (${effectiveTheme})`
      : `Thème ${effectiveTheme} (clic pour basculer, clic droit pour auto)`
  );
  btn.setAttribute(
    "title",
    isAuto
      ? `Auto (${effectiveTheme}) — clic pour basculer, clic droit pour auto`
      : `${effectiveTheme} — clic pour basculer, clic droit pour auto`
  );
}

/* =========================================================
   ✅ NOUVELLE LOGIQUE : 1 SEUL BOUTON, QUI SE DÉPLACE
   Priorité #nav-theme-slot (menu) > fallback header
========================================================= */

function ensureThemeToggleButton() {
  let btn = document.getElementById("theme-toggle");

  // 1) Crée le bouton si absent
  if (!btn) {
    btn = document.createElement("button");
    btn.type = "button";
    btn.id = "theme-toggle";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Changer le thème");
    btn.setAttribute("title", "Changer le thème");

    // Icone par défaut (sera remplacée par updateThemeToggleIcon)
    btn.innerHTML = `<span style="font-size:16px;line-height:1">☾</span>`;
  }

  // 2) Slot PRIORITAIRE : menu overlay (si présent sur la page)
  const navSlot = document.getElementById("nav-theme-slot");
  if (navSlot) {
    if (btn.parentElement !== navSlot) navSlot.appendChild(btn);
    return;
  }

  // 3) Fallback : header (toutes pages)
  const headerInner = document.querySelector(".site-header .header-inner");
  if (!headerInner) return;

  const menuBtn = headerInner.querySelector('label.menu-toggle-label');
  if (menuBtn) {
    if (btn.parentElement !== headerInner) headerInner.insertBefore(btn, menuBtn);
  } else {
    if (btn.parentElement !== headerInner) headerInner.appendChild(btn);
  }
}

function bindThemeToggleOnce() {
  const btn = document.getElementById("theme-toggle");
  if (!btn || btn.dataset.bound === "1") return;
  btn.dataset.bound = "1";

  // Click toggle : alterne light/dark (et n’utilise plus auto)
  btn.addEventListener("click", () => {
    const currentOverride = document.documentElement.getAttribute("data-theme");
    // Si pas d’override => on part du système
    const currentEffective = currentOverride || getSystemTheme();
    const next = currentEffective === "dark" ? "light" : "dark";
    setStoredTheme(next);
    applyTheme(next);
  });

  // Bonus : clic droit (ou long press sur mobile via contextmenu) = retour en AUTO
  btn.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    setStoredTheme(null);
    applyTheme(null);
  });
}

function initTheme() {
  // ✅ place le bouton au bon endroit dès le début
  ensureThemeToggleButton();
  bindThemeToggleOnce();

  // 1) Applique le choix utilisateur si présent
  const stored = getStoredTheme();
  
  // ⚠️ IMPORTANT: Ne pas écraser le thème si déjà défini par le script de pré-chargement
  // Le script inline a déjà défini data-theme avant le chargement du CSS
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  if (stored) {
    // Si un thème est sauvegardé, on l'applique (même si déjà défini)
    applyTheme(stored);
  } else if (!currentTheme) {
    // Seulement si aucun thème n'est défini (ne devrait jamais arriver avec notre script)
    applyTheme(null);
  } else {
    // Le thème est déjà défini par le script de pré-chargement, on met juste à jour l'icône
    updateThemeToggleIcon(currentTheme, false);
  }

  // 2) Si l’utilisateur est en AUTO, on suit les changements système
  if (window.matchMedia) {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const stored2 = getStoredTheme();
      if (!stored2) applyTheme(null);
    };

    // compat
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else if (mql.addListener) mql.addListener(handler);
  }

  // 3) Quand le menu s’ouvre/ferme, le slot peut être préféré -> on re-place
  const navToggle = document.getElementById("nav-toggle");
  if (navToggle && navToggle.dataset.themeBound !== "1") {
    navToggle.dataset.themeBound = "1";
    navToggle.addEventListener("change", () => {
      window.setTimeout(() => ensureThemeToggleButton(), 0);
    });
  }

  // 4) Robustesse : si des noeuds arrivent après (menu/slot injecté),
  // on replace le bouton. (Léger, mais efficace.)
  if (!document.documentElement.dataset.themeMo) {
    document.documentElement.dataset.themeMo = "1";
    const mo = new MutationObserver(() => ensureThemeToggleButton());
    mo.observe(document.body, { childList: true, subtree: true });
  }
}

// =========================
// CONFIG GOOGLE SHEETS
// =========================

const SHEET_ID = "1870XiZnoKEptZD7zhmXQzmQRKxMCFcZn1sXwopy12GE";

const GVIZ_BASE =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json;responseHandler=none&nocache=${Date.now()}&`;

// -------------------------
// NORMALISATION COLONNES
// -------------------------

function normalizeHeader(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function slugify(input) {
  return (input || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeStableId(prefix, title, dateOrYear) {
  const s = slugify(title);
  const tail = dateOrYear ? "-" + slugify(dateOrYear.toString()) : "";
  return `${prefix}-${s || "item"}${tail}`;
}

// -------------------------
// GENERATE QUERY URL
// -------------------------

function gvizUrl(sheetName, query) {
  let url = GVIZ_BASE + "sheet=" + encodeURIComponent(sheetName);
  if (query) url += "&tq=" + encodeURIComponent(query);
  return url;
}

// -------------------------
// PARSE GOOGLE GVIZ JSON
// -------------------------

async function fetchSheetObjects(sheetName, query) {
  const res = await fetch(gvizUrl(sheetName, query));
  let text = await res.text();

  if (
    text.startsWith("/*O_o*/") ||
    text.includes("google.visualization.Query.setResponse")
  ) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    text = text.substring(start, end + 1);
  }

  const json = JSON.parse(text);

  const cols = json.table.cols.map((c, i) => {
    const raw = c.label || c.id || "col" + i;
    return normalizeHeader(raw);
  });

  const rows = json.table.rows || [];

  return rows
    .map((row) => row.c)
    .filter((cells) => cells && cells.some((c) => c && c.v !== "" && c.v !== null))
    .map((cells) => {
      const obj = {};
      cols.forEach((colName, i) => {
        obj[colName] = cells[i] ? (cells[i].v ?? cells[i].f ?? null) : null;
      });
      return obj;
    });
}

// -------------------------
// DRIVE IMAGE URL FIXER
// -------------------------

function driveToImageUrl(url) {
  if (!url) return "";

  let id = null;
  let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) id = match[1];
  match = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match) id = match[1];
  if (!id && /^[a-zA-Z0-9_-]{20,}$/.test(url)) id = url;

  // si ce n’est PAS du Drive → c’est un chemin local
  if (!id) return url;

  return `https://lh3.googleusercontent.com/d/${id}=w2000`;
}

// -------------------------
// IMG FALLBACK HELPER
// -------------------------

function setImgWithFallback(imgEl, src, altText) {
  if (!imgEl) return;
  imgEl.alt = altText || "";
  imgEl.loading = "lazy";
  imgEl.decoding = "async";
  imgEl.referrerPolicy = "no-referrer";
  imgEl.onerror = function () {
    this.onerror = null;
    this.removeAttribute("src");
  };
  imgEl.src = src || "";
}

// -------------------------
// DATE PARSER
// -------------------------

function parseSheetDate(value) {
  if (!value) return null;

  if (typeof value === "string" && /^Date\(\d+,\d+,\d+\)$/.test(value.trim())) {
    const m = value.match(/Date\((\d+),(\d+),(\d+)\)/);
    return new Date(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
  }

  if (typeof value === "number") {
    const origin = new Date(Date.UTC(1899, 11, 30));
    return new Date(origin.getTime() + value * 86400000);
  }

  if (value instanceof Date) return value;

  if (typeof value === "object") {
    if ("year" in value) return new Date(value.year, value.month, value.day);
    if ("v" in value) return parseSheetDate(value.v);
  }

  if (typeof value === "string") {
    const fr = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (fr) return new Date(fr[3], fr[2] - 1, fr[1]);

    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

function isFutureOrToday(date) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  return d.getTime() >= today.getTime();
}

// -------------------------
// LIGHTBOX
// -------------------------

function initLightbox() {
  const overlay = document.getElementById("art-lightbox");
  if (!overlay) return;

  const img = overlay.querySelector("img");
  const closeBtn = overlay.querySelector(".lightbox-close");

  function openLightbox(src, alt) {
    img.src = src;
    img.alt = alt || "";
    overlay.classList.add("is-visible");
    // ✅ Bloquer le scroll de la page
    document.body.classList.add("lightbox-open");
    // ✅ Remettre le scroll de la lightbox en haut
    overlay.scrollTop = 0;
  }

  function closeLightbox() {
    overlay.classList.remove("is-visible");
    // ✅ Réactiver le scroll de la page
    document.body.classList.remove("lightbox-open");
    img.src = "";
    img.alt = "";
  }

  document.body.addEventListener("click", (e) => {
    const t = e.target.closest(".js-zoomable");
    if (t && t.tagName === "IMG" && t.getAttribute("src")) {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(t.src, t.alt);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }
  
  overlay.addEventListener("click", (e) => {
    // ✅ Ne fermer que si on clique sur l'overlay lui-même
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) {
      closeLightbox();
    }
  });

  // ✅ Empêcher la propagation du scroll depuis la lightbox vers la page
  overlay.addEventListener("wheel", (e) => {
    e.stopPropagation();
  }, { passive: true });
}

// ----------------------------------------------------
// UTIL: STATUT + DESCRIPTION
// ----------------------------------------------------

function getArtStatus(statutRaw) {
  const s = (statutRaw || "").toString().trim().toLowerCase();
  if (!s) return { text: "", cls: "" };

  if (s === "disponible") return { text: "Disponible", cls: "art-status" };
  return { text: "Indisponible", cls: "art-status art-status--unavailable" };
}

function getArtDescription(o) {
  const candidates = [
    o.description,
    o.descriptif,
    o.description_oeuvre,
    o.texte,
    o.note,
  ];
  const desc = candidates.find((v) => typeof v === "string" && v.trim().length);
  return desc ? desc.trim() : "";
}

// ----------------------------------------------------
// UTIL: safe text + retours à la ligne
// ----------------------------------------------------

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nl2brSafe(str) {
  return escapeHtml(str).replace(/\r\n|\r|\n/g, "<br>");
}

// ----------------------------------------------------
// UTIL: "Voir plus" (troncature)
// ----------------------------------------------------

function truncateText(text, maxChars = 160) {
  const t = (text || "").trim();
  if (!t) return { short: "", isLong: false };
  if (t.length <= maxChars) return { short: t, isLong: false };

  const cut = t.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  const nice = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return { short: nice.trim() + "…", isLong: true };
}

// ----------------------------------------------------
// FICHE OEUVRE (modal "Voir plus")
// ----------------------------------------------------

let ART_SHEET = null;

function ensureArtSheet() {
  if (ART_SHEET) return ART_SHEET;

  const overlay = document.createElement("div");
  overlay.className = "art-sheet-overlay";
  overlay.id = "art-sheet-overlay";
  overlay.innerHTML = `
    <div class="art-sheet" role="dialog" aria-modal="true" aria-label="Fiche œuvre">
      <button class="art-sheet-close" type="button" aria-label="Fermer">×</button>
      <div class="art-sheet-inner">
        <div class="art-sheet-media">
          <img id="art-sheet-img" src="" alt="" class="js-zoomable">
        </div>
        <aside class="art-sheet-aside">
          <div class="art-sheet-kicker">Œuvre</div>
          <div class="art-sheet-title" id="art-sheet-title"></div>
          <div class="art-sheet-meta" id="art-sheet-meta"></div>
          <div class="art-sheet-badges" id="art-sheet-badges"></div>
          <div class="art-sheet-desc" id="art-sheet-desc"></div>
        </aside>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector(".art-sheet-close");
  const sheet = overlay.querySelector(".art-sheet");

  function close() {
    overlay.classList.remove("is-visible");
    document.documentElement.style.overflow = "";
    const img = overlay.querySelector("#art-sheet-img");
    if (img) img.removeAttribute("src");
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) close();
  });

  sheet.addEventListener("click", (e) => e.stopPropagation());

  ART_SHEET = { overlay, close };
  return ART_SHEET;
}

function openArtSheet(o) {
  const { overlay } = ensureArtSheet();

  const img = overlay.querySelector("#art-sheet-img");
  const title = overlay.querySelector("#art-sheet-title");
  const meta = overlay.querySelector("#art-sheet-meta");
  const badges = overlay.querySelector("#art-sheet-badges");
  const desc = overlay.querySelector("#art-sheet-desc");

  const imgUrl = driveToImageUrl(o.image);
  if (imgUrl) {
    img.setAttribute("src", imgUrl);
    img.alt = o.title || "";
  } else {
    img.removeAttribute("src");
    img.alt = o.title || "";
  }

  if (title) title.textContent = o.title || "";

  const metaText = [o.technique || "", o.dimensions || "", o.annee || ""].filter(Boolean).join(" · ");
  if (meta) meta.textContent = metaText;

  const st = (o.statut || "").toString().trim().toLowerCase();
  if (badges) {
    badges.innerHTML = "";
    if (st) {
      const pill = document.createElement("div");
      pill.className = st === "disponible" ? "art-pill art-pill--available" : "art-pill art-pill--sold";
      pill.textContent = st === "disponible" ? "Disponible" : "Indisponible";
      badges.appendChild(pill);
    }
  }

  const fullDesc = getArtDescription(o);
  if (desc) desc.innerHTML = fullDesc ? nl2brSafe(fullDesc) : "";

  overlay.classList.add("is-visible");
  document.documentElement.style.overflow = "hidden";
}

function initArtMoreHandler() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".art-more");
    if (!btn) return;

    e.preventDefault();
    const raw = btn.getAttribute("data-oeuvre");
    if (!raw) return;

    try {
      const o = JSON.parse(raw);
      openArtSheet(o);
    } catch (err) {
      console.error("Impossible d'ouvrir la fiche œuvre :", err);
    }
  });
}

// ----------------------------------------------------
// RENDU INDEX : ŒUVRE À LA UNE + PHARES
// ----------------------------------------------------

function renderOeuvreALaUne(o) {
  const imgEl = document.querySelector(".hero-art-image img");
  if (imgEl && o.image) {
    imgEl.src = driveToImageUrl(o.image);
    imgEl.alt = o.title || "";
    imgEl.classList.add("js-zoomable");
  }

  const titleEl = document.getElementById("hero-main-title") || document.querySelector(".hero-art-caption-title");
  const metaEl = document.getElementById("hero-main-meta") || document.querySelector(".hero-art-caption-meta");

  if (titleEl) titleEl.textContent = o.title || "";

  if (metaEl) {
    const meta = [o.technique || "", o.dimensions || "", o.annee || ""].filter(Boolean).join(" · ");
    metaEl.textContent = meta;
  }
}

function renderOeuvresPhares(list) {
  const container = document.getElementById("oeuvres-phares");
  if (!container) return;

  // Filtrer pour avoir seulement les œuvres avec accueil="PHARE"
  const pharesOnly = list.filter(o => {
    const acc = (o.accueil || "").toString().toUpperCase();
    return acc === "PHARE";
  });
  
  if (pharesOnly.length === 0) return;

  // Si 4 œuvres ou moins, afficher normalement sans carrousel
  if (pharesOnly.length <= 4) {
    container.innerHTML = "";
    container.className = "gallery-grid";
    
    pharesOnly.forEach((o) => {
      const card = document.createElement("div");
      card.className = "art-card";
      
      const thumb = document.createElement("div");
      thumb.className = "art-thumb";
      
      const img = document.createElement("img");
      img.src = driveToImageUrl(o.image);
      img.alt = o.title || "";
      img.classList.add("js-zoomable");
      thumb.appendChild(img);
      
      const body = document.createElement("div");
      body.className = "art-body";
      
      const st = getArtStatus(o.statut);
      const fullDesc = getArtDescription(o);
      const { short, isLong } = truncateText(fullDesc, 170);
      const oeuvreJson = escapeHtml(JSON.stringify(o));
      
      body.innerHTML = `
        ${st.text ? `<div class="art-status-wrapper"><span class="${st.cls}">${escapeHtml(st.text)}</span></div>` : ""}
        
        <div class="art-title">${escapeHtml(o.title || "")}</div>

        <div class="art-meta-line">${escapeHtml(o.technique || "")}</div>
        <div class="art-meta-line">${escapeHtml(o.dimensions || "")}</div>
        <div class="art-meta-line">${escapeHtml(o.annee || "")}</div>

        ${short ? `<div class="art-desc">${escapeHtml(short)}</div>` : ""}
        ${isLong ? `<button class="art-more" type="button" data-oeuvre="${oeuvreJson}">Voir plus</button>` : ""}
      `;
      
      card.appendChild(thumb);
      card.appendChild(body);
      container.appendChild(card);
    });
    
    return;
  }
  
  // Si plus de 4 œuvres, créer le carrousel
  container.innerHTML = "";
  container.className = "";
  
  const carouselWrapper = document.createElement("div");
  carouselWrapper.className = "phares-carousel-wrapper";
  
  const track = document.createElement("div");
  track.className = "gallery-grid";
  
  // Créer toutes les cartes
  pharesOnly.forEach((o) => {
    const card = document.createElement("div");
    card.className = "art-card";
    
    const thumb = document.createElement("div");
    thumb.className = "art-thumb";
    
    const img = document.createElement("img");
    img.src = driveToImageUrl(o.image);
    img.alt = o.title || "";
    img.classList.add("js-zoomable");
    thumb.appendChild(img);
    
    const body = document.createElement("div");
    body.className = "art-body";
    
    const st = getArtStatus(o.statut);
    const fullDesc = getArtDescription(o);
    const { short, isLong } = truncateText(fullDesc, 170);
    const oeuvreJson = escapeHtml(JSON.stringify(o));
    
    body.innerHTML = `
      ${st.text ? `<div class="art-status-wrapper"><span class="${st.cls}">${escapeHtml(st.text)}</span></div>` : ""}
      
      <div class="art-title">${escapeHtml(o.title || "")}</div>

      <div class="art-meta-line">${escapeHtml(o.technique || "")}</div>
      <div class="art-meta-line">${escapeHtml(o.dimensions || "")}</div>
      <div class="art-meta-line">${escapeHtml(o.annee || "")}</div>

      ${short ? `<div class="art-desc">${escapeHtml(short)}</div>` : ""}
      ${isLong ? `<button class="art-more" type="button" data-oeuvre="${oeuvreJson}">Voir plus</button>` : ""}
    `;
    
    card.appendChild(thumb);
    card.appendChild(body);
    track.appendChild(card);
  });
  
  carouselWrapper.appendChild(track);
  
  // Ajouter les boutons de navigation
  const prevBtn = document.createElement("button");
  prevBtn.className = "phares-carousel-btn phares-carousel-prev";
  prevBtn.setAttribute("aria-label", "Œuvres précédentes");
  prevBtn.innerHTML = `
    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  `;
  
  const nextBtn = document.createElement("button");
  nextBtn.className = "phares-carousel-btn phares-carousel-next";
  nextBtn.setAttribute("aria-label", "Œuvres suivantes");
  nextBtn.innerHTML = `
    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;
  
  carouselWrapper.appendChild(prevBtn);
  carouselWrapper.appendChild(nextBtn);
  
  // Logique de pagination par groupes de 4
  let currentPage = 0;
  const itemsPerPage = 4;
  const allCards = Array.from(track.querySelectorAll('.art-card'));
  const totalPages = Math.ceil(pharesOnly.length / itemsPerPage);
  
  function updateCarousel() {
    // Cacher toutes les cartes
    allCards.forEach(card => card.style.display = 'none');
    
    // Afficher les 4 cartes de la page actuelle
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allCards.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      allCards[i].style.display = 'block';
    }
    
    // Désactiver les boutons aux extrémités
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages - 1;
  }
  
  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      updateCarousel();
    }
  });
  
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      updateCarousel();
    }
  });
  
  updateCarousel();
  container.appendChild(carouselWrapper);
}

// ----------------------------------------------------
// RENDU ACTUALITÉS ACCUEIL (INDEX)
// ----------------------------------------------------

function renderActualitesAccueil(nextExpo, nextConcert, nouvelleOeuvre) {
  const expoCard = document.getElementById("card-expo");
  const concertCard = document.getElementById("card-concert");
  const nouvelleCard =
    document.getElementById("card-nouvelle") ||
    document.querySelector(".card-grid-3 .card:nth-child(3)");

  if (expoCard) {
    const titleEl = expoCard.querySelector(".card-title");
    const textEl = expoCard.querySelector(".card-text");
    const thumbWrap = expoCard.querySelector("#expo-thumb-wrap");
    const thumbImg =
      expoCard.querySelector("#expo-thumb") || expoCard.querySelector(".card-thumb img");

    if (nextExpo) {
      const d = nextExpo.d || parseSheetDate(nextExpo.date_debut);
      if (titleEl) titleEl.textContent = nextExpo.titre || "Exposition";
      if (textEl) textEl.textContent = `${nextExpo.lieu || ""}${d ? " · " + d.toLocaleDateString("fr-FR") : ""}`;

      if (thumbImg && nextExpo.image) {
        if (thumbWrap) thumbWrap.style.display = "";
        setImgWithFallback(thumbImg, driveToImageUrl(nextExpo.image), nextExpo.titre || "Exposition");
        thumbImg.classList.add("js-zoomable");
      }
    } else {
      if (titleEl) titleEl.textContent = "Aucune exposition prévue";
      if (textEl) textEl.textContent = "";
      if (thumbWrap) thumbWrap.style.display = "none";
    }

    expoCard.onclick = () => (window.location.href = "expositions.html");
  }

  if (concertCard) {
    const titleEl = concertCard.querySelector(".card-title");
    const textEl = concertCard.querySelector(".card-text");
    const thumbWrap = concertCard.querySelector("#concert-thumb-wrap");
    const thumbImg =
      concertCard.querySelector("#concert-thumb") ||
      concertCard.querySelector(".card-thumb img");

    if (nextConcert) {
      const d = nextConcert.d || parseSheetDate(nextConcert.date);
      if (titleEl) titleEl.textContent = nextConcert.titre || "Concert";
      if (textEl) textEl.textContent = `${nextConcert.lieu || ""}${d ? " · " + d.toLocaleDateString("fr-FR") : ""}`;

      if (thumbImg && nextConcert.image) {
        if (thumbWrap) thumbWrap.style.display = "";
        setImgWithFallback(thumbImg, driveToImageUrl(nextConcert.image), nextConcert.titre || "Concert");
        thumbImg.classList.add("js-zoomable");
      }
    } else {
      if (titleEl) titleEl.textContent = "Aucun concert prévu";
      if (textEl) textEl.textContent = "";
      if (thumbWrap) thumbWrap.style.display = "none";
    }

    concertCard.onclick = () => (window.location.href = "concerts.html");
  }

  if (nouvelleCard) {
    const titleEl = nouvelleCard.querySelector(".card-title");
    const textEl = nouvelleCard.querySelector(".card-text");
    const kickerEl = nouvelleCard.querySelector(".card-kicker");
    const thumbWrap = nouvelleCard.querySelector("#nouvelle-thumb-wrap");
    const thumbImg =
      nouvelleCard.querySelector("#nouvelle-thumb") ||
      nouvelleCard.querySelector(".card-thumb img");

    if (kickerEl) kickerEl.textContent = "Œuvre";

    if (nouvelleOeuvre) {
      if (thumbImg && nouvelleOeuvre.image) {
        if (thumbWrap) thumbWrap.style.display = "";
        setImgWithFallback(
          thumbImg,
          driveToImageUrl(nouvelleOeuvre.image),
          nouvelleOeuvre.title || "Nouvelle création"
        );
        thumbImg.classList.add("js-zoomable");
      }

      if (titleEl) titleEl.textContent = nouvelleOeuvre.title || "Nouvelle création";

      const meta = [nouvelleOeuvre.technique || "", nouvelleOeuvre.dimensions || "", nouvelleOeuvre.annee || ""]
        .filter(Boolean)
        .join(" · ");

      if (textEl) textEl.textContent = meta || "Nouvelle création";
    } else {
      if (titleEl) titleEl.textContent = "Nouvelle création";
      if (textEl) textEl.textContent = "Disponible prochainement";
      if (thumbWrap) thumbWrap.style.display = "none";
    }

    nouvelleCard.onclick = () => (window.location.href = "galerie.html");
  }
}

function isTruthyOuiActu(value) {
  const v = (value || "").toString().trim().toLowerCase();
  return v === "oui" || v === "o" || v === "actu" || v === "actualité" || v === "actualite" || v === "actualités" || v === "actualites";
}

function formatDateFR(d) {
  return d ? d.toLocaleDateString("fr-FR") : "";
}

/* =========================================================
   ✅ FILTRES ACTUALITÉS (AUTO, MÊME SI HTML PAS MODIFIÉ)
========================================================= */

function ensureActualitesFiltersUI() {
  const grid = document.getElementById("actualites-grid");
  if (!grid) return;

  if (document.getElementById("actu-filters")) return;

  const wrap = document.createElement("div");
  wrap.id = "actu-filters";
  wrap.style.display = "flex";
  wrap.style.flexWrap = "wrap";
  wrap.style.gap = "10px";
  wrap.style.margin = "0 0 16px 0";

  wrap.innerHTML = `
    <button type="button" class="actu-filter is-active btn btn-ghost" data-filter="all">Tout</button>
    <button type="button" class="actu-filter btn btn-ghost" data-filter="expo">Expositions</button>
    <button type="button" class="actu-filter btn btn-ghost" data-filter="concert">Concerts</button>
    <button type="button" class="actu-filter btn btn-ghost" data-filter="oeuvre">Œuvres</button>
  `;

  grid.parentNode.insertBefore(wrap, grid);
}

function initActualitesFilters() {
  const filtersWrap = document.getElementById("actu-filters");
  const grid = document.getElementById("actualites-grid");
  if (!filtersWrap || !grid) return;

  // ✅ Idempotent : évite de binder 10 fois
  if (filtersWrap.dataset.bound === "1") return;
  filtersWrap.dataset.bound = "1";

  const buttons = Array.from(filtersWrap.querySelectorAll(".actu-filter"));

  function getCards() {
    return Array.from(grid.querySelectorAll(".actu-card, .card"));
  }

  function getCardType(card) {
    const dt = (card.dataset.type || "").toLowerCase().trim();
    if (dt) return dt;

    const kickerEl = card.querySelector(".card-kicker, .actu-kicker");
    const kicker = (kickerEl ? kickerEl.textContent : "").toLowerCase();

    if (kicker.includes("expo")) return "expo";
    if (kicker.includes("concert")) return "concert";
    if (kicker.includes("œuvre") || kicker.includes("oeuvre")) return "oeuvre";
    return "all";
  }

  function applyFilter(type) {
    buttons.forEach(b => b.classList.toggle("is-active", b.dataset.filter === type));
    getCards().forEach(card => {
      const cardType = getCardType(card);
      const show = (type === "all") ? true : (cardType === type);
      card.style.display = show ? "" : "none";
    });
  }

  filtersWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".actu-filter");
    if (!btn) return;
    applyFilter(btn.dataset.filter);
  });

  // Re-apply si le contenu est injecté après
  const obs = new MutationObserver(() => {
    const active = buttons.find(b => b.classList.contains("is-active"));
    applyFilter(active ? active.dataset.filter : "all");
  });
  obs.observe(grid, { childList: true, subtree: true });

  applyFilter("all");
}

function renderActualitesPage({ expos = [], concerts = [], oeuvres = [] } = {}) {
  const container = document.getElementById("actualites-grid");
  if (!container) return;

  ensureActualitesFiltersUI();
  container.innerHTML = "";

  const itemsExpo = expos
    .map((e) => {
      const d = parseSheetDate(e.date_debut);
      const id = makeStableId("expo", e.titre || "", d ? d.toISOString().slice(0, 10) : "");
      return {
        type: "expo",
        kind: "Exposition",
        titre: e.titre || "",
        lieu: e.lieu || "",
        date: d,
        dateText: d ? formatDateFR(d) : "",
        img: driveToImageUrl(e.image),
        href: `expositions.html#${id}`,
      };
    })
    .filter((x) => isFutureOrToday(x.date))
    .sort((a, b) => (a.date || 0) - (b.date || 0));

  const itemsConcert = concerts
    .map((c) => {
      const d = parseSheetDate(c.date);
      const id = makeStableId("concert", c.titre || "", d ? d.toISOString().slice(0, 10) : "");
      return {
        type: "concert",
        kind: "Concert",
        titre: c.titre || "",
        lieu: c.lieu || "",
        date: d,
        dateText: d ? formatDateFR(d) : "",
        img: driveToImageUrl(c.image),
        href: `concerts.html#${id}`,
      };
    })
    .filter((x) => isFutureOrToday(x.date))
    .sort((a, b) => (a.date || 0) - (b.date || 0));

  const itemsOeuvres = oeuvres
    .filter((o) => o.title)
    .filter((o) => isTruthyOuiActu(o.actualites))
    .map((o) => {
      const id = makeStableId("oeuvre", o.title || "", o.annee || "");
      return {
        type: "oeuvre",
        kind: "Nouvelle œuvre",
        titre: o.title || "",
        lieu: o.technique || "",
        date: null,
        dateText: o.annee ? escapeHtml(o.annee) : "",
        img: driveToImageUrl(o.image),
        href: `galerie.html#${id}`,
      };
    });

  const all = [...itemsExpo, ...itemsConcert, ...itemsOeuvres].sort((a, b) => {
    const da = a.date ? a.date.getTime() : Infinity;
    const db = b.date ? b.date.getTime() : Infinity;
    return da - db;
  });

  if (!all.length) {
    const empty = document.createElement("div");
    empty.className = "card actu-card";
    empty.dataset.type = "all";
    empty.innerHTML = `
      <div class="card-kicker">Actualités</div>
      <h3 class="card-title">Aucune actualité à venir</h3>
      <p class="card-text">Ajoutez des expositions / concerts futurs dans le Google Sheet, ou marquez des œuvres en colonne « actualites » (OUI / ACTU).</p>
    `;
    container.appendChild(empty);
    initActualitesFilters();
    return;
  }

  all.forEach((it) => {
    const card = document.createElement("article");
    card.className = "card actu-card";
    card.dataset.type = it.type;

    // ✅ vignette identique partout, moins d’espace perdu
    const imgHtml = it.img
      ? `
        <div class="card-thumb" style="margin:0 0 10px 0;border-radius:14px;overflow:hidden;height:220px;">
          <img class="js-zoomable"
               src="${it.img}"
               alt="${escapeHtml(it.titre)}"
               style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
      `
      : "";

    const metaLine = [it.dateText, it.lieu].filter(Boolean).join(" · ");

    card.innerHTML = `
      <div class="card-kicker">${escapeHtml(it.kind)}</div>
      ${imgHtml}
      <h3 class="card-title">${escapeHtml(it.titre)}</h3>
      ${metaLine ? `<p class="card-text">${escapeHtml(metaLine)}</p>` : ""}
      <a class="card-link" href="${it.href}">En savoir plus…</a>
    `;

    container.appendChild(card);
  });

  initActualitesFilters();
}

// ----------------------------------------------------
// RENDU ŒUVRES (GALERIE / DISPONIBLES)
// ----------------------------------------------------

function renderOeuvresGrid(oeuvres, containerId, filterStatut) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  oeuvres
    .filter((o) => o.title)
    .filter((o) => !filterStatut || (o.statut || "").toLowerCase() === filterStatut)
    .forEach((o) => {
      const imgUrl = driveToImageUrl(o.image);
      const st = getArtStatus(o.statut);

      const fullDesc = getArtDescription(o);
      const { short, isLong } = truncateText(fullDesc, 190);
      const oeuvreJson = escapeHtml(JSON.stringify(o));

      const card = document.createElement("article");
      card.className = "art-card";
      card.id = makeStableId("oeuvre", o.title || "", o.annee || "");

      const thumb = document.createElement("div");
      thumb.className = "art-thumb";

      if (imgUrl) {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = o.title || "";
        img.classList.add("js-zoomable");
        thumb.appendChild(img);
      }

      const body = document.createElement("div");
      body.className = "art-body";

      body.innerHTML = `
        ${st.text ? `<div class="art-status-wrapper"><span class="${st.cls}">${escapeHtml(st.text)}</span></div>` : ""}
        
        <div class="art-title">${escapeHtml(o.title || "")}</div>

        <div class="art-meta-line">${escapeHtml(o.technique || "")}</div>
        <div class="art-meta-line">${escapeHtml(o.dimensions || "")}</div>
        <div class="art-meta-line">${escapeHtml(o.annee || "")}</div>

        ${short ? `<div class="art-desc">${escapeHtml(short)}</div>` : ""}
        ${isLong ? `<button class="art-more" type="button" data-oeuvre="${oeuvreJson}">Voir plus</button>` : ""}
      `;

      card.appendChild(thumb);
      card.appendChild(body);
      container.appendChild(card);
    });
}

// ----------------------------------------------------
// RENDU EXPOSITIONS
// ----------------------------------------------------

function renderExpositions(expos) {
  const blockAvenir = document.getElementById("expos-avenir");
  const blockEnCours = document.getElementById("expos-encours");
  const blockPassees = document.getElementById("expos-passees");

  if (blockAvenir) blockAvenir.innerHTML = "";
  if (blockEnCours) blockEnCours.innerHTML = "";
  if (blockPassees) blockPassees.innerHTML = "";

  const enriched = expos.map((e) => ({
    ...e,
    dDebut: parseSheetDate(e.date_debut),
    dFin: parseSheetDate(e.date_fin),
    img: driveToImageUrl(e.image),
  }));

  enriched.sort((a, b) => {
    const da = a.dDebut ? a.dDebut.getTime() : Infinity;
    const db = b.dDebut ? b.dDebut.getTime() : Infinity;
    return da - db;
  });

  enriched.forEach((e) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let statut = "";
    if (e.dDebut > today) statut = "avenir";
    else if (e.dFin < today) statut = "termine";
    else statut = "encours";

    let dateText = "";
    if (e.dDebut && e.dFin && e.dDebut.getTime() !== e.dFin.getTime()) {
      dateText = e.dDebut.toLocaleDateString("fr-FR") + " – " + e.dFin.toLocaleDateString("fr-FR");
    } else if (e.dDebut) {
      dateText = e.dDebut.toLocaleDateString("fr-FR");
    }

    const li = document.createElement("li");
    li.className = "event-item";
    li.id = makeStableId("expo", e.titre || "", e.dDebut ? e.dDebut.toISOString().slice(0,10) : "");

    li.innerHTML = `
      <div class="event-date">${escapeHtml(dateText)}</div>
      <div>
        ${e.img ? `<div class="event-image"><img class="js-zoomable" src="${e.img}" alt="${escapeHtml(e.titre || "")}"></div>` : ""}
        <div class="event-title">${escapeHtml(e.titre || "")}</div>
        <div class="event-meta">${escapeHtml((e.lieu || "") + " · " + (e.description || ""))}</div>
      </div>
    `;

    if (statut === "avenir" && blockAvenir) blockAvenir.appendChild(li);
    if (statut === "encours" && blockEnCours) blockEnCours.appendChild(li);
    if (statut === "termine" && blockPassees) blockPassees.appendChild(li);
  });
}

// ----------------------------------------------------
// RENDU CONCERTS
// ----------------------------------------------------

function renderConcerts(concerts) {
  const listAvenir = document.getElementById("concerts-avenir");
  const listPassees = document.getElementById("concerts-passes");

  if (listAvenir) listAvenir.innerHTML = "";
  if (listPassees) listPassees.innerHTML = "";

  concerts.forEach((c) => {
    const imgUrl = driveToImageUrl(c.image);
    const d = parseSheetDate(c.date);
    const isFuture = isFutureOrToday(d);

    const li = document.createElement("li");
    li.className = "event-item";
    li.id = makeStableId("concert", c.titre || "", d ? d.toISOString().slice(0,10) : "");

    li.innerHTML = `
      <div class="event-date">${escapeHtml(d ? d.toLocaleDateString("fr-FR") : "")}</div>
      <div>
        ${imgUrl ? `<div class="event-image"><img class="js-zoomable" src="${imgUrl}" alt="${escapeHtml(c.titre || "")}"></div>` : ""}
        <div class="event-title">${escapeHtml(c.titre || "")}</div>
        <div class="event-meta">${escapeHtml((c.lieu || "") + " · " + (c.description || ""))}</div>
      </div>
    `;

    if (isFuture && listAvenir) listAvenir.appendChild(li);
    else if (listPassees) listPassees.appendChild(li);
  });
}

// ----------------------------------------------------
// RENDU PRESSE
// ----------------------------------------------------

function renderPresse(entries) {
  const container = document.getElementById("presse-grid");
  if (!container) return;

  container.innerHTML = "";

  entries.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";

    let dateText = "";
    if (p.date) {
      const d = parseSheetDate(p.date);
      if (d) dateText = d.toLocaleDateString("fr-FR") + " · ";
    }

    card.innerHTML = `
      ${p.image ? `
        <div class="card-thumb">
          <img class="js-zoomable" src="${driveToImageUrl(p.image)}" alt="${escapeHtml(p.titre || "")}">
        </div>` : ""
      }
      <div class="card-kicker">${escapeHtml(p.source || "Presse")}</div>
      <h3 class="card-title">${escapeHtml(p.titre || "")}</h3>
      <p class="card-text">${escapeHtml(dateText)}${escapeHtml(p.texte || "")}</p>
      ${p.lien ? `<a class="card-link" href="${p.lien}" target="_blank" rel="noopener">Ouvrir l’article</a>` : ""}
    `;

    container.appendChild(card);
  });
}

// ----------------------------------------------------
// SMOOTH IMAGES (anti-flicker, sans page-loader)
// ----------------------------------------------------

function makeImageSmooth(img) {
  if (!img || img.dataset.noSmooth === "1") return;
  img.classList.add("img-smooth");

  const markReady = () => img.classList.add("is-ready");

  if (img.complete && img.naturalWidth > 0) {
    if (img.decode) img.decode().then(markReady).catch(markReady);
    else markReady();
    return;
  }

  img.addEventListener("load", () => {
    if (img.decode) img.decode().then(markReady).catch(markReady);
    else markReady();
  }, { once: true });

  img.addEventListener("error", () => markReady(), { once: true });
}

async function waitForImagesToBeReady(timeoutMs = 2500) {
  const imgs = Array.from(document.images || []);
  imgs.forEach(makeImageSmooth);

  const promises = imgs.map((img) => {
    if (img.complete) {
      if (img.decode) return img.decode().catch(() => null);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const done = () => resolve();
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  });

  const timeout = new Promise((resolve) => window.setTimeout(resolve, timeoutMs));
  await Promise.race([Promise.allSettled(promises), timeout]);
}

function initSmoothImages() {
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!node || node.nodeType !== 1) continue;
        if (node.tagName === "IMG") makeImageSmooth(node);
        const imgs = node.querySelectorAll ? node.querySelectorAll("img") : [];
        imgs.forEach(makeImageSmooth);
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

// ----------------------------------------------------
// INIT DYNAMIQUE
// ----------------------------------------------------

async function initDynamicPages() {
  try {
    if (document.querySelector(".hero-home")) {
      const oeuvres = await fetchSheetObjects("oeuvres");

      const une = oeuvres.find((o) => (o.accueil || "").toUpperCase() === "A_LA_UNE");
      if (une) renderOeuvreALaUne(une);

      const phares = oeuvres.filter((o) => (o.accueil || "").toUpperCase() === "PHARE");
      renderOeuvresPhares(phares);

      const expos = await fetchSheetObjects("expositions");
      const concerts = await fetchSheetObjects("concerts");

      const nextExpo = expos
        .map((e) => ({ ...e, d: parseSheetDate(e.date_debut) }))
        .filter((e) => isFutureOrToday(e.d))
        .sort((a, b) => a.d - b.d)[0];

      const nextConcert = concerts
        .map((c) => ({ ...c, d: parseSheetDate(c.date) }))
        .filter((c) => isFutureOrToday(c.d))
        .sort((a, b) => a.d - b.d)[0];

      const nouvelle = oeuvres.find((o) => (o.accueil || "").toUpperCase() === "NOUVELLE");
      renderActualitesAccueil(nextExpo, nextConcert, nouvelle);
    }

    if (document.getElementById("galerie-grid") || document.getElementById("disponibles-grid")) {
      const oeuvres = await fetchSheetObjects("oeuvres");
      if (document.getElementById("galerie-grid")) renderOeuvresGrid(oeuvres, "galerie-grid");
      if (document.getElementById("disponibles-grid")) renderOeuvresGrid(oeuvres, "disponibles-grid", "disponible");
    }

    if (document.getElementById("expos-avenir")) {
      renderExpositions(await fetchSheetObjects("expositions"));
    }

    if (document.getElementById("concerts-avenir")) {
      renderConcerts(await fetchSheetObjects("concerts"));
    }

    if (document.getElementById("actualites-grid")) {
      renderActualitesPage({
        expos: await fetchSheetObjects("expositions"),
        concerts: await fetchSheetObjects("concerts"),
        oeuvres: await fetchSheetObjects("oeuvres"),
      });
    }

    if (document.getElementById("presse-grid")) {
      renderPresse(await fetchSheetObjects("presse"));
    }
  } catch (err) {
    console.error("Erreur chargement Google Sheets :", err);
  }
}

// ===============================
// GLOBAL LOADER (logo + barre)
// ===============================

function showGlobalLoader() {
  const loader = document.getElementById("global-loader");
  if (!loader) return;
  loader.classList.remove("is-hidden");
}

function hideGlobalLoader() {
  const loader = document.getElementById("global-loader");
  if (!loader) return;
  loader.classList.add("is-hidden");
}

// Quand tu navigues vers une page interne, on remet le global loader
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a");
  if (!a) return;

  const href = a.getAttribute("href") || "";
  const target = a.getAttribute("target") || "";

  if (target === "_blank") return;
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  if (/^https?:\/\//i.test(href)) return;

  showGlobalLoader();
}, true);

// ----------------------------------------------------
// BOOT (UN SEUL DOMContentLoaded)
// ----------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  // 0) Theme (doit être tôt)
  initTheme();

  // 1) UI loaders / lightbox / modals
  initSmoothImages();
  initLightbox();
  initArtMoreHandler();

  // 2) Loader logo visible pendant le rendu dynamique
  showGlobalLoader();

  // 3) Data
  await initDynamicPages();

  // 4) Laisse une chance aux images injectées de se charger
  await waitForImagesToBeReady(2500);

  // 5) ✅ Masquer le global loader après 1.3 secondes minimum
  window.setTimeout(() => {
    hideGlobalLoader();
  }, 1300);
});
