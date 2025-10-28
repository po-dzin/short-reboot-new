const translations = {
  ru: {
    state: "Состояние",
    xp: "Панель опыта",
    arcQuest: "Арка A1 — Пробуждение · Квест: стабилизировать ритуальный цикл",
    quote: "«Кольцо дышит. Зерно светится. Тишина держит форму.»",
    reminder: "∣ ◯ ⊙ → Випассана + дыхание + заряд (08:00)",
    themeStatus: "Статус-зависимая",
  },
  en: {
    state: "State",
    xp: "XP Dashboard",
    arcQuest: "Arc A1 — Awakening · Quest: Stabilize ritual loop",
    quote: "“The ring breathes. The seed glows. Silence holds the form.”",
    reminder: "∣ ◯ ⊙ → Vipassana + breath + charge (08:00)",
    themeStatus: "Status-driven",
  },
};

const modeHints = {
  "🕳️": "shadow · depth · compression",
  "♾️": "flow · synthesis · resonance",
  "🔆": "radiance · broadcast · clarity",
};

const xpIcons = {
  HP: "🪨",
  CP: "💧",
  MP: "🔥",
  DP: "🌬️",
};
const storageKeys = {
  lang: "symbolfield_lang",
  theme: "symbolfield_theme",
  mode: "symbolfield_mode",
  glyph: "symbolfield_glyph",
};

const state = {
  lang: localStorage.getItem(storageKeys.lang) || "ru",
  theme: localStorage.getItem(storageKeys.theme) || "status",
  mode: localStorage.getItem(storageKeys.mode) || "♾️",
  glyph: localStorage.getItem(storageKeys.glyph) || "◯",
  xp: {
    HP: 15,
    CP: 3,
    MP: 3,
    DP: 29,
  },
};

const el = {
  pageTitle: document.querySelector(".page-title"),
  stateTitle: document.querySelector("[data-state-title]"),
  xpTitle: document.querySelector("[data-xp-title]"),
  modeHint: document.querySelector("[data-mode-hint]"),
  date: document.querySelector("[data-date]"),
  xpLedger: document.querySelector("[data-xp]"),
  log: document.querySelector("[data-log]"),
  langSelect: document.querySelector("[data-lang]"),
  themeSelect: document.querySelector("[data-theme]"),
  arcQuest: document.querySelector("[data-arc-quest]"),
  quote: document.querySelector("[data-quote]"),
  reminder: document.querySelector("[data-reminder]"),
  modeButtons: document.querySelectorAll("[data-mode]"),
  glyphButtons: document.querySelectorAll("[data-glyph]"),
};

function render() {
  document.body.dataset.mode = state.mode;
  document.body.dataset.theme = state.theme === "status" ? state.mode : state.theme;

  const t = translations[state.lang];
  if (el.stateTitle) el.stateTitle.textContent = t.state;
  if (el.xpTitle) el.xpTitle.textContent = t.xp;
  if (el.arcQuest) el.arcQuest.textContent = t.arcQuest;
  if (el.quote) el.quote.textContent = t.quote;
  if (el.reminder) el.reminder.textContent = t.reminder;
  if (el.langSelect) el.langSelect.value = state.lang;
  if (el.themeSelect) {
    el.themeSelect.value = state.theme;
    const statusOption = el.themeSelect.querySelector('option[value="status"]');
    if (statusOption) statusOption.textContent = t.themeStatus;
  }

  if (el.modeHint) el.modeHint.textContent = modeHints[state.mode];
  if (el.date) {
    const locale = state.lang === "ru" ? "ru-RU" : "en-GB";
    const now = new Date();
    const formatted = now.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    el.date.textContent = `${formatted} · 🌕 Phase ≈ Waxing Gibbous`;
  }

  if (el.xpLedger) {
    el.xpLedger.innerHTML = Object.entries(state.xp)
      .map(([key, value]) => {
        const pct = Math.min(100, value % 100);
        return `
          <div class="mt8">
            <div class="row">
              <strong>${key}</strong>
              <span>${xpIcons[key]}</span>
              <span class="mono">${value}</span>
            </div>
            <div class="progress">
              <div class="progress__bar" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  el.modeButtons.forEach((button) => {
    button.setAttribute("aria-current", button.dataset.mode === state.mode ? "true" : "false");
  });

  el.glyphButtons.forEach((button) => {
    button.setAttribute("aria-current", button.dataset.glyph === state.glyph ? "true" : "false");
  });
}
function log(message) {
  if (!el.log) return;
  const entry = document.createElement("div");
  entry.className = "list__item mono";
  const stamp = new Date().toLocaleTimeString(state.lang === "ru" ? "ru-RU" : "en-GB");
  entry.textContent = `[${stamp}] ${message}`;
  el.log.prepend(entry);
}

function setMode(mode) {
  if (state.mode === mode) return;
  state.mode = mode;
  localStorage.setItem(storageKeys.mode, mode);
  render();
  log(`∷ Mode → ${mode}`);
}

function setGlyph(glyph) {
  if (state.glyph === glyph) return;
  state.glyph = glyph;
  localStorage.setItem(storageKeys.glyph, glyph);
  render();
  log(`◐ Glyph → ${glyph}`);
}

if (el.langSelect) {
  el.langSelect.addEventListener("change", (event) => {
    const value = event.target.value;
    if (translations[value]) {
      state.lang = value;
      localStorage.setItem(storageKeys.lang, value);
      render();
    }
  });
}
if (el.themeSelect) {
  el.themeSelect.addEventListener("change", (event) => {
    state.theme = event.target.value;
    localStorage.setItem(storageKeys.theme, state.theme);
    render();
  });
}

el.modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

el.glyphButtons.forEach((button) => {
  button.addEventListener("click", () => setGlyph(button.dataset.glyph));
});

render();
log(`◯ HUD online — glyph ${state.glyph}`);
