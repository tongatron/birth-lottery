const METRIC_CONFIG = [
  {
    key: "lifeExpectancy",
    label: "Aspettativa di vita",
    formatter: (value) => formatNumber(value, 1) + " anni",
    betterDirection: "higher",
    detail: "anni medi di vita alla nascita",
  },
  {
    key: "infantMortality",
    label: "Mortalita infantile",
    formatter: (value) => formatNumber(value, 1),
    betterDirection: "lower",
    detail: "decessi sotto 1 anno ogni 1.000 nati vivi",
  },
  {
    key: "gdpPerCapita",
    label: "PIL pro capite",
    formatter: (value) => formatCurrency(value),
    betterDirection: "higher",
    detail: "dollari correnti per persona",
  },
  {
    key: "internetUsers",
    label: "Accesso a internet",
    formatter: (value) => formatNumber(value, 1) + "%",
    betterDirection: "higher",
    detail: "quota di popolazione con accesso alla rete",
  },
  {
    key: "hdi",
    label: "Human Development Index",
    formatter: (value) => formatNumber(value, 3),
    betterDirection: "higher",
    detail: "indice sintetico di sviluppo umano",
  },
  {
    key: "povertyRate",
    label: "Poverta nazionale",
    formatter: (value) => formatNumber(value, 1) + "%",
    betterDirection: "lower",
    detail: "quota di popolazione sotto la soglia nazionale",
  },
];

const state = {
  countries: [],
  totalBirths: 0,
  italy: null,
  isRolling: false,
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
  italyLife: document.querySelector("#italy-life"),
  italyLifeMeta: document.querySelector("#italy-life-meta"),
  italyInfant: document.querySelector("#italy-infant"),
  italyInfantMeta: document.querySelector("#italy-infant-meta"),
  italyGdp: document.querySelector("#italy-gdp"),
  italyGdpMeta: document.querySelector("#italy-gdp-meta"),
  italyInternet: document.querySelector("#italy-internet"),
  italyInternetMeta: document.querySelector("#italy-internet-meta"),
  italyHdi: document.querySelector("#italy-hdi"),
  italyHdiMeta: document.querySelector("#italy-hdi-meta"),
  italyPoverty: document.querySelector("#italy-poverty"),
  italyPovertyMeta: document.querySelector("#italy-poverty-meta"),
  comparisonWarning: document.querySelector("#comparison-warning"),
  comparisonGrid: document.querySelector("#comparison-grid"),
  distributionList: document.querySelector("#distribution-list"),
};

boot();

async function boot() {
  try {
    const dataset = window.BIRTH_LOTTERY_DATA;
    const ranked = sanitizeCountries(dataset?.countries || []);
    const totalBirths = ranked.reduce((sum, country) => sum + country.annualBirths, 0);

    if (!ranked.length || !totalBirths) {
      throw new Error("Dataset locale non disponibile.");
    }

    const italy = ranked.find((country) => country.iso3 === "ITA");

    if (!italy) {
      throw new Error("Italia non trovata nel dataset.");
    }

    state.countries = ranked;
    state.totalBirths = totalBirths;
    state.italy = italy;

    hydrateItalyBaseline(italy);
    renderDistribution(ranked.slice(0, 10));
    renderPlaceholderComparison();

    elements.drawButton.disabled = false;
    elements.drawButton.textContent = "Avvia la lotteria";
    elements.statusText.textContent =
      "Dati caricati da fonti ufficiali. Il sorteggio e pronto.";

    elements.drawButton.addEventListener("click", rollLottery);
  } catch (error) {
    console.error(error);
    elements.statusText.textContent =
      "Impossibile recuperare i dati. Controlla la connessione e ricarica la pagina.";
    elements.drawButton.textContent = "Ricarica la pagina";
  }
}

function hydrateItalyBaseline(italy) {
  elements.italyLife.textContent = formatMetric("lifeExpectancy", italy);
  elements.italyLifeMeta.textContent = formatMetricMeta("lifeExpectancy", italy);
  elements.italyInfant.textContent = formatMetric("infantMortality", italy);
  elements.italyInfantMeta.textContent = formatMetricMeta("infantMortality", italy);
  elements.italyGdp.textContent = formatMetric("gdpPerCapita", italy);
  elements.italyGdpMeta.textContent = formatMetricMeta("gdpPerCapita", italy);
  elements.italyInternet.textContent = formatMetric("internetUsers", italy);
  elements.italyInternetMeta.textContent = formatMetricMeta("internetUsers", italy);
  elements.italyHdi.textContent = formatMetric("hdi", italy);
  elements.italyHdiMeta.textContent = formatMetricMeta("hdi", italy);
  elements.italyPoverty.textContent = formatMetric("povertyRate", italy);
  elements.italyPovertyMeta.textContent = formatMetricMeta("povertyRate", italy);
}

function renderDistribution(countries) {
  const highestShare = countries[0]?.birthShare || 0;
  const rows = countries
    .map((country) => {
      const width = highestShare ? (country.birthShare / highestShare) * 100 : 0;
      return `
        <div class="distribution-row">
          <strong>${escapeHtml(country.name)}</strong>
          <div class="distribution-bar" aria-hidden="true">
            <span style="width:${width.toFixed(1)}%"></span>
          </div>
          <span>${formatPercent(country.birthShare)}</span>
        </div>
      `;
    })
    .join("");

  elements.distributionList.innerHTML = rows;
}

function renderPlaceholderComparison() {
  elements.comparisonWarning.classList.add("hidden");
  elements.comparisonGrid.innerHTML = METRIC_CONFIG.map(
    (metric) => `
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
    `
  ).join("");
}

function rollLottery() {
  if (state.isRolling || !state.countries.length) {
    return;
  }

  state.isRolling = true;
  elements.drawButton.disabled = true;
  elements.drawButton.textContent = "Sorteggio in corso...";
  elements.statusText.textContent =
    "Il paese viene estratto in proporzione alle nascite annuali stimate.";

  const cycleCountries = sampleWithoutMeaning(state.countries, 18);
  if (!cycleCountries.length) {
    state.isRolling = false;
    elements.drawButton.disabled = false;
    elements.drawButton.textContent = "Avvia la lotteria";
    elements.statusText.textContent =
      "Dati incompleti per il sorteggio. Ricarica la pagina per riprovare.";
    return;
  }
  let cursor = 0;

  const ticker = setInterval(() => {
    const country = cycleCountries[cursor % cycleCountries.length];
    showRollingCountry(country);
    cursor += 1;
  }, 90);

  window.setTimeout(() => {
    clearInterval(ticker);
    const winner = weightedPick(state.countries);
    if (!winner) {
      state.isRolling = false;
      elements.drawButton.disabled = false;
      elements.drawButton.textContent = "Avvia la lotteria";
      elements.statusText.textContent =
        "Sorteggio non disponibile con i dati correnti.";
      return;
    }
    renderWinner(winner);
    state.isRolling = false;
    elements.drawButton.disabled = false;
    elements.drawButton.textContent = "Rinasci ancora";
    elements.statusText.textContent =
      "Puoi ripetere il sorteggio quante volte vuoi.";
  }, 1700);
}

function showRollingCountry(country) {
  elements.resultEmpty.classList.add("hidden");
  elements.resultCard.classList.remove("hidden");
  elements.resultInsights.classList.add("hidden");
  elements.resultCountry.textContent = country.name;
  elements.resultShare.textContent = formatPercent(country.birthShare);
  elements.resultBirths.textContent = formatInteger(country.annualBirths);
  elements.resultPopulation.textContent = formatInteger(country.population);
  elements.resultSummary.textContent =
    "Scorrimento in corso. Il risultato finale dipendera dal peso reale delle nascite.";
}

function renderWinner(country) {
  elements.resultEmpty.classList.add("hidden");
  elements.resultCard.classList.remove("hidden");
  elements.resultCountry.textContent = country.name;
  elements.resultShare.textContent = formatPercent(country.birthShare);
  elements.resultBirths.textContent = formatInteger(country.annualBirths);
  elements.resultPopulation.textContent = formatInteger(country.population);
  elements.resultSummary.textContent = buildSummary(country, state.italy);
  renderInsights(country, state.italy);
  renderComparison(country, state.italy);
}

function renderComparison(country, italy) {
  const missingCount = METRIC_CONFIG.filter(
    (metric) => country[metric.key] == null || italy[metric.key] == null
  ).length;
  renderComparisonWarning(missingCount, METRIC_CONFIG.length);

  const markup = METRIC_CONFIG.map((metric) => {
    const candidate = country[metric.key];
    const baseline = italy[metric.key];
    const tone = compareMetric(candidate, baseline, metric.betterDirection);
    const detail = buildMetricDetail(
      candidate,
      baseline,
      metric.betterDirection,
      metric.detail
    );
    const deltaLabel = buildDeltaLabel(
      candidate,
      baseline,
      metric.betterDirection,
      metric.detail
    );

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

  elements.comparisonGrid.innerHTML = markup;
}

function buildSummary(country, italy) {
  const comparisons = METRIC_CONFIG.map((metric) =>
    compareMetric(country[metric.key], italy[metric.key], metric.betterDirection)
  );
  const worseCount = comparisons.filter((value) => value === "worse").length;
  const betterCount = comparisons.filter((value) => value === "better").length;

  if (country.iso3 === "ITA") {
    return "In questo sorteggio saresti comunque nato in Italia. Ripetendolo, vedrai quanto sia rara questa coincidenza rispetto al resto del mondo.";
  }

  if (worseCount >= 3) {
    return `Rispetto a nascere in Italia, questo esito suggerisce condizioni medie piu difficili in diversi indicatori chiave. La lotteria della nascita cambia molto piu del solo paese sulla mappa.`;
  }

  if (betterCount >= 3) {
    return `Questo sorteggio porta verso un paese che supera l'Italia su diversi indicatori medi. La lotteria della nascita non distribuisce solo svantaggi: distribuisce anche vantaggi molto concentrati.`;
  }

  return `Il confronto con l'Italia e misto: alcuni indicatori migliorano, altri peggiorano. Anche senza estremi, il punto resta che nascere altrove cambia in modo concreto il punto di partenza.`;
}

function buildMetricDetail(candidate, baseline, betterDirection, suffix) {
  if (candidate == null || baseline == null) {
    return `Dato non disponibile in modo comparabile per ${suffix}.`;
  }

  const delta = candidate - baseline;
  const absoluteDelta = Math.abs(delta);
  const better =
    betterDirection === "higher" ? delta > 0 : delta < 0;

  if (absoluteDelta < 0.05) {
    return `Valore molto vicino a quello italiano per ${suffix}.`;
  }

  const toneText = better ? "Meglio" : "Peggio";
  const formattedDelta =
    suffix === "dollari correnti per persona"
      ? formatCurrency(absoluteDelta)
      : formatNumber(absoluteDelta, 1);

  return `${toneText} rispetto all'Italia di ${formattedDelta} per ${suffix}.`;
}

function buildDeltaLabel(candidate, baseline, betterDirection, suffix) {
  if (candidate == null || baseline == null) {
    return "N/D";
  }

  const delta = candidate - baseline;
  const absoluteDelta = Math.abs(delta);

  if (absoluteDelta < 0.05) {
    return "Allineato";
  }

  const formattedDelta =
    suffix === "dollari correnti per persona"
      ? formatCurrency(absoluteDelta)
      : formatNumber(absoluteDelta, 1);

  const positive =
    betterDirection === "higher" ? delta > 0 : delta < 0;

  return positive ? `+ ${formattedDelta}` : `- ${formattedDelta}`;
}

function compareMetric(candidate, baseline, betterDirection) {
  if (candidate == null || baseline == null) {
    return "neutral";
  }

  if (Math.abs(candidate - baseline) < 0.05) {
    return "neutral";
  }

  if (betterDirection === "higher") {
    return candidate > baseline ? "better" : "worse";
  }

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
      : `Nota di lettura: ${missingCount} indicatore su ${totalCount} non e pienamente confrontabile.`;
}

function renderInsights(country, italy) {
  const tones = [];
  const impacts = [];

  for (const metric of METRIC_CONFIG) {
    const candidate = country[metric.key];
    const baseline = italy[metric.key];
    const tone = compareMetric(candidate, baseline, metric.betterDirection);
    if (tone !== "neutral") {
      tones.push(tone);
    }

    const impact = computeImpact(candidate, baseline, metric.betterDirection);
    if (impact != null) {
      impacts.push({ metric, impact, candidate, baseline });
    }
  }

  const score = buildScore(tones);
  elements.resultInsights.classList.remove("hidden");
  elements.insightScoreLabel.textContent = score.label;
  elements.insightScoreDetail.textContent = score.detail;

  const top = impacts.sort((a, b) => b.impact - a.impact).slice(0, 2);
  if (!top.length) {
    elements.insightTopDiffs.innerHTML =
      "<li>Dati insufficienti per evidenziare differenze forti.</li>";
    return;
  }

  elements.insightTopDiffs.innerHTML = top
    .map(({ metric, candidate, baseline }) => {
      const delta = buildDeltaLabel(
        candidate,
        baseline,
        metric.betterDirection,
        metric.detail
      );
      return `<li><strong>${metric.label}</strong>: ${delta} rispetto all'Italia.</li>`;
    })
    .join("");
}

function buildScore(tones) {
  const better = tones.filter((tone) => tone === "better").length;
  const worse = tones.filter((tone) => tone === "worse").length;
  const net = better - worse;

  if (net >= 2) {
    return {
      label: "Partenza tendenzialmente favorita",
      detail: `Segnali positivi prevalenti (${better} migliori, ${worse} peggiori).`,
    };
  }

  if (net <= -2) {
    return {
      label: "Partenza tendenzialmente in salita",
      detail: `Criticita prevalenti (${better} migliori, ${worse} peggiori).`,
    };
  }

  return {
    label: "Partenza con luci e ombre",
    detail: `Quadro equilibrato (${better} migliori, ${worse} peggiori).`,
  };
}

function computeImpact(candidate, baseline, betterDirection) {
  if (candidate == null || baseline == null) {
    return null;
  }

  const rawDelta = candidate - baseline;
  const normalized = Math.abs(rawDelta) / Math.max(Math.abs(baseline), 1);
  if (!Number.isFinite(normalized)) {
    return null;
  }

  if (betterDirection === "lower") {
    return normalized;
  }
  return normalized;
}

function getMetricConfidence(country, metricKey) {
  const year = country?.metricDetails?.[metricKey]?.year;
  const parsedYear = Number(year);
  if (!Number.isFinite(parsedYear)) {
    return {
      level: "unknown",
      label: "Stima prudente",
      title: "Anno non disponibile: interpretazione prudente",
    };
  }

  const age = new Date().getFullYear() - parsedYear;
  if (age <= 2) {
    return { level: "high", label: "Dato recente", title: `Base informativa aggiornata (${parsedYear})` };
  }
  if (age <= 5) {
    return { level: "medium", label: "Dato stabile", title: `Base informativa solida ma non recentissima (${parsedYear})` };
  }
  return { level: "low", label: "Dato storico", title: `Base informativa piu datata (${parsedYear})` };
}

function weightedPick(countries) {
  if (!countries.length || state.totalBirths <= 0) {
    return null;
  }

  const threshold = Math.random() * state.totalBirths;
  let running = 0;

  for (const country of countries) {
    running += country.annualBirths;
    if (running >= threshold) {
      return country;
    }
  }

  return countries[countries.length - 1];
}

function sampleWithoutMeaning(countries, size) {
  const pool = [...countries];
  const sample = [];

  while (sample.length < size && pool.length) {
    const index = Math.floor(Math.random() * pool.length);
    sample.push(pool.splice(index, 1)[0]);
  }

  return sample;
}

function sanitizeCountries(countries) {
  const sanitized = countries
    .map((country) => sanitizeCountry(country))
    .filter(Boolean);

  const totalBirths = sanitized.reduce((sum, country) => sum + country.annualBirths, 0);
  if (!totalBirths) {
    return [];
  }

  return sanitized
    .map((country) => ({
      ...country,
      birthShare: country.annualBirths / totalBirths,
    }))
    .sort((a, b) => b.annualBirths - a.annualBirths);
}

function sanitizeCountry(country) {
  if (!country || typeof country !== "object") {
    return null;
  }

  const name = sanitizeText(country.name);
  const iso3 = sanitizeText(country.iso3);
  const annualBirths = sanitizePositiveNumber(country.annualBirths);
  const population = sanitizePositiveNumber(country.population);

  if (!name || !iso3 || annualBirths == null || population == null) {
    return null;
  }

  const metricDetails =
    country.metricDetails && typeof country.metricDetails === "object"
      ? country.metricDetails
      : {};

  return {
    ...country,
    name,
    iso3,
    annualBirths,
    population,
    metricDetails,
    lifeExpectancy: sanitizeMetric(country.lifeExpectancy),
    infantMortality: sanitizeMetric(country.infantMortality),
    gdpPerCapita: sanitizeMetric(country.gdpPerCapita),
    internetUsers: sanitizeMetric(country.internetUsers),
    hdi: sanitizeMetric(country.hdi),
    povertyRate: sanitizeMetric(country.povertyRate),
  };
}

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizePositiveNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

function sanitizeMetric(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return value;
}

function formatMetric(metricKey, country) {
  const config = METRIC_CONFIG.find((metric) => metric.key === metricKey);
  const value = country[metricKey];
  return value == null ? "N/D" : config.formatter(value);
}

function formatMetricMeta(metricKey, country) {
  const detail = country?.metricDetails?.[metricKey];
  if (!detail?.year && !detail?.source) {
    return "fonte non disponibile";
  }

  const yearLabel = detail.year || "anno n/d";
  const sourceLabel = shortenSource(detail.source);
  return `${yearLabel} · ${sourceLabel}`;
}

function formatPercent(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value) {
  return new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value, decimals = 1) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function shortenSource(value) {
  if (!value) {
    return "fonte n/d";
  }

  if (value === "World Bank Data API") {
    return "World Bank";
  }

  if (value === "UNDP Human Development Report 2025") {
    return "UNDP HDR 2025";
  }

  return value;
}

function toneClass(tone) {
  if (tone === "better") {
    return "tone-better";
  }
  if (tone === "worse") {
    return "tone-worse";
  }
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
