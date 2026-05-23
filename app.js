// ISO 3166-1 alpha-3 → numeric, allineato con world-atlas countries-110m.json
const ISO3_TO_NUMERIC = {
  AFG:4,AGO:24,ALB:8,AND:20,ARE:784,ARG:32,ARM:51,ASM:16,ATG:28,AUS:36,
  AUT:40,AZE:31,BDI:108,BEL:56,BEN:204,BFA:854,BGD:50,BGR:100,BHR:48,
  BHS:44,BIH:70,BLR:112,BLZ:84,BMU:60,BOL:68,BRA:76,BRB:52,BRN:96,BTN:64,
  BWA:72,CAF:140,CAN:124,CHE:756,CHL:152,CHN:156,CIV:384,CMR:120,COD:180,
  COG:178,COL:170,COM:174,CPV:132,CRI:188,CUB:192,CUW:531,CYM:136,CYP:196,
  CZE:203,DEU:276,DJI:262,DMA:212,DNK:208,DOM:214,DZA:12,ECU:218,EGY:818,
  ERI:232,ESP:724,EST:233,ETH:231,FIN:246,FJI:242,FRA:250,FRO:234,FSM:583,
  GAB:266,GBR:826,GEO:268,GHA:288,GIB:292,GIN:324,GMB:270,GNB:624,GNQ:226,
  GRD:308,GRC:300,GRL:304,GTM:320,GUM:316,GUY:328,HKG:344,HND:340,HRV:191,
  HTI:332,HUN:348,IDN:360,IMN:833,IND:356,IRL:372,IRN:364,IRQ:368,ISL:352,
  ISR:376,ITA:380,JAM:388,JOR:400,JPN:392,KAZ:398,KEN:404,KGZ:417,KHM:116,
  KIR:296,KNA:659,KOR:410,KWT:414,LAO:418,LBN:422,LBR:430,LBY:434,LCA:662,
  LIE:438,LKA:144,LSO:426,LTU:440,LUX:442,LVA:428,MAC:446,MAF:663,MAR:504,
  MCO:492,MDA:498,MDG:450,MDV:462,MEX:484,MHL:584,MKD:807,MLI:466,MLT:470,
  MMR:104,MNE:499,MNG:496,MNP:580,MOZ:508,MRT:478,MUS:480,MWI:454,MYS:458,
  NAM:516,NCL:540,NER:562,NGA:566,NIC:558,NLD:528,NOR:578,NPL:524,NRU:520,
  NZL:554,OMN:512,PAK:586,PAN:591,PER:604,PHL:608,PLW:585,PNG:598,POL:616,
  PRK:408,PRI:630,PRT:620,PRY:600,PSE:275,PYF:258,QAT:634,ROU:642,RUS:643,
  RWA:646,SAU:682,SDN:729,SEN:686,SGP:702,SLB:90,SLE:694,SLV:222,SMR:674,
  SOM:706,SRB:688,SSD:728,STP:678,SUR:740,SVK:703,SVN:705,SWE:752,SWZ:748,
  SXM:534,SYC:690,SYR:760,TCA:796,TCD:148,TGO:768,THA:764,TJK:762,TKM:795,
  TLS:626,TON:776,TTO:780,TUN:788,TUR:792,TUV:798,TZA:834,UGA:800,UKR:804,
  URY:858,USA:840,UZB:860,VCT:670,VEN:862,VGB:92,VIR:850,VNM:704,VUT:548,
  WSM:882,YEM:887,ZAF:710,ZMB:894,ZWE:716,ABW:533,ATG:28,BRB:52,
};

const METRIC_CONFIG = [
  {
    key: "lifeExpectancy",
    label: "Aspettativa di vita",
    formatter: (v) => formatNumber(v, 1) + " anni",
    betterDirection: "higher",
    detail: "anni medi di vita alla nascita",
    category: "Salute",
  },
  {
    key: "infantMortality",
    label: "Mortalità infantile",
    formatter: (v) => formatNumber(v, 1),
    betterDirection: "lower",
    detail: "decessi sotto 1 anno ogni 1.000 nati vivi",
    category: "Salute",
  },
  {
    key: "gdpPerCapita",
    label: "PIL pro capite",
    formatter: (v) => formatCurrency(v),
    betterDirection: "higher",
    detail: "dollari correnti per persona",
    category: "Economia",
  },
  {
    key: "internetUsers",
    label: "Accesso a internet",
    formatter: (v) => formatNumber(v, 1) + "%",
    betterDirection: "higher",
    detail: "quota di popolazione con accesso alla rete",
    category: "Accesso",
  },
  {
    key: "povertyRate",
    label: "Povertà nazionale",
    formatter: (v) => formatNumber(v, 1) + "%",
    betterDirection: "lower",
    detail: "quota di popolazione sotto la soglia nazionale",
    category: "Economia",
  },
  {
    key: "maternalMortality",
    label: "Mortalità materna",
    formatter: (v) => formatNumber(v, 0) + " / 100k",
    betterDirection: "lower",
    detail: "decessi materni ogni 100.000 nati vivi",
    category: "Salute",
  },
  {
    key: "womenInParliament",
    label: "Donne in parlamento",
    formatter: (v) => formatNumber(v, 1) + "%",
    betterDirection: "higher",
    detail: "quota di seggi parlamentari femminili",
    category: "Rappresentanza",
  },
  {
    key: "expectedSchooling",
    label: "Anni di istruzione attesi",
    formatter: (v) => formatNumber(v, 1) + " anni",
    betterDirection: "higher",
    detail: "anni di scuola attesi per un bambino",
    category: "Istruzione",
  },
  {
    key: "literacyRate",
    label: "Alfabetizzazione",
    formatter: (v) => formatNumber(v, 1) + "%",
    betterDirection: "higher",
    detail: "adulti ≥15 anni che sanno leggere e scrivere",
    category: "Istruzione",
  },
  {
    key: "under5Mortality",
    label: "Mortalità under-5",
    formatter: (v) => formatNumber(v, 1),
    betterDirection: "lower",
    detail: "decessi sotto i 5 anni ogni 1.000 nati vivi",
    category: "Salute",
  },
  {
    key: "healthExpenditure",
    label: "Spesa sanitaria",
    formatter: (v) => formatCurrency(v),
    betterDirection: "higher",
    detail: "dollari pro capite spesi in sanità",
    category: "Salute",
  },
  {
    key: "giniIndex",
    label: "Indice di Gini",
    formatter: (v) => formatNumber(v, 1),
    betterDirection: "lower",
    detail: "disuguaglianza di reddito/consumo (0-100)",
    category: "Economia",
  },
  {
    key: "gdpPerCapitaPpp",
    label: "PIL pro capite (PPP)",
    formatter: (v) => formatCurrency(v),
    betterDirection: "higher",
    detail: "dollari internazionali correnti per persona",
    category: "Economia",
  },
  {
    key: "intentionalHomicides",
    label: "Tasso omicidi",
    formatter: (v) => formatNumber(v, 2),
    betterDirection: "lower",
    detail: "omicidi intenzionali per 100.000 persone",
    category: "Sicurezza",
  },
  {
    key: "outOfPocketHealth",
    label: "Spesa sanitaria out-of-pocket",
    formatter: (v) => formatNumber(v, 1) + "%",
    betterDirection: "lower",
    detail: "quota della spesa sanitaria pagata di tasca propria",
    category: "Salute",
  },
];

const state = {
  countries: [],
  totalBirths: 0,
  italy: null,
  isRolling: false,
  mapReady: false,
  mapPaths: null,
  currentWinner: null,
  comparisonBaselineIso3: "ITA",
  metricStats: {},
  birthRankByIso3: new Map(),
};

const elements = {
  drawButton: document.querySelector("#draw-button"),
  statusText: document.querySelector("#status-text"),
  resultPanel: document.querySelector("#result-panel"),
  resultEmpty: document.querySelector("#result-empty"),
  resultCard: document.querySelector("#result-card"),
  lotteryVeil: document.querySelector("#lottery-veil"),
  resultCountry: document.querySelector("#result-country"),
  resultCountryFlag: document.querySelector("#result-country-flag"),
  resultCountryName: document.querySelector("#result-country-name"),
  resultCountryRoller: document.querySelector("#result-country-roller"),
  resultCountryTrack: document.querySelector("#result-country-track"),
  resultShare: document.querySelector("#result-share"),
  resultBirths: document.querySelector("#result-births"),
  resultPopulation: document.querySelector("#result-population"),
  resultContext: document.querySelector("#result-context"),
  resultSummary: document.querySelector("#result-summary"),
  resultInsights: document.querySelector("#result-insights"),
  insightScoreLabel: document.querySelector("#insight-score-label"),
  insightScoreDetail: document.querySelector("#insight-score-detail"),
  insightTopDiffs: document.querySelector("#insight-top-diffs"),
  comparisonHeading: document.querySelector("#comparison-heading"),
  comparisonPanel: document.querySelector("#comparison-panel"),
  comparisonBaselineSelect: document.querySelector("#comparison-baseline-select"),
  comparisonWarning: document.querySelector("#comparison-warning"),
  comparisonGrid: document.querySelector("#comparison-grid"),
  distributionList: document.querySelector("#distribution-list"),
  italyBaseline: document.querySelector("#italy-baseline"),
  worldMap: document.querySelector("#world-map"),
  mapTooltip: document.querySelector("#map-tooltip"),
};

async function boot() {
  try {
    const dataset = window.BIRTH_LOTTERY_DATA;
    const ranked = sanitizeCountries(dataset?.countries || []);
    const totalBirths = ranked.reduce((s, c) => s + c.annualBirths, 0);

    if (!ranked.length || !totalBirths) throw new Error("Dataset locale non disponibile.");

    const italy = ranked.find((c) => c.iso3 === "ITA");
    if (!italy) throw new Error("Italia non trovata nel dataset.");

    state.countries = ranked;
    mergeExtraData(state.countries);
    state.totalBirths = totalBirths;
    state.italy = italy;
    state.metricStats = buildMetricStats(state.countries);
    state.birthRankByIso3 = buildBirthRankIndex(state.countries);

    hydrateItalyBaseline(italy);
    renderDistribution(ranked.slice(0, 10));
    populateComparisonBaselineSelector(ranked);
    renderPlaceholderComparison();
    syncComparisonBaselineUI();

    elements.drawButton.disabled = false;
    elements.drawButton.textContent = "Avvia";
    elements.statusText.textContent = "Dati caricati. Il sorteggio è pronto.";

    const probEl = document.querySelector("#italy-probability");
    if (probEl && italy.birthShare) {
      const oneIn = Math.round(1 / italy.birthShare);
      probEl.textContent = `L'Italia pesa il ${formatPercent(italy.birthShare)} delle nascite mondiali — 1 sorteggio su ${formatInteger(oneIn)}.`;
      probEl.classList.remove("hidden");
    }

    const versionEl = document.querySelector("#version-date");
    if (versionEl && dataset?.generatedAt) {
      const d = new Date(dataset.generatedAt);
      versionEl.textContent = d.toLocaleString("it-IT", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    }

    elements.drawButton.addEventListener("click", (e) => addRipple(elements.drawButton, e));
    elements.drawButton.addEventListener("click", rollLottery);

    initMap(ranked).catch(() => {});
  } catch (error) {
    console.error(error);
    elements.statusText.textContent =
      "Impossibile caricare i dati. Ricarica la pagina.";
    elements.drawButton.textContent = "Ricarica la pagina";
    elements.drawButton.disabled = false;
    elements.drawButton.addEventListener("click", () => location.reload());
  }
}

boot().finally(() => {
  initBirthStream();
});

// ─── MAP ──────────────────────────────────────────────────

async function initMap(countries) {
  if (typeof d3 === "undefined" || typeof topojson === "undefined") return;

  const world = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((r) => r.json());

  const svg = d3.select("#world-map");
  const container = document.querySelector(".map-container");
  const W = container.clientWidth || 960;
  const H = Math.round(W * 0.52);
  svg.attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet");

  const projection = d3.geoNaturalEarth1()
    .scale(W / 6.28)
    .translate([W / 2, H / 2]);

  const path = d3.geoPath().projection(projection);
  const countriesFeature = topojson.feature(world, world.objects.countries);

  const birthByNumeric = new Map();
  const maxShare = countries[0]?.birthShare || 0;
  for (const c of countries) {
    const num = ISO3_TO_NUMERIC[c.iso3];
    const key = numericIsoKey(num);
    if (key) birthByNumeric.set(key, c);
  }

  const colorScale = d3.scaleLinear()
    .domain([0, maxShare])
    .range(["#c8e6cc", "#1a8040"]);

  const paths = svg.selectAll("path.country-path")
    .data(countriesFeature.features)
    .join("path")
    .attr("class", (d) => {
      const c = birthByNumeric.get(numericIsoKey(d.id));
      return "country-path" + (c ? " has-data" : "");
    })
    .attr("d", path)
    .attr("fill", (d) => {
      const c = birthByNumeric.get(numericIsoKey(d.id));
      return c ? colorScale(c.birthShare) : null;
    })
    .attr("data-numeric", (d) => d.id);

  paths
    .on("mouseenter", function (event, d) {
      const c = birthByNumeric.get(numericIsoKey(d.id));
      if (!c) return;
      const tooltip = elements.mapTooltip;
      tooltip.textContent = `${c.name} · ${formatPercent(c.birthShare)}`;
      tooltip.classList.remove("hidden");
      positionTooltip(event, tooltip);
    })
    .on("mousemove", function (event) {
      positionTooltip(event, elements.mapTooltip);
    })
    .on("mouseleave", function () {
      elements.mapTooltip.classList.add("hidden");
    });

  state.mapReady = true;
  state.mapPaths = { paths, birthByNumeric };
}

function positionTooltip(event, tooltip) {
  const container = document.querySelector(".map-container");
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}

function highlightMapCountry(iso3) {
  if (!state.mapReady || !state.mapPaths) return;
  const { paths } = state.mapPaths;
  const targetNum = numericIsoKey(ISO3_TO_NUMERIC[iso3]);

  paths.classed("country-winner", (d) => numericIsoKey(d.id) === targetNum);
}

function clearMapHighlight() {
  if (!state.mapReady || !state.mapPaths) return;
  state.mapPaths.paths.classed("country-winner", false);
}

function numericIsoKey(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return String(Math.trunc(n)).padStart(3, "0");
}

// ─── LOTTERY ─────────────────────────────────────────────

function rollLottery() {
  if (state.isRolling || !state.countries.length) return;

  const winner = weightedPick(state.countries);
  if (!winner) {
    elements.drawButton.textContent = "Avvia";
    elements.statusText.textContent = "Sorteggio non disponibile con i dati correnti.";
    return;
  }

  state.isRolling = true;
  elements.drawButton.disabled = true;
  elements.drawButton.textContent = "Sorteggio in corso…";
  elements.statusText.textContent =
    "Il paese viene estratto in proporzione alle nascite annuali stimate.";
  document.querySelector("#main-content")?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });

  startLotteryAnimation();
  triggerBirthFlash();
  clearMapHighlight();

  const prefersReduced = prefersReducedMotion();
  const hasExisting = state.currentWinner != null;
  if (hasExisting) triggerParticleBurst(elements.drawButton);
  const EXIT_DURATION = (!prefersReduced && hasExisting) ? 240 : 0;
  const ROLLER_DURATION = prefersReduced ? 0 : 3600;
  revealResultPanel();

  if (!prefersReduced && hasExisting) {
    elements.resultCard.classList.add("result-exit");
  }

  window.setTimeout(() => {
    elements.resultCard.classList.remove("result-exit");
    elements.resultEmpty.classList.add("hidden");
    elements.resultCard.classList.remove("hidden");
    elements.resultCard.classList.add("is-rolling");
    elements.resultCard.classList.remove("winner-revealed");
    elements.resultInsights.classList.add("hidden");
    elements.resultCountry.classList.add("scrambling");
    showCountryRoller();
    const rollerHandle = prefersReduced ? null : startCountryRoller(winner, ROLLER_DURATION);

    window.setTimeout(() => {
      if (rollerHandle) cleanupCountryRoller(rollerHandle);

      renderWinner(winner);
      hideCountryRoller();
      finishLotteryAnimation();
      highlightMapCountry(winner.iso3);

      if (!prefersReduced) {
        elements.resultCard.classList.add("result-enter");
        elements.resultCard.addEventListener("animationend", () => {
          elements.resultCard.classList.remove("result-enter");
        }, { once: true });
      }

      state.currentWinner = winner;
      state.isRolling = false;
      elements.drawButton.disabled = false;
      elements.drawButton.textContent = "Rinasci ancora";
      elements.statusText.textContent = "Puoi ripetere il sorteggio quante volte vuoi.";
    }, ROLLER_DURATION);
  }, EXIT_DURATION);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ·—";

function startScramble(el) {
  const placeholder = "???????????????";
  let frame = 0;

  return setInterval(() => {
    frame++;
    const len = 8 + Math.floor(Math.random() * 8);
    let text = "";
    for (let i = 0; i < len; i++) {
      text += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = text;

    // Update stats with fake rolling numbers
    if (state.countries.length) {
      const fake = state.countries[Math.floor(Math.random() * state.countries.length)];
      elements.resultShare.textContent = formatPercent(fake.birthShare);
      elements.resultBirths.textContent = formatInteger(fake.annualBirths);
      elements.resultPopulation.textContent = formatInteger(fake.population);
    }
  }, 80);
}

function showCountryRoller() {
  elements.resultCountryRoller.classList.remove("hidden");
  elements.resultCountryRoller.setAttribute("aria-hidden", "false");
}

function hideCountryRoller() {
  elements.resultCountryRoller.classList.add("hidden");
  elements.resultCountryRoller.setAttribute("aria-hidden", "true");
  elements.resultCountryTrack.innerHTML = "";
  elements.resultCountryTrack.style.transition = "";
  elements.resultCountryTrack.style.transform = "";
}

function buildRollerSequence(winner, totalItems = 20) {
  const minimumItems = Math.max(totalItems, 8);
  const sequence = [];

  for (let i = 0; i < minimumItems - 2; i++) {
    const candidate = state.countries[Math.floor(Math.random() * state.countries.length)];
    sequence.push(candidate);
  }

  sequence.push(winner);
  sequence.push(state.countries[Math.floor(Math.random() * state.countries.length)]);
  return sequence;
}

function startCountryRoller(winner, duration) {
  const track = elements.resultCountryTrack;
  const sequence = buildRollerSequence(winner);
  const finalIndex = sequence.length - 2;

  track.innerHTML = sequence.map((country, index) => `
      <div class="country-roller-item${index === finalIndex ? " is-final" : ""}">
        ${renderCountryLabelMarkup(country)}
      </div>
    `
  ).join("");

  track.style.transition = "none";
  track.style.transform = "translateY(0)";
  const itemHeight = track.querySelector(".country-roller-item")?.getBoundingClientRect().height || 42.4;

  const statsInterval = window.setInterval(() => {
    const fake = state.countries[Math.floor(Math.random() * state.countries.length)];
    elements.resultShare.textContent = formatPercent(fake.birthShare);
    elements.resultBirths.textContent = formatInteger(fake.annualBirths);
    elements.resultPopulation.textContent = formatInteger(fake.population);
  }, 110);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      runTheatricalRoll(track, finalIndex, itemHeight, duration);
    });
  });

  return { statsInterval };
}

function cleanupCountryRoller(handle) {
  window.clearInterval(handle.statsInterval);
}

function revealResultPanel() {
  if (!elements.resultPanel) return;
  elements.resultPanel.classList.remove("hidden");
  elements.resultPanel.setAttribute("aria-hidden", "false");
}

function revealComparisonPanel() {
  if (!elements.comparisonPanel) return;
  elements.comparisonPanel.classList.remove("hidden");
  elements.comparisonPanel.setAttribute("aria-hidden", "false");
}

function renderCountryLabelMarkup(country) {
  const flag = countryFlagEmoji(country);
  return `
    <span class="country-flag" aria-hidden="true">${flag}</span>
    <span class="country-name">${escapeHtml(country.name)}</span>
  `;
}

function renderCountryLabel(country, flagEl, nameEl) {
  if (flagEl) flagEl.textContent = countryFlagEmoji(country);
  if (nameEl) nameEl.textContent = country.name;
}

function countryFlagEmoji(country) {
  const iso2 = sanitizeText(country?.iso2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(iso2)) return "";
  return String.fromCodePoint(...iso2.split("").map((char) => 127397 + char.charCodeAt(0)));
}

function runTheatricalRoll(track, finalIndex, itemHeight, duration) {
  const finalOffset = -(finalIndex - 1) * itemHeight;
  const nearStopA = finalOffset + itemHeight * 1.7;
  const nearStopB = finalOffset + itemHeight * 0.8;

  const phase1 = Math.round(duration * 0.62);
  const phase2 = Math.round(duration * 0.18);
  const phase3 = Math.round(duration * 0.12);
  const phase4 = Math.max(220, duration - phase1 - phase2 - phase3);

  track.style.transition = `transform ${phase1}ms cubic-bezier(0.12, 0.82, 0.2, 1)`;
  track.style.transform = `translateY(${nearStopA}px)`;

  window.setTimeout(() => {
    track.style.transition = `transform ${phase2}ms cubic-bezier(0.33, 1, 0.68, 1)`;
    track.style.transform = `translateY(${nearStopA - itemHeight * 0.45}px)`;
  }, phase1);

  window.setTimeout(() => {
    track.style.transition = `transform ${phase3}ms cubic-bezier(0.2, 0.9, 0.3, 1)`;
    track.style.transform = `translateY(${nearStopB}px)`;
  }, phase1 + phase2);

  window.setTimeout(() => {
    track.style.transition = `transform ${phase4}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    track.style.transform = `translateY(${finalOffset}px)`;
  }, phase1 + phase2 + phase3);
}

function renderWinner(country) {
  elements.resultCountry.classList.remove("scrambling");
  elements.resultCountry.classList.remove("winner-bounce");
  elements.resultCard.classList.remove("is-rolling");
  elements.resultCard.classList.remove("winner-revealed");
  void elements.resultCard.offsetWidth;
  elements.resultCard.classList.add("winner-revealed");
  revealComparisonPanel();
  renderCountryLabel(country, elements.resultCountryFlag, elements.resultCountryName);
  void elements.resultCountry.offsetWidth;
  elements.resultCountry.classList.add("winner-bounce");
  elements.resultCountry.addEventListener("animationend", () => {
    elements.resultCountry.classList.remove("winner-bounce");
  }, { once: true });
  elements.resultShare.textContent = formatPercent(country.birthShare);
  elements.resultBirths.textContent = formatInteger(country.annualBirths);
  elements.resultPopulation.textContent = formatInteger(country.population);
  renderResultContext(country);
  elements.resultSummary.textContent = buildNarrative(country, state.italy);
  const baselineCountry = getComparisonBaselineCountry();
  renderInsights(country, baselineCountry);
  renderComparison(country, baselineCountry);
}

function populateComparisonBaselineSelector(countries) {
  if (!elements.comparisonBaselineSelect) return;
  const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name, "it"));
  elements.comparisonBaselineSelect.innerHTML = sorted.map((country) => {
    const selected = country.iso3 === state.comparisonBaselineIso3 ? " selected" : "";
    return `<option value="${escapeHtml(country.iso3)}"${selected}>${escapeHtml(renderFlagAndName(country))}</option>`;
  }).join("");
  if (!sorted.some((country) => country.iso3 === state.comparisonBaselineIso3)) {
    state.comparisonBaselineIso3 = "ITA";
    elements.comparisonBaselineSelect.value = "ITA";
  }
  elements.comparisonBaselineSelect.addEventListener("change", () => {
    state.comparisonBaselineIso3 = elements.comparisonBaselineSelect.value || "ITA";
    syncComparisonBaselineUI();
    if (state.currentWinner) {
      renderComparison(state.currentWinner, getComparisonBaselineCountry());
    } else {
      renderPlaceholderComparison(getComparisonBaselineCountry());
    }
  });
}

function syncComparisonBaselineUI() {
  const baselineCountry = getComparisonBaselineCountry();
  if (!baselineCountry) return;
  if (elements.comparisonHeading) {
    elements.comparisonHeading.textContent = `${baselineCountry.name} vs paese estratto`;
  }
  if (elements.comparisonGrid) {
    elements.comparisonGrid.setAttribute(
      "aria-label",
      `Confronto indicatori tra paese estratto e ${baselineCountry.name}`
    );
  }
  if (elements.comparisonBaselineSelect && elements.comparisonBaselineSelect.value !== baselineCountry.iso3) {
    elements.comparisonBaselineSelect.value = baselineCountry.iso3;
  }
}

function getComparisonBaselineCountry() {
  return state.countries.find((country) => country.iso3 === state.comparisonBaselineIso3)
    || state.italy
    || null;
}

function renderFlagAndName(country) {
  const flag = countryFlagEmoji(country);
  return flag ? `${flag} ${country.name}` : country.name;
}

// ─── EXTRA DATA ──────────────────────────────────────────

function mergeExtraData(countries) {
  const extra = window.BIRTH_LOTTERY_EXTRA || {};
  for (const country of countries) {
    const s = extra[country.iso3];
    if (!s) continue;
    if (s.maternalMortality != null) {
      country.maternalMortality = s.maternalMortality;
      country.metricDetails.maternalMortality = { value: s.maternalMortality, year: "2020", source: "World Bank" };
    }
    if (s.womenInParliament != null) {
      country.womenInParliament = s.womenInParliament;
      country.metricDetails.womenInParliament = { value: s.womenInParliament, year: "2023", source: "World Bank" };
    }
    if (s.expectedSchooling != null) {
      country.expectedSchooling = s.expectedSchooling;
      country.metricDetails.expectedSchooling = { value: s.expectedSchooling, year: "2023", source: "UNDP HDR" };
    }
    if (s.literacyRate != null) {
      country.literacyRate = s.literacyRate;
      country.metricDetails.literacyRate = { value: s.literacyRate, year: "2021", source: "World Bank" };
    }
    if (s.under5Mortality != null) {
      country.under5Mortality = s.under5Mortality;
      country.metricDetails.under5Mortality = { value: s.under5Mortality, year: "2022", source: "World Bank" };
    }
    if (s.healthExpenditure != null) {
      country.healthExpenditure = s.healthExpenditure;
      country.metricDetails.healthExpenditure = { value: s.healthExpenditure, year: "2021", source: "World Bank" };
    }
    if (s.giniIndex != null) {
      country.giniIndex = s.giniIndex;
      country.metricDetails.giniIndex = { value: s.giniIndex, year: "2022", source: "World Bank" };
    }
    if (s.gdpPerCapitaPpp != null) {
      country.gdpPerCapitaPpp = s.gdpPerCapitaPpp;
      country.metricDetails.gdpPerCapitaPpp = { value: s.gdpPerCapitaPpp, year: "2024", source: "World Bank ICP" };
    }
    if (s.intentionalHomicides != null) {
      country.intentionalHomicides = s.intentionalHomicides;
      country.metricDetails.intentionalHomicides = { value: s.intentionalHomicides, year: "2023", source: "UNODC / World Bank" };
    }
    if (s.outOfPocketHealth != null) {
      country.outOfPocketHealth = s.outOfPocketHealth;
      country.metricDetails.outOfPocketHealth = { value: s.outOfPocketHealth, year: "2021", source: "World Bank" };
    }
  }
}

// ─── NARRATIVE ───────────────────────────────────────────

function buildNarrative(country, italy) {
  if (country.iso3 === "ITA") {
    return `Questo sorteggio ti riporta in Italia: il ${formatPercent(country.birthShare)} delle nascite mondiali. Un'improbabilità che tende a passare inosservata proprio perché è il punto di partenza che conosci — sanità universale, ${formatNumber(country.lifeExpectancy, 1)} anni di aspettativa di vita, istruzione pubblica gratuita. In questa lotteria, la tua estrazione originale era già tra le più favorevoli al mondo.`;
  }

  const parts = [];
  parts.push(narrativeOpening(country, italy));
  const impact = narrativeImpact(country, italy);
  if (impact) parts.push(impact);
  parts.push(`Il ${formatPercent(country.birthShare)} dei nati nel mondo inizia la propria vita qui.`);
  return parts.join(" ");
}

function narrativeOpening(country, italy) {
  const { name, income, gdpPerCapita } = country;
  const itGdp = italy.gdpPerCapita;

  if (income === "Low income") {
    return `${name} figura tra i paesi a basso reddito del pianeta, con condizioni strutturali che rendono la partenza di chi nasce qui molto lontana da quella di chi nasce in Europa.`;
  }
  if (income === "Lower middle income") {
    if (gdpPerCapita != null && itGdp != null) {
      const pct = Math.round((gdpPerCapita / itGdp) * 100);
      return `${name} è un paese a reddito medio-basso, con un PIL pro capite di ${formatCurrency(gdpPerCapita)} — circa il ${pct}% di quello italiano.`;
    }
    return `${name} appartiene alla fascia dei paesi a reddito medio-basso: una categoria che racchiude alcune delle disuguaglianze più marcate al mondo.`;
  }
  if (income === "Upper middle income") {
    return `${name} è un paese a reddito medio-alto, con standard di vita molto variabili al suo interno ma con una traiettoria di sviluppo consolidata.`;
  }
  if (gdpPerCapita != null && itGdp != null && gdpPerCapita > itGdp * 1.4) {
    return `${name} è un paese ad alto reddito con un PIL pro capite di ${formatCurrency(gdpPerCapita)}: significativamente superiore a quello italiano.`;
  }
  return `${name} è classificato tra i paesi ad alto reddito — una partenza statisticamente privilegiata.`;
}

function narrativeImpact(country, italy) {
  const le = country.lifeExpectancy;
  const itLe = italy.lifeExpectancy;
  if (le != null && itLe != null) {
    const diff = itLe - le;
    if (diff >= 10) return `Chi nasce qui vive in media ${formatNumber(le, 1)} anni — ${formatNumber(diff, 1)} in meno rispetto a un italiano.`;
    if (diff >= 5) return `L'aspettativa di vita è di ${formatNumber(le, 1)} anni, circa ${formatNumber(diff, 1)} anni meno di quella italiana.`;
    if (diff <= -3) return `L'aspettativa di vita di ${formatNumber(le, 1)} anni è superiore a quella italiana.`;
  }

  const im = country.infantMortality;
  const itIm = italy.infantMortality;
  if (im != null && itIm != null) {
    const ratio = im / itIm;
    if (ratio >= 10) return `La mortalità infantile (${formatNumber(im, 1)} su mille nati) è dieci volte quella italiana.`;
    if (ratio >= 5) return `La mortalità infantile di ${formatNumber(im, 1)} su mille nati è circa cinque volte quella italiana.`;
    if (ratio >= 3) return `La mortalità infantile — ${formatNumber(im, 1)} su mille nati vivi — è tre volte quella italiana.`;
  }

  const mm = country.maternalMortality;
  const itMm = italy.maternalMortality;
  if (mm != null && itMm != null) {
    const ratio = mm / itMm;
    if (ratio >= 50) return `La mortalità materna è di ${formatNumber(mm, 0)} su 100.000 nati vivi: oltre cinquanta volte quella italiana.`;
    if (ratio >= 20) return `La mortalità materna — ${formatNumber(mm, 0)} su 100.000 nati — è venti volte quella italiana.`;
  }

  if (country.povertyRate != null && country.povertyRate >= 30) {
    return `Il ${formatNumber(country.povertyRate, 1)}% della popolazione vive sotto la soglia di povertà nazionale.`;
  }

  const gdp = country.gdpPerCapita;
  const itGdp = italy.gdpPerCapita;
  if (gdp != null && itGdp != null) {
    if (gdp / itGdp < 0.05) return `Il PIL pro capite — ${formatCurrency(gdp)} — è meno di un ventesimo di quello italiano.`;
    if (gdp / itGdp < 0.12) return `Il PIL pro capite di ${formatCurrency(gdp)} è meno di un ottavo di quello italiano.`;
  }

  return null;
}

function renderResultContext(country) {
  const birthRank = state.birthRankByIso3.get(country.iso3);
  const lifeStanding = buildStanding(country, "lifeExpectancy");
  const cards = [
    {
      label: "Regione",
      value: country.region || "N/D",
      meta: country.iso3,
    },
    {
      label: "Fascia reddito",
      value: country.income || "N/D",
      meta: birthRank ? `${ordinalLabel(birthRank)} per nascite stimate` : "Posizione nascita n/d",
    },
    {
      label: "Profilo longevità",
      value: lifeStanding.label,
      meta: lifeStanding.meta,
    },
  ];

  elements.resultContext.innerHTML = cards.map((card) => `
    <div class="context-chip">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.value)}</strong>
      <small>${escapeHtml(card.meta)}</small>
    </div>
  `).join("");
}

function buildStanding(country, metricKey) {
  const stats = state.metricStats[metricKey];
  const value = country?.[metricKey];
  if (!stats || value == null || !stats.available) {
    return { label: "Dato non disponibile", meta: "Copertura insufficiente per un posizionamento stabile" };
  }

  const sorted = stats.sortedCountries;
  const index = sorted.findIndex((entry) => entry.iso3 === country.iso3);
  if (index === -1) {
    return { label: "Dato non disponibile", meta: "Paese assente nella classifica" };
  }

  const betterCount = metricPercentile(index, sorted.length);
  const direction = stats.betterDirection === "higher" ? "meglio" : "più favorevole";
  const ordinal = ordinalLabel(index + 1);
  return {
    label: `${ordinal} su ${sorted.length}`,
    meta: `${direction} del ${formatPercentFromWhole(betterCount)} dei paesi con dato disponibile`,
  };
}

// ─── HYDRATE ─────────────────────────────────────────────

function hydrateItalyBaseline(italy) {
  const metrics = [
    { key: "lifeExpectancy", label: "Aspettativa di vita" },
    { key: "infantMortality", label: "Mortalità infantile" },
    { key: "gdpPerCapita", label: "PIL pro capite" },
    { key: "internetUsers", label: "Accesso a internet" },
    { key: "povertyRate", label: "Povertà nazionale" },
  ];

  elements.italyBaseline.innerHTML = metrics.map(({ key, label }) => `
    <div class="metric-chip">
      <span>${label}</span>
      <strong>${formatMetric(key, italy)}</strong>
    </div>
  `).join("");
}

function renderDistribution(countries) {
  const highestShare = countries[0]?.birthShare || 0;
  elements.distributionList.innerHTML = countries.map((c) => {
    const width = highestShare ? (c.birthShare / highestShare) * 100 : 0;
    return `
      <div class="distribution-row">
        <strong class="distribution-country">${renderCountryLabelMarkup(c)}</strong>
        <div class="distribution-bar" aria-hidden="true">
          <span style="width:${width.toFixed(1)}%"></span>
        </div>
        <span>${formatPercent(c.birthShare)}</span>
      </div>
    `;
  }).join("");
}

function renderPlaceholderComparison(baselineCountry = getComparisonBaselineCountry()) {
  elements.comparisonWarning.classList.add("hidden");
  elements.comparisonWarning.textContent = "";
  elements.comparisonGrid.innerHTML = getComparisonRowsMarkup(getVisibleMetrics(), ({ metric }) => `
    <article class="comparison-row" role="row" data-tone="neutral">
      <div class="comparison-indicator">
        <strong>${metric.label}</strong>
        <small class="metric-desc">${metric.detail}</small>
      </div>
      <div class="comparison-value">
        <strong>-</strong>
      </div>
      <div class="comparison-value">
        <strong>-</strong>
      </div>
      <div class="comparison-delta">
        <strong class="tone-neutral">In attesa</strong>
      </div>
    </article>
  `);
}

// ─── COMPARISON ──────────────────────────────────────────

function startLotteryAnimation() {
  elements.lotteryVeil.classList.remove("hidden", "is-settling");
  elements.lotteryVeil.classList.add("is-active");
}

function finishLotteryAnimation() {
  elements.lotteryVeil.classList.remove("is-active");
  elements.lotteryVeil.classList.add("is-settling");
  window.setTimeout(() => {
    elements.lotteryVeil.classList.add("hidden");
    elements.lotteryVeil.classList.remove("is-settling");
  }, 780);
}

function renderComparison(country, baselineCountry) {
  const visibleMetrics = getVisibleMetrics();
  const missingCount = visibleMetrics.filter(
    (m) => country[m.key] == null || baselineCountry?.[m.key] == null
  ).length;
  renderComparisonWarning(missingCount, visibleMetrics.length);

  elements.comparisonGrid.innerHTML = getComparisonRowsMarkup(visibleMetrics, ({ metric, categoryLabel }) => {
    const candidate = country[metric.key];
    const baseline = baselineCountry?.[metric.key];
    const tone = compareMetric(candidate, baseline, metric.betterDirection);
    const deltaLabel = buildDeltaLabel(metric, candidate, baseline, baselineCountry?.name);
    const directionLabel = buildDirectionLabel(country.name, baselineCountry?.name || "Paese selezionato", candidate, baseline, metric.betterDirection);

    return `
      <article class="comparison-row" role="row" data-tone="${tone}">
        <div class="comparison-row-head">
          <div class="comparison-indicator">
            <strong>${metric.label}</strong>
            <small class="metric-desc">${metric.detail}</small>
          </div>
        </div>
        <div class="comparison-values">
          <div class="comparison-value comparison-value-country">
            <span class="comparison-value-label">${renderCountryLabelMarkup(country)}</span>
            <strong class="${toneClass(tone)}">${formatMetric(metric.key, country)}</strong>
          </div>
          <div class="comparison-value comparison-value-baseline">
            <span class="comparison-value-label">${renderCountryLabelMarkup(baselineCountry || { iso2: "", name: "Paese di confronto" })}</span>
            <strong>${formatMetric(metric.key, baselineCountry || {})}</strong>
          </div>
        </div>
        <div class="comparison-delta">
          <span class="comparison-outcome comparison-outcome-${tone}">${escapeHtml(directionLabel)}</span>
          <strong class="${toneClass(tone)}">${deltaLabel}</strong>
        </div>
      </article>
    `;
  });
}

function getVisibleMetrics() {
  return METRIC_CONFIG;
}

function getComparisonRowsMarkup(metrics, renderRow) {
  let currentCategory = null;
  const chunks = [];
  for (const metric of metrics) {
    if (metric.category !== currentCategory) {
      currentCategory = metric.category;
      chunks.push(`
        <div class="comparison-group" role="presentation">
          <span>${escapeHtml(currentCategory)}</span>
        </div>
      `);
    }
    chunks.push(renderRow({ metric, categoryLabel: currentCategory }));
  }
  return chunks.join("");
}

function buildDeltaLabel(metric, candidate, baseline, baselineName = "il paese selezionato") {
  if (candidate == null || baseline == null) return "Confronto non disponibile";
  const delta = candidate - baseline;
  const absoluteDelta = Math.abs(delta);
  if (absoluteDelta < 0.05) return `Quasi uguale a ${baselineName}`;

  const countryAhead = metric.betterDirection === "higher" ? delta > 0 : delta < 0;
  const relation = countryAhead ? "in più" : "in meno";

  switch (metric.key) {
    case "lifeExpectancy":
    case "expectedSchooling":
      return `${formatNumber(absoluteDelta, 1)} anni ${relation}`;
    case "gdpPerCapita":
    case "gdpPerCapitaPpp":
    case "healthExpenditure":
      return `${formatCurrency(absoluteDelta)} ${relation}`;
    case "internetUsers":
    case "povertyRate":
    case "womenInParliament":
    case "literacyRate":
    case "outOfPocketHealth":
      return `${formatNumber(absoluteDelta, 1)} punti ${relation}`;
    case "infantMortality":
    case "under5Mortality":
      return `${formatNumber(absoluteDelta, 1)} ${countryAhead ? "in meno" : "in più"} ogni 1.000`;
    case "maternalMortality":
      return `${formatNumber(absoluteDelta, 0)} ${countryAhead ? "in meno" : "in più"} ogni 100.000`;
    case "intentionalHomicides":
      return `${formatNumber(absoluteDelta, 2)} ${countryAhead ? "in meno" : "in più"} per 100.000`;
    case "giniIndex":
      return `${formatNumber(absoluteDelta, 1)} punti ${relation}`;
    default:
      return `${formatNumber(absoluteDelta, 1)} ${relation}`;
  }
}

function compareMetric(candidate, baseline, betterDirection) {
  if (candidate == null || baseline == null) return "neutral";
  if (Math.abs(candidate - baseline) < 0.05) return "neutral";
  if (betterDirection === "higher") return candidate > baseline ? "better" : "worse";
  return candidate < baseline ? "better" : "worse";
}

function renderComparisonWarning(missingCount, totalCount) {
  if (!missingCount) {
    elements.comparisonWarning.classList.add("hidden");
    elements.comparisonWarning.textContent = "";
    return;
  }
  elements.comparisonWarning.classList.remove("hidden");
  elements.comparisonWarning.textContent =
    missingCount >= 2
      ? `Lettura parziale: ${missingCount} indicatori su ${totalCount} non sono pienamente confrontabili.`
      : `Nota di lettura: ${missingCount} indicatore su ${totalCount} non è pienamente confrontabile.`;
}

function buildDirectionLabel(countryName, baselineName, candidate, baseline, betterDirection) {
  if (candidate == null || baseline == null) return "Confronto incompleto";
  const delta = Math.abs(candidate - baseline);
  if (delta < 0.05) return "Molto simile";
  const countryBetter = betterDirection === "higher" ? candidate > baseline : candidate < baseline;
  return countryBetter ? `${countryName} avanti` : `${baselineName} avanti`;
}

function renderInsights(country, baselineCountry) {
  const scoringMetrics = getScoringMetrics();
  const tones = [];
  const impacts = [];

  for (const metric of scoringMetrics) {
    const candidate = country[metric.key];
    const baseline = baselineCountry?.[metric.key];
    const tone = compareMetric(candidate, baseline, metric.betterDirection);
    if (tone !== "neutral") tones.push(tone);
    const impact = computeImpact(candidate, baseline);
    if (impact != null) impacts.push({ metric, impact, candidate, baseline });
  }

  const score = buildScore(tones);
  elements.resultInsights.classList.remove("hidden");
  elements.insightScoreLabel.textContent = score.label;
  elements.insightScoreDetail.textContent = score.detail;

  const top = impacts.sort((a, b) => b.impact - a.impact).slice(0, 2);
  if (!top.length) {
    elements.insightTopDiffs.innerHTML = "<li>Dati insufficienti per evidenziare differenze forti.</li>";
    return;
  }

  elements.insightTopDiffs.innerHTML = top.map(({ metric, candidate, baseline }) => {
    const delta = buildDeltaLabel(metric, candidate, baseline, baselineCountry?.name || "il paese selezionato");
    return `<li><strong>${metric.label}</strong>: ${delta} rispetto a ${baselineCountry?.name || "il paese selezionato"}.</li>`;
  }).join("");
}

function getScoringMetrics() {
  return METRIC_CONFIG.filter((metric) => {
    const coverage = getMetricCoverage(metric.key);
    return coverage.ratio >= 0.6;
  });
}

function buildScore(tones) {
  const better = tones.filter((t) => t === "better").length;
  const worse = tones.filter((t) => t === "worse").length;
  const net = better - worse;

  if (net >= 2) return { label: "Partenza tendenzialmente favorita", detail: `Segnali positivi prevalenti (${better} migliori, ${worse} peggiori).` };
  if (net <= -2) return { label: "Partenza tendenzialmente in salita", detail: `Criticità prevalenti (${better} migliori, ${worse} peggiori).` };
  return { label: "Partenza con luci e ombre", detail: `Quadro equilibrato (${better} migliori, ${worse} peggiori).` };
}

function computeImpact(candidate, baseline) {
  if (candidate == null || baseline == null) return null;
  const normalized = Math.abs(candidate - baseline) / Math.max(Math.abs(baseline), 1);
  return Number.isFinite(normalized) ? normalized : null;
}

function getMetricConfidence(country, metricKey) {
  const year = country?.metricDetails?.[metricKey]?.year;
  const parsedYear = Number(year);
  if (!Number.isFinite(parsedYear)) {
    return { level: "unknown", label: "Stima prudente", title: "Anno non disponibile" };
  }
  const age = new Date().getFullYear() - parsedYear;
  if (age <= 2) return { level: "high", label: "Dato recente", title: `Base aggiornata (${parsedYear})` };
  if (age <= 5) return { level: "medium", label: "Dato stabile", title: `Base solida (${parsedYear})` };
  return { level: "low", label: "Dato storico", title: `Base datata (${parsedYear})` };
}

// ─── ANIMATIONS ──────────────────────────────────────────

function triggerBirthFlash() {
  const flash = document.createElement("div");
  flash.className = "birth-flash";
  document.body.appendChild(flash);
  flash.addEventListener("animationend", () => flash.remove(), { once: true });
}

function addRipple(button, event) {
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  const ripple = document.createElement("span");
  ripple.className = "btn-ripple";
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

function triggerParticleBurst(buttonEl) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = buttonEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#a855f7","#06b6d4","#f97316","#ec4899"];
  const count = 22;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = "particle";
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const speed = 60 + Math.random() * 130;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    const size = 5 + Math.random() * 8;
    const delay = Math.random() * 60;
    dot.style.cssText = `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;background:${colors[i % colors.length]};--dx:${dx.toFixed(1)}px;--dy:${dy.toFixed(1)}px;animation-delay:${delay}ms`;
    document.body.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
  }
}

// ─── WEIGHTED PICK ───────────────────────────────────────

function weightedPick(countries) {
  if (!countries.length || state.totalBirths <= 0) return null;
  const threshold = Math.random() * state.totalBirths;
  let running = 0;
  for (const country of countries) {
    running += country.annualBirths;
    if (running >= threshold) return country;
  }
  return countries[countries.length - 1];
}

function buildMetricStats(countries) {
  const stats = {};
  for (const metric of METRIC_CONFIG) {
    const sortedCountries = countries
      .filter((country) => country[metric.key] != null)
      .slice()
      .sort((left, right) => {
        const a = left[metric.key];
        const b = right[metric.key];
        return metric.betterDirection === "higher" ? b - a : a - b;
      });

    stats[metric.key] = {
      available: sortedCountries.length,
      ratio: countries.length ? sortedCountries.length / countries.length : 0,
      total: countries.length,
      betterDirection: metric.betterDirection,
      sortedCountries,
    };
  }
  return stats;
}

function buildBirthRankIndex(countries) {
  return new Map(countries.map((country, index) => [country.iso3, index + 1]));
}

function getMetricCoverage(metricKey) {
  const stats = state.metricStats[metricKey];
  const available = stats?.available || 0;
  const total = stats?.total || state.countries.length || 0;
  const ratio = stats?.ratio || 0;
  return {
    available,
    total,
    ratio,
    label: `Copertura ${available}/${total}`,
  };
}

// ─── SANITIZE ────────────────────────────────────────────

function sanitizeCountries(countries) {
  const sanitized = countries.map(sanitizeCountry).filter(Boolean);
  const totalBirths = sanitized.reduce((s, c) => s + c.annualBirths, 0);
  if (!totalBirths) return [];
  return sanitized
    .map((c) => ({ ...c, birthShare: c.annualBirths / totalBirths }))
    .sort((a, b) => b.annualBirths - a.annualBirths);
}

function sanitizeCountry(country) {
  if (!country || typeof country !== "object") return null;
  const name = sanitizeText(country.name);
  const iso3 = sanitizeText(country.iso3);
  const annualBirths = sanitizePositiveNumber(country.annualBirths);
  const population = sanitizePositiveNumber(country.population);
  if (!name || !iso3 || annualBirths == null || population == null) return null;
  const metricDetails = country.metricDetails && typeof country.metricDetails === "object"
    ? country.metricDetails : {};
  return {
    ...country, name, iso3, annualBirths, population, metricDetails,
    lifeExpectancy: sanitizeMetric(country.lifeExpectancy),
    infantMortality: sanitizeMetric(country.infantMortality),
    gdpPerCapita: sanitizeMetric(country.gdpPerCapita),
    internetUsers: sanitizeMetric(country.internetUsers),
    povertyRate: sanitizeMetric(country.povertyRate),
  };
}

function sanitizeText(v) { return typeof v === "string" ? v.trim() : ""; }
function sanitizePositiveNumber(v) {
  return typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null;
}
function sanitizeMetric(v) {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

// ─── FORMATTERS ──────────────────────────────────────────

function formatMetric(metricKey, country) {
  const config = METRIC_CONFIG.find((m) => m.key === metricKey);
  const value = country[metricKey];
  return value == null ? "N/D" : config.formatter(value);
}

function formatPercent(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);
}

function formatPercentFromWhole(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value);
}

function formatInteger(value) {
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value, decimals = 1) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(value);
}

function toneClass(tone) {
  if (tone === "better") return "tone-better";
  if (tone === "worse") return "tone-worse";
  return "tone-neutral";
}

function metricPercentile(index, total) {
  if (total <= 1) return 1;
  return (total - index - 1) / (total - 1);
}

function ordinalLabel(value) {
  if (!Number.isFinite(value)) return "Posizione n/d";
  return `${formatInteger(value)}°`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ─── BIRTH STREAM ─────────────────────────────────────────

const STREAM_BIRTHS_PER_SEC = 4.43;
const STREAM_MAX_CELLS = 120;

const streamState = {
  running: false,
  paused: false,
  speed: 1,
  totalShown: 0,
  pointer: 0,
  cells: [],
  rafId: null,
  lastTimestamp: null,
  accumulator: 0,
  firstCycleDone: false,
};

function initBirthStream() {
  const openBtn = document.getElementById("birth-stream-open");
  const activator = document.getElementById("birth-stream-activator");
  const panel = document.getElementById("birth-stream-panel");
  const pauseBtn = document.getElementById("birth-stream-pause");
  const closeBtn = document.getElementById("birth-stream-close");
  const grid = document.getElementById("birth-stream-grid");
  if (!openBtn || !panel || !grid || !pauseBtn || !closeBtn || !activator) return;

  for (let i = 0; i < STREAM_MAX_CELLS; i++) {
    const cell = document.createElement("div");
    cell.className = "birth-cell birth-cell-empty";
    cell.setAttribute("aria-hidden", "true");
    grid.appendChild(cell);
    streamState.cells.push(cell);
  }

  openBtn.addEventListener("click", () => {
    panel.classList.remove("hidden");
    activator.classList.add("hidden");
    startStream();
  });

  closeBtn.addEventListener("click", () => {
    stopStream();
    panel.classList.add("hidden");
    activator.classList.remove("hidden");
    resetStream();
  });

  pauseBtn.addEventListener("click", () => {
    if (streamState.paused) {
      resumeStream();
      pauseBtn.textContent = "Pausa";
    } else {
      pauseStream();
      pauseBtn.textContent = "Riprendi";
    }
  });

}

function startStream() {
  streamState.running = true;
  streamState.paused = false;
  streamState.lastTimestamp = null;
  streamState.accumulator = 0;
  streamState.rafId = requestAnimationFrame(streamLoop);
}

function stopStream() {
  streamState.running = false;
  if (streamState.rafId) {
    cancelAnimationFrame(streamState.rafId);
    streamState.rafId = null;
  }
}

function pauseStream() {
  streamState.paused = true;
  if (streamState.rafId) {
    cancelAnimationFrame(streamState.rafId);
    streamState.rafId = null;
  }
}

function resumeStream() {
  streamState.paused = false;
  streamState.lastTimestamp = null;
  streamState.rafId = requestAnimationFrame(streamLoop);
}

function resetStream() {
  streamState.totalShown = 0;
  streamState.pointer = 0;
  streamState.accumulator = 0;
  streamState.firstCycleDone = false;
  streamState.cells.forEach((c) => {
    c.className = "birth-cell birth-cell-empty";
    c.textContent = "";
    c.title = "";
  });
  const counter = document.getElementById("birth-stream-counter");
  if (counter) counter.textContent = "0 nati";
}

function streamLoop(timestamp) {
  if (!streamState.running || streamState.paused) return;

  if (streamState.lastTimestamp !== null) {
    const delta = (timestamp - streamState.lastTimestamp) / 1000;
    streamState.accumulator += delta * STREAM_BIRTHS_PER_SEC * streamState.speed;
    const toAdd = Math.floor(streamState.accumulator);
    if (toAdd > 0) {
      streamState.accumulator -= toAdd;
      const cap = Math.min(toAdd, 25);
      for (let i = 0; i < cap; i++) spawnBirth();
      updateStreamCounter();
    }
  }

  streamState.lastTimestamp = timestamp;
  streamState.rafId = requestAnimationFrame(streamLoop);
}

function spawnBirth() {
  if (!state.countries.length) return;
  const country = weightedPick(state.countries);
  if (!country) return;

  streamState.totalShown++;

  const cell = streamState.cells[streamState.pointer];
  streamState.pointer = (streamState.pointer + 1) % STREAM_MAX_CELLS;

  if (!streamState.firstCycleDone && streamState.pointer === 0 && streamState.totalShown > 0) {
    streamState.firstCycleDone = true;
    streamState.totalShown = 0;
    streamState.cells.forEach((c) => {
      c.className = "birth-cell birth-cell-empty";
      c.textContent = "";
      c.title = "";
    });
    updateStreamCounter();
  }

  cell.classList.remove("birth-cell-empty");

  // Alternate animation name to restart without triggering reflow
  const useA = !cell.classList.contains("birth-pop-a");
  cell.classList.remove("birth-pop-a", "birth-pop-b");
  cell.classList.add(useA ? "birth-pop-a" : "birth-pop-b");

  cell.textContent = countryFlagEmoji(country);
  cell.title = country.name;
}

function updateStreamCounter() {
  const counter = document.getElementById("birth-stream-counter");
  if (!counter) return;
  const n = streamState.totalShown;
  counter.textContent = formatInteger(n) + (n === 1 ? " nato" : " nati");
}
