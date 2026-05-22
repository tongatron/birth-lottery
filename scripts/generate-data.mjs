import { access, readFile, writeFile } from "node:fs/promises";

const FILES = {
  countries: "/private/tmp/birth-lottery-countries.json",
  population: "/private/tmp/birth-lottery-population.json",
  birthRate: "/private/tmp/birth-lottery-birthrate.json",
  lifeExpectancy: "/private/tmp/birth-lottery-life.json",
  infantMortality: "/private/tmp/birth-lottery-infant.json",
  gdpPerCapita: "/private/tmp/birth-lottery-gdp.json",
  internetUsers: "/private/tmp/birth-lottery-internet.json",
  povertyRate: "/private/tmp/birth-lottery-poverty.json",
  internetItaly: "/private/tmp/birth-lottery-internet-ita.json",
  literacyRate: "/private/tmp/birth-lottery-literacy.json",
  under5Mortality: "/private/tmp/birth-lottery-under5.json",
  healthExpenditure: "/private/tmp/birth-lottery-health.json",
  giniIndex: "/private/tmp/birth-lottery-gini.json",
  gdpPerCapitaPpp: "/private/tmp/birth-lottery-gdp-ppp.json",
  intentionalHomicides: "/private/tmp/birth-lottery-homicide.json",
  ruleOfLawEstimate: "/private/tmp/birth-lottery-rule-of-law.json",
  outOfPocketHealth: "/private/tmp/birth-lottery-oop-health.json",
  uhcCoverageIndex: "/private/tmp/birth-lottery-uhc.json",
  intergenerationalMobility: "/private/tmp/birth-lottery-ig-mobility.json",
  baselineData: "/private/tmp/birth-lottery-baseline-data.js",
};

async function loadJson(path) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}

async function loadJsonIfExists(path) {
  try {
    await access(path);
  } catch {
    console.warn(`Optional source missing: ${path}`);
    return null;
  }
  return loadJson(path);
}

async function loadBaselineCountries(path) {
  try {
    const raw = await readFile(path, "utf8");
    const match = raw.match(/window\.BIRTH_LOTTERY_DATA\s*=\s*(\{[\s\S]*\});\s*$/);
    if (!match) return [];
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed?.countries) ? parsed.countries : [];
  } catch {
    return [];
  }
}

function applyBaselineFallback(countryIndex, baselineCountries, keys) {
  if (!baselineCountries.length) return;
  const byIso3 = new Map(baselineCountries.map((c) => [c.iso3, c]));
  for (const country of Object.values(countryIndex)) {
    const base = byIso3.get(country.iso3);
    if (!base) continue;
    const baseDetails = base.metricDetails && typeof base.metricDetails === "object"
      ? base.metricDetails
      : {};
    for (const key of keys) {
      if (country.metrics[key]?.value != null) continue;
      const baseValue = base[key];
      if (baseValue == null) continue;
      country.metrics[key] = {
        value: Number(baseValue),
        year: String(baseDetails[key]?.year || "n/d"),
        source: baseDetails[key]?.source || "Baseline dataset fallback",
      };
    }
  }
}

function buildCountryIndex(rows) {
  return rows.reduce((index, row) => {
    if (row.region?.value === "Aggregates") {
      return index;
    }

    index[row.id] = {
      iso3: row.id,
      iso2: row.iso2Code,
      name: row.name,
      region: row.region?.value || "N/D",
      income: row.incomeLevel?.value || "N/D",
      metrics: {},
    };
    return index;
  }, {});
}

function parseRowYear(row) {
  const parsed = Number(row?.date);
  return Number.isFinite(parsed) ? parsed : -Infinity;
}

function shouldReplaceMetric(existing, candidateYear) {
  if (!existing) return true;
  const existingYear = Number(existing.year);
  if (!Number.isFinite(existingYear)) return true;
  return candidateYear >= existingYear;
}

function applyMetric(countryIndex, rows, key, source = "World Bank Data API") {
  for (const row of rows) {
    const target = countryIndex[row.countryiso3code];
    if (!target || row.value == null) {
      continue;
    }

    const candidateYear = parseRowYear(row);
    if (!shouldReplaceMetric(target.metrics[key], candidateYear)) {
      continue;
    }

    target.metrics[key] = {
      value: Number(row.value),
      year: row.date,
      source,
    };
  }
}

function normalizeCountryName(value) {
  return value
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .replaceAll(/&/g, " and ")
    .replaceAll(/[()'.’,-]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function buildNormalizedNameIndex(countryIndex) {
  return Object.values(countryIndex).reduce((index, country) => {
    index[normalizeCountryName(country.name)] = country;
    return index;
  }, {});
}

function buildMetricDetails(country) {
  const details = {
    population: country.metrics.population || null,
    birthRate: country.metrics.birthRate || null,
    lifeExpectancy: country.metrics.lifeExpectancy || null,
    infantMortality: country.metrics.infantMortality || null,
    gdpPerCapita: country.metrics.gdpPerCapita || null,
    internetUsers: country.metrics.internetUsers || null,
    povertyRate: country.metrics.povertyRate || null,
  };
  if (country.metrics.literacyRate) details.literacyRate = country.metrics.literacyRate;
  if (country.metrics.under5Mortality) details.under5Mortality = country.metrics.under5Mortality;
  if (country.metrics.healthExpenditure) details.healthExpenditure = country.metrics.healthExpenditure;
  if (country.metrics.giniIndex) details.giniIndex = country.metrics.giniIndex;
  if (country.metrics.gdpPerCapitaPpp) details.gdpPerCapitaPpp = country.metrics.gdpPerCapitaPpp;
  if (country.metrics.intentionalHomicides) details.intentionalHomicides = country.metrics.intentionalHomicides;
  if (country.metrics.ruleOfLawEstimate) details.ruleOfLawEstimate = country.metrics.ruleOfLawEstimate;
  if (country.metrics.outOfPocketHealth) details.outOfPocketHealth = country.metrics.outOfPocketHealth;
  if (country.metrics.uhcCoverageIndex) details.uhcCoverageIndex = country.metrics.uhcCoverageIndex;
  if (country.metrics.intergenerationalMobility) details.intergenerationalMobility = country.metrics.intergenerationalMobility;
  return details;
}

function applyCountryOverride(countryIndex, response, key, source = "World Bank Data API") {
  const rows = response?.[1];
  if (!Array.isArray(rows)) {
    return;
  }

  applyMetric(countryIndex, rows, key, source);
}

function logMetricCoverage(countryIndex, metricMap) {
  const countries = Object.values(countryIndex);
  for (const [key, label] of Object.entries(metricMap)) {
    const available = countries.filter((country) => country.metrics[key]?.value != null).length;
    console.log(`${label}: ${available}/${countries.length}`);
    if (available > 0 && available / countries.length < 0.15) {
      console.warn(`Low coverage for ${label}: check the source export or query window.`);
    }
  }
}

async function main() {
  const [
    countries,
    population,
    birthRate,
    lifeExpectancy,
    infantMortality,
    gdpPerCapita,
    internetUsers,
    povertyRate,
    internetItaly,
    literacyRate,
    under5Mortality,
    healthExpenditure,
    giniIndex,
    gdpPerCapitaPpp,
    intentionalHomicides,
    ruleOfLawEstimate,
    outOfPocketHealth,
    uhcCoverageIndex,
    intergenerationalMobility,
  ] = await Promise.all([
    loadJson(FILES.countries),
    loadJson(FILES.population),
    loadJson(FILES.birthRate),
    loadJson(FILES.lifeExpectancy),
    loadJson(FILES.infantMortality),
    loadJson(FILES.gdpPerCapita),
    loadJson(FILES.internetUsers),
    loadJson(FILES.povertyRate),
    loadJsonIfExists(FILES.internetItaly),
    loadJsonIfExists(FILES.literacyRate),
    loadJsonIfExists(FILES.under5Mortality),
    loadJsonIfExists(FILES.healthExpenditure),
    loadJsonIfExists(FILES.giniIndex),
    loadJsonIfExists(FILES.gdpPerCapitaPpp),
    loadJsonIfExists(FILES.intentionalHomicides),
    loadJsonIfExists(FILES.ruleOfLawEstimate),
    loadJsonIfExists(FILES.outOfPocketHealth),
    loadJsonIfExists(FILES.uhcCoverageIndex),
    loadJsonIfExists(FILES.intergenerationalMobility),
  ]);
  const baselineCountries = await loadBaselineCountries(FILES.baselineData);

  const countryIndex = buildCountryIndex(countries[1]);

  applyMetric(countryIndex, population[1], "population");
  applyMetric(countryIndex, birthRate[1], "birthRate");
  applyMetric(countryIndex, lifeExpectancy[1], "lifeExpectancy");
  applyMetric(countryIndex, infantMortality[1], "infantMortality");
  applyMetric(countryIndex, gdpPerCapita[1], "gdpPerCapita");
  applyMetric(countryIndex, internetUsers[1], "internetUsers");
  applyMetric(countryIndex, povertyRate[1], "povertyRate");
  applyCountryOverride(countryIndex, internetItaly, "internetUsers");
  if (literacyRate?.[1]) {
    applyMetric(countryIndex, literacyRate[1], "literacyRate");
  }
  if (under5Mortality?.[1]) {
    applyMetric(countryIndex, under5Mortality[1], "under5Mortality");
  }
  if (healthExpenditure?.[1]) {
    applyMetric(countryIndex, healthExpenditure[1], "healthExpenditure");
  }
  if (giniIndex?.[1]) {
    applyMetric(countryIndex, giniIndex[1], "giniIndex");
  }
  if (gdpPerCapitaPpp?.[1]) {
    applyMetric(countryIndex, gdpPerCapitaPpp[1], "gdpPerCapitaPpp");
  }
  if (intentionalHomicides?.[1]) {
    applyMetric(countryIndex, intentionalHomicides[1], "intentionalHomicides");
  }
  if (ruleOfLawEstimate?.[1]) {
    applyMetric(countryIndex, ruleOfLawEstimate[1], "ruleOfLawEstimate");
  }
  if (outOfPocketHealth?.[1]) {
    applyMetric(countryIndex, outOfPocketHealth[1], "outOfPocketHealth");
  }
  if (uhcCoverageIndex?.[1]) {
    applyMetric(countryIndex, uhcCoverageIndex[1], "uhcCoverageIndex");
  }
  if (intergenerationalMobility?.[1]) {
    applyMetric(countryIndex, intergenerationalMobility[1], "intergenerationalMobility");
  }
  applyBaselineFallback(countryIndex, baselineCountries, [
    "literacyRate",
    "under5Mortality",
    "healthExpenditure",
    "giniIndex",
    "gdpPerCapitaPpp",
    "intentionalHomicides",
    "ruleOfLawEstimate",
    "outOfPocketHealth",
    "uhcCoverageIndex",
    "intergenerationalMobility",
  ]);

  const dataset = Object.values(countryIndex)
    .map((country) => {
      const populationValue = country.metrics.population?.value || 0;
      const birthRateValue = country.metrics.birthRate?.value || 0;
      const annualBirths = (populationValue * birthRateValue) / 1000;

      const output = {
        iso3: country.iso3,
        iso2: country.iso2,
        name: country.name,
        region: country.region,
        income: country.income,
        metricDetails: buildMetricDetails(country),
        population: populationValue,
        birthRate: birthRateValue,
        annualBirths,
        lifeExpectancy: country.metrics.lifeExpectancy?.value ?? null,
        infantMortality: country.metrics.infantMortality?.value ?? null,
        gdpPerCapita: country.metrics.gdpPerCapita?.value ?? null,
        internetUsers: country.metrics.internetUsers?.value ?? null,
        povertyRate: country.metrics.povertyRate?.value ?? null,
      };
      if (country.metrics.literacyRate?.value != null) {
        output.literacyRate = country.metrics.literacyRate.value;
      }
      if (country.metrics.under5Mortality?.value != null) {
        output.under5Mortality = country.metrics.under5Mortality.value;
      }
      if (country.metrics.healthExpenditure?.value != null) {
        output.healthExpenditure = country.metrics.healthExpenditure.value;
      }
      if (country.metrics.giniIndex?.value != null) {
        output.giniIndex = country.metrics.giniIndex.value;
      }
      if (country.metrics.gdpPerCapitaPpp?.value != null) {
        output.gdpPerCapitaPpp = country.metrics.gdpPerCapitaPpp.value;
      }
      if (country.metrics.intentionalHomicides?.value != null) {
        output.intentionalHomicides = country.metrics.intentionalHomicides.value;
      }
      if (country.metrics.ruleOfLawEstimate?.value != null) {
        output.ruleOfLawEstimate = country.metrics.ruleOfLawEstimate.value;
      }
      if (country.metrics.outOfPocketHealth?.value != null) {
        output.outOfPocketHealth = country.metrics.outOfPocketHealth.value;
      }
      if (country.metrics.uhcCoverageIndex?.value != null) {
        output.uhcCoverageIndex = country.metrics.uhcCoverageIndex.value;
      }
      if (country.metrics.intergenerationalMobility?.value != null) {
        output.intergenerationalMobility = country.metrics.intergenerationalMobility.value;
      }
      return output;
    })
    .filter((country) => country.iso3 && country.annualBirths > 0)
    .sort((left, right) => right.annualBirths - left.annualBirths);

  const totalBirths = dataset.reduce(
    (sum, country) => sum + country.annualBirths,
    0
  );

  for (const country of dataset) {
    country.birthShare = country.annualBirths / totalBirths;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "World Bank Data API + supplemental sources",
    totalBirths,
    countries: dataset,
  };

  const output = `window.BIRTH_LOTTERY_DATA = ${JSON.stringify(payload, null, 2)};\n`;
  await writeFile(new URL("../data.js", import.meta.url), output, "utf8");

  logMetricCoverage(countryIndex, {
    population: "population",
    birthRate: "birthRate",
    lifeExpectancy: "lifeExpectancy",
    infantMortality: "infantMortality",
    gdpPerCapita: "gdpPerCapita",
    internetUsers: "internetUsers",
    povertyRate: "povertyRate",
    literacyRate: "literacyRate",
    under5Mortality: "under5Mortality",
    healthExpenditure: "healthExpenditure",
    giniIndex: "giniIndex",
    gdpPerCapitaPpp: "gdpPerCapitaPpp",
    intentionalHomicides: "intentionalHomicides",
    ruleOfLawEstimate: "ruleOfLawEstimate",
    outOfPocketHealth: "outOfPocketHealth",
    uhcCoverageIndex: "uhcCoverageIndex",
    intergenerationalMobility: "intergenerationalMobility",
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
