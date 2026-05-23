# Birth Lottery

`Birth Lottery` è una web app che prova a rendere concreta una domanda semplice: se nascessi oggi, dove avresti davvero più probabilità di venire al mondo?

Il sorteggio non usa la popolazione totale come peso, ma una stima delle **nascite annuali reali** per ciascun paese. In questo modo l'esperienza racconta la *lotteria della nascita* in termini più fedeli alla distribuzione attuale delle nascite nel mondo.

## Funzionalità attuali

- Sorteggio pesato sulle nascite annuali stimate (`popolazione × tasso di natalità / 1000`).
- Dataset locale generato da dati recenti della World Bank — nessuna dipendenza da `fetch` in runtime.
- Confronto tra il paese estratto e un paese di riferimento scelto dall'utente (default: Italia), selezionabile prima e dopo il sorteggio.
- Ogni indicatore nel pannello confronto mostra una breve descrizione del significato della metrica.
- Mappa mondiale con intensità colore proporzionale alla quota di nascite per paese.
- Sezione "Nascite nel mondo in tempo reale": griglia animata che simula le nascite al ritmo reale (~4,4 al secondo); si resetta automaticamente dopo il primo ciclo completo.
- Testo narrativo generato per ogni esito, calibrato sul reddito e sugli indicatori principali del paese estratto.
- Score sintetico e principali differenze rispetto al paese di confronto.
- `anno` e `fonte` tracciati per ogni metrica nel dataset.

## Indicatori usati

- `SP.POP.TOTL` Population, total
- `SP.DYN.CBRT.IN` Birth rate, crude (per 1,000 people)
- `SP.DYN.LE00.IN` Life expectancy at birth, total (years)
- `SP.DYN.IMRT.IN` Mortality rate, infant (per 1,000 live births)
- `NY.GDP.PCAP.CD` GDP per capita (current US$)
- `IT.NET.USER.ZS` Individuals using the Internet (% of population)
- `SI.POV.NAHC` Poverty headcount ratio at national poverty lines (% of population)
- `SI.POV.GINI` Gini index
- `NY.GDP.PCAP.PP.CD` GDP per capita, PPP (current international $)
- `VC.IHR.PSRC.P5` Intentional homicides (per 100,000 people)
- `SH.XPD.OOPC.CH.ZS` Out-of-pocket expenditure (% of current health expenditure)
- `SH.MMR.RISK.ZS` Maternal mortality ratio
- `SE.SCH.LIFE` School life expectancy
- `SE.ADT.LITR.ZS` Literacy rate, adult total

Fonte principale: [World Bank Data API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation)

## Come avviare il progetto

SPA statica — basta servire la cartella con un server locale.

```bash
python3 -m http.server 4173
```

Poi apri [http://localhost:4173](http://localhost:4173).

## Struttura del progetto

- `index.html` — struttura e markup
- `styles.css` — stili
- `app.js` — logica sorteggio, confronto, animazioni, birth stream
- `data.js` — dataset principale (generato)
- `extra-data.js` — indicatori supplementari (generato)
- `scripts/generate-data.mjs` — script per rigenerare i dataset

## Aggiornare il dataset

Il repository contiene già un dataset locale pronto all'uso in `data.js` e `extra-data.js`.

Lo script `scripts/generate-data.mjs` serve per rigenerarli a partire dalle API World Bank.

## Limiti noti

- Alcuni indicatori non hanno la stessa copertura geografica — i valori mancanti sono segnalati esplicitamente nell'interfaccia.
- Le nascite annuali sono stimate, non lette da una serie dedicata.
- Il confronto usa proxy utili ma non esaurisce il tema di povertà, diritti, sicurezza o accesso ai servizi.
