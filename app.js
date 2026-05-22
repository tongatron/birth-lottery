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
  },
  {
    key: "infantMortality",
    label: "Mortalità infantile",
    formatter: (v) => formatNumber(v, 1),
    betterDirection: "lower",
    detail: "decessi sotto 1 anno ogni 1.000 nati vivi",
  },
  {
    key: "gdpPerCapita",
    label: "PIL pro capite",
    formatter: (v) => formatCurrency(v),
    betterDirection: "higher",
    detail: "dollari correnti per persona",
  },
  {
    key: "internetUsers",
    label: "Accesso a internet",
    formatter: (v) => formatNumber(v, 1) + "%",
    betterDirection: "higher",
    detail: "quota di popolazione con accesso alla rete",
  },
  {
    key: "hdi",
    label: "Human Development Index",
    formatter: (v) => formatNumber(v, 3),
    betterDirection: "higher",
    detail: "indice sintetico di sviluppo umano",
  },
  {
    key: "povertyRate",
    label: "Povertà nazionale",
    formatter: (v) => formatNumber(v, 1) + "%",
    betterDirection: "lower",
    detail: "quota di popolazione sotto la soglia nazionale",
  },
  {
    key: "maternalMortality",
    label: "Mortalità materna",
    formatter: (v) => formatNumber(v, 0) + " / 100k",
    betterDirection: "lower",
    detail: "decessi materni ogni 100.000 nati vivi",
  },
  {
    key: "womenInParliament",
    label: "Donne in parlamento",
    formatter: (v) => formatNumber(v, 1) + "%",
    betterDirection: "higher",
    detail: "quota di seggi parlamentari femminili",
  },
  {
    key: "expectedSchooling",
    label: "Anni di istruzione attesi",
    formatter: (v) => formatNumber(v, 1) + " anni",
    betterDirection: "higher",
    detail: "anni di scuola attesi per un bambino",
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
};

const elements = {
  drawButton: document.querySelector("#draw-button"),
  statusText: document.querySelector("#status-text"),
  resultEmpty: document.querySelector("#result-empty"),
  resultCard: document.querySelector("#result-card"),
  resultCountry: document.querySelector("#result-country"),
  resultShare: document.querySelector("#result-share"),
  resultBirths: document.querySelector("#result-births"),
  resultPopulation: document.querySelector("#result-population"),
  resultSummary: document.querySelector("#result-summary"),
  resultInsights: document.querySelector("#result-insights"),
  insightScoreLabel: document.querySelector("#insight-score-label"),
  insightScoreDetail: document.querySelector("#insight-score-detail"),
  insightTopDiffs: document.querySelector("#insight-top-diffs"),
  comparisonWarning: document.querySelector("#comparison-warning"),
  comparisonGrid: document.querySelector("#comparison-grid"),
  distributionList: document.querySelector("#distribution-list"),
  italyBaseline: document.querySelector("#italy-baseline"),
  worldMap: document.querySelector("#world-map"),
  mapTooltip: document.querySelector("#map-tooltip"),
};

boot();

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

    hydrateItalyBaseline(italy);
    renderDistribution(ranked.slice(0, 10));
    renderPlaceholderComparison();

    elements.drawButton.disabled = false;
    elements.drawButton.textContent = "Avvia la lotteria";
    elements.statusText.textContent = "Dati caricati. Il sorteggio è pronto.";

    const probEl = document.querySelector("#italy-probability");
    if (probEl && italy.birthShare) {
      const oneIn = Math.round(1 / italy.birthShare);
      probEl.textContent = `L'Italia pesa il ${formatPercent(italy.birthShare)} delle nascite mondiali — 1 sorteggio su ${formatInteger(oneIn)}.`;
      probEl.classList.remove("hidden");
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
    if (num != null) birthByNumeric.set(String(num), c);
  }

  const colorScale = d3.scaleLinear()
    .domain([0, maxShare])
    .range(["#c8e6cc", "#1a8040"]);

  const paths = svg.selectAll("path.country-path")
    .data(countriesFeature.features)
    .join("path")
    .attr("class", (d) => {
      const c = birthByNumeric.get(String(d.id));
      return "country-path" + (c ? " has-data" : "");
    })
    .attr("d", path)
    .attr("fill", (d) => {
      const c = birthByNumeric.get(String(d.id));
      return c ? colorScale(c.birthShare) : null;
    })
    .attr("data-numeric", (d) => d.id);

  paths
    .on("mouseenter", function (event, d) {
      const c = birthByNumeric.get(String(d.id));
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
  const targetNum = String(ISO3_TO_NUMERIC[iso3] ?? "");

  paths.classed("country-winner", (d) => String(d.id) === targetNum);
}

function clearMapHighlight() {
  if (!state.mapReady || !state.mapPaths) return;
  state.mapPaths.paths.classed("country-winner", false);
}

// ─── LOTTERY ─────────────────────────────────────────────

function rollLottery() {
  if (state.isRolling || !state.countries.length) return;

  state.isRolling = true;
  elements.drawButton.disabled = true;
  elements.drawButton.textContent = "Sorteggio in corso…";
  elements.statusText.textContent =
    "Il paese viene estratto in proporzione alle nascite annuali stimate.";

  triggerBirthFlash();
  clearMapHighlight();

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasExisting = state.currentWinner != null;
  const EXIT_DURATION = (!prefersReduced && hasExisting) ? 240 : 0;

  if (!prefersReduced && hasExisting) {
    elements.resultCard.classList.add("result-exit");
  }

  window.setTimeout(() => {
    elements.resultCard.classList.remove("result-exit");
    elements.resultEmpty.classList.add("hidden");
    elements.resultCard.classList.remove("hidden");
    elements.resultInsights.classList.add("hidden");
    elements.resultCountry.classList.add("scrambling");

    const SCRAMBLE_DURATION = prefersReduced ? 0 : 1800;
    let scrambleHandle = null;
    if (!prefersReduced) {
      scrambleHandle = startScramble(elements.resultCountry);
    }

    window.setTimeout(() => {
      if (scrambleHandle) clearInterval(scrambleHandle);

      const winner = weightedPick(state.countries);
      if (!winner) {
        state.isRolling = false;
        elements.drawButton.disabled = false;
        elements.drawButton.textContent = "Avvia la lotteria";
        elements.statusText.textContent = "Sorteggio non disponibile con i dati correnti.";
        return;
      }

      renderWinner(winner);
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

      document.querySelector("#main-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, SCRAMBLE_DURATION);
  }, EXIT_DURATION);
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

function renderWinner(country) {
  elements.resultCountry.classList.remove("scrambling");
  elements.resultCountry.textContent = country.name;
  elements.resultShare.textContent = formatPercent(country.birthShare);
  elements.resultBirths.textContent = formatInteger(country.annualBirths);
  elements.resultPopulation.textContent = formatInteger(country.population);
  elements.resultSummary.textContent = buildNarrative(country, state.italy);
  renderInsights(country, state.italy);
  renderComparison(country, state.italy);
}

// ─── HYDRATE ─────────────────────────────────────────────

function hydrateItalyBaseline(italy) {
  const metrics = [
    { key: "lifeExpectancy", label: "Aspettativa di vita" },
    { key: "infantMortality", label: "Mortalità infantile" },
    { key: "gdpPerCapita", label: "PIL pro capite" },
    { key: "internetUsers", label: "Accesso a internet" },
    { key: "hdi", label: "HDI" },
    { key: "povertyRate", label: "Povertà nazionale" },
  ];

  elements.italyBaseline.innerHTML = metrics.map(({ key, label }) => `
    <div class="metric-chip">
      <span>${label}</span>
      <strong>${formatMetric(key, italy)}</strong>
      <small>${formatMetricMeta(key, italy)}</small>
    </div>
  `).join("");
}

function renderDistribution(countries) {
  const highestShare = countries[0]?.birthShare || 0;
  elements.distributionList.innerHTML = countries.map((c) => {
    const width = highestShare ? (c.birthShare / highestShare) * 100 : 0;
    return `
      <div class="distribution-row">
        <strong>${escapeHtml(c.name)}</strong>
        <div class="distribution-bar" aria-hidden="true">
          <span style="width:${width.toFixed(1)}%"></span>
        </div>
        <span>${formatPercent(c.birthShare)}</span>
      </div>
    `;
  }).join("");
}

function renderPlaceholderComparison() {
  elements.comparisonWarning.classList.add("hidden");
  elements.comparisonGrid.innerHTML = METRIC_CONFIG.map((metric) => `
    <article class="comparison-row" role="row" data-tone="neutral">
      <div class="comparison-indicator">
        <strong>${metric.label}</strong>
        <span>${metric.detail}</span>
      </div>
      <div class="comparison-value">
        <strong>-</strong>
        <span>Paese estratto</span>
      </div>
      <div class="comparison-value">
        <strong>-</strong>
        <span>Italia</span>
      </div>
      <div class="comparison-delta">
        <strong class="tone-neutral">In attesa</strong>
        <span>Avvia il sorteggio</span>
      </div>
    </article>
  `).join("");
}

// ─── COMPARISON ──────────────────────────────────────────

function renderComparison(country, italy) {
  const missingCount = METRIC_CONFIG.filter(
    (m) => country[m.key] == null || italy[m.key] == null
  ).length;
  renderComparisonWarning(missingCount, METRIC_CONFIG.length);

  elements.comparisonGrid.innerHTML = METRIC_CONFIG.map((metric) => {
    const candidate = country[metric.key];
    const baseline = italy[metric.key];
    const tone = compareMetric(candidate, baseline, metric.betterDirection);
    const detail = buildMetricDetail(candidate, baseline, metric.betterDirection, metric.detail);
    const deltaLabel = buildDeltaLabel(candidate, baseline, metric.betterDirection, metric.detail);
    const confidence = getMetricConfidence(country, metric.key);

    return `
      <article class="comparison-row" role="row" data-tone="${tone}">
        <div class="comparison-indicator">
          <strong>${metric.label}</strong>
          <span>${metric.detail}</span>
        </div>
        <div class="comparison-value">
          <strong class="${toneClass(tone)}">
            ${formatMetric(metric.key, country)}
            <span class="confidence-badge confidence-${confidence.level}" title="${confidence.title}">
              ${confidence.label}
            </span>
          </strong>
          <span>${escapeHtml(country.name)} · ${formatMetricMeta(metric.key, country)}</span>
        </div>
        <div class="comparison-value">
          <strong>${formatMetric(metric.key, italy)}</strong>
          <span>Italia · ${formatMetricMeta(metric.key, italy)}</span>
        </div>
        <div class="comparison-delta">
          <strong class="${toneClass(tone)}">${deltaLabel}</strong>
          <span>${detail}</span>
        </div>
      </article>
    `;
  }).join("");
}

function buildNarrative(country, italy) {
  if (country.iso3 === "ITA") {
    const share = italy.birthShare ? formatPercent(italy.birthShare) : "0,70%";
    return `Sei finito di nuovo in Italia: il paese da cui parti pesa appena ${share} delle nascite mondiali, eppure porta con sé aspettativa di vita sopra gli 83 anni, istruzione universale e uno dei sistemi sanitari più solidi d'Europa. Queste non sono certezze ovunque: sono privilegi statistici. Il ${share} dei nati nel mondo inizia la propria vita qui.`;
  }

  const incomeLevel = country.incomeLevel || "";
  const gdpC = country.gdpPerCapita;
  const gdpI = italy.gdpPerCapita;
  const lifeC = country.lifeExpectancy;
  const lifeI = italy.lifeExpectancy;
  const imC = country.infantMortality;
  const imI = italy.infantMortality;
  const mmC = country.maternalMortality;
  const mmI = italy.maternalMortality;
  const povC = country.povertyRate;
  const birthSharePct = country.birthShare ? formatPercent(country.birthShare) : null;

  // Frase 1: collocazione geografica ed economica
  let sentence1 = "";
  const incomeLower = incomeLevel.toLowerCase();
  if (incomeLower.includes("high")) {
    const gdpStr = gdpC != null && gdpI != null && gdpC / gdpI >= 0.5
      ? ` con un PIL pro capite di ${formatCurrency(gdpC)}`
      : "";
    sentence1 = `${country.name} è un paese ad alto reddito${gdpStr}, collocato tra le economie più avanzate del pianeta.`;
  } else if (incomeLower.includes("upper")) {
    const gdpStr = gdpC != null ? ` e un PIL pro capite attorno a ${formatCurrency(gdpC)}` : "";
    sentence1 = `${country.name} si trova nella fascia dei redditi medio-alti${gdpStr}, in una posizione di transizione tra il Sud e il Nord globale.`;
  } else if (incomeLower.includes("lower middle") || incomeLower.includes("lower-middle")) {
    sentence1 = `${country.name} appartiene alla fascia dei redditi medio-bassi, dove la crescita economica coesiste con fragilità strutturali ancora significative.`;
  } else if (incomeLower.includes("low")) {
    sentence1 = `${country.name} è classificato tra i paesi a basso reddito, dove le condizioni di partenza alla nascita restano tra le più difficili al mondo.`;
  } else {
    const gdpStr = gdpC != null ? ` Il PIL pro capite si attesta attorno a ${formatCurrency(gdpC)}.` : "";
    sentence1 = `${country.name} è un paese con una collocazione economica intermedia nel panorama globale.${gdpStr}`;
  }

  // Frase 2: fatto più impattante con numero reale
  let sentence2 = "";
  const lifeDiff = (lifeC != null && lifeI != null) ? (lifeI - lifeC) : null;
  const imRatio = (imC != null && imI != null && imI > 0) ? (imC / imI) : null;
  const mmRatio = (mmC != null && mmI != null && mmI > 0) ? (mmC / mmI) : null;

  if (lifeDiff != null && lifeDiff >= 5) {
    sentence2 = `Chi nasce qui vive in media ${formatNumber(lifeDiff, 1)} anni in meno rispetto a chi nasce in Italia: l'aspettativa di vita si ferma a ${formatNumber(lifeC, 1)} anni.`;
  } else if (lifeDiff != null && lifeDiff <= -5) {
    sentence2 = `L'aspettativa di vita raggiunge ${formatNumber(lifeC, 1)} anni, superando l'Italia di ${formatNumber(Math.abs(lifeDiff), 1)} anni: un dato che riflette condizioni sanitarie e sociali solide.`;
  } else if (imRatio != null && imRatio >= 3) {
    sentence2 = `La mortalità infantile è ${formatNumber(imC, 1)} decessi ogni mille nati vivi — più di ${formatNumber(imRatio, 0)} volte il valore italiano — una distanza che misura in modo diretto la qualità del sistema sanitario alla nascita.`;
  } else if (mmRatio != null && mmRatio >= 5) {
    sentence2 = `Con ${formatNumber(mmC, 0)} decessi materni ogni 100.000 nati vivi, il rischio legato alla gravidanza e al parto è ${formatNumber(mmRatio, 0)} volte più alto che in Italia.`;
  } else if (povC != null && povC >= 30) {
    sentence2 = `Quasi ${formatNumber(povC, 1)}% della popolazione vive sotto la soglia di povertà nazionale: un dato che indica quanto sia diffusa l'insicurezza economica quotidiana.`;
  } else if (gdpC != null && gdpI != null && gdpI > 0 && gdpC / gdpI < 0.15) {
    sentence2 = `Il PIL pro capite è di ${formatCurrency(gdpC)}, meno del 15% di quello italiano: una distanza che si traduce in risorse pubbliche, infrastrutture e opportunità concrete per chi ci nasce.`;
  } else if (lifeDiff != null && Math.abs(lifeDiff) >= 2) {
    const dir = lifeDiff > 0 ? "meno" : "più";
    sentence2 = `L'aspettativa di vita è di ${formatNumber(lifeC, 1)} anni, circa ${formatNumber(Math.abs(lifeDiff), 1)} anni ${dir} rispetto all'Italia: una differenza che riflette le condizioni complessive del sistema paese.`;
  } else if (mmC != null) {
    sentence2 = `La mortalità materna è di ${formatNumber(mmC, 0)} ogni 100.000 nati vivi, un indicatore che sintetizza l'accesso e la qualità dell'assistenza sanitaria nel momento più critico.`;
  } else {
    sentence2 = `Gli indicatori disponibili delineano un contesto con caratteristiche proprie, che si discostano in vario grado dalle condizioni medie dell'Europa occidentale.`;
  }

  // Frase 3: punch con birthShare
  const shareStr = birthSharePct || "una quota ridotta";
  const sentence3 = `Il ${shareStr} dei nati nel mondo inizia la propria vita qui.`;

  return `${sentence1} ${sentence2} ${sentence3}`;
}

function mergeExtraData(countries) {
  const extra = window.BIRTH_LOTTERY_EXTRA;
  if (!extra || typeof extra !== "object") return;
  for (const country of countries) {
    const extraEntry = extra[country.iso3];
    if (!extraEntry) continue;
    if (extraEntry.maternalMortality != null) {
      country.maternalMortality = extraEntry.maternalMortality;
      country.metricDetails = country.metricDetails || {};
      country.metricDetails.maternalMortality = { year: 2020, source: "World Bank" };
    }
    if (extraEntry.womenInParliament != null) {
      country.womenInParliament = extraEntry.womenInParliament;
      country.metricDetails = country.metricDetails || {};
      country.metricDetails.womenInParliament = { year: 2023, source: "World Bank" };
    }
    if (extraEntry.expectedSchooling != null) {
      country.expectedSchooling = extraEntry.expectedSchooling;
      country.metricDetails = country.metricDetails || {};
      country.metricDetails.expectedSchooling = { year: 2023, source: "UNDP HDR 2023" };
    }
  }
}

function buildMetricDetail(candidate, baseline, betterDirection, suffix) {
  if (candidate == null || baseline == null) {
    return `Dato non disponibile in modo comparabile per ${suffix}.`;
  }
  const delta = candidate - baseline;
  const absoluteDelta = Math.abs(delta);
  if (absoluteDelta < 0.05) {
    return `Valore molto vicino a quello italiano per ${suffix}.`;
  }
  const better = betterDirection === "higher" ? delta > 0 : delta < 0;
  const toneText = better ? "Meglio" : "Peggio";
  const formattedDelta =
    suffix === "dollari correnti per persona"
      ? formatCurrency(absoluteDelta)
      : formatNumber(absoluteDelta, 1);
  return `${toneText} rispetto all'Italia di ${formattedDelta} per ${suffix}.`;
}

function buildDeltaLabel(candidate, baseline, betterDirection, suffix) {
  if (candidate == null || baseline == null) return "N/D";
  const delta = candidate - baseline;
  const absoluteDelta = Math.abs(delta);
  if (absoluteDelta < 0.05) return "Allineato";
  const formattedDelta =
    suffix === "dollari correnti per persona"
      ? formatCurrency(absoluteDelta)
      : formatNumber(absoluteDelta, 1);
  const positive = betterDirection === "higher" ? delta > 0 : delta < 0;
  return positive ? `+ ${formattedDelta}` : `− ${formattedDelta}`;
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

function renderInsights(country, italy) {
  const tones = [];
  const impacts = [];

  for (const metric of METRIC_CONFIG) {
    const candidate = country[metric.key];
    const baseline = italy[metric.key];
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
    const delta = buildDeltaLabel(candidate, baseline, metric.betterDirection, metric.detail);
    return `<li><strong>${metric.label}</strong>: ${delta} rispetto all'Italia.</li>`;
  }).join("");
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
    hdi: sanitizeMetric(country.hdi),
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

function formatMetricMeta(metricKey, country) {
  const detail = country?.metricDetails?.[metricKey];
  if (!detail?.year && !detail?.source) return "fonte non disponibile";
  const yearLabel = detail.year || "anno n/d";
  const sourceLabel = shortenSource(detail.source);
  return `${yearLabel} · ${sourceLabel}`;
}

function formatPercent(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2,
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

function shortenSource(value) {
  if (!value) return "fonte n/d";
  if (value === "World Bank Data API") return "World Bank";
  if (value === "UNDP Human Development Report 2025") return "UNDP HDR 2025";
  return value;
}

function toneClass(tone) {
  if (tone === "better") return "tone-better";
  if (tone === "worse") return "tone-worse";
  return "tone-neutral";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
