# Birth Lottery

`Birth Lottery` e una web app che prova a rendere concreta una domanda semplice: se nascessi oggi, dove avresti davvero piu probabilita di venire al mondo?

Il sorteggio non usa la popolazione totale come peso, ma una stima delle **nascite annuali reali** per ciascun paese. In questo modo l'esperienza racconta la *lotteria della nascita* in termini piu fedeli alla distribuzione attuale delle nascite nel mondo.

## MVP attuale

- Usa un dataset locale generato da dati recenti della World Bank.
- Stima le nascite annuali con la formula `popolazione x tasso di natalita / 1000`.
- Estrae un paese in modo pesato su quella distribuzione.
- Confronta il paese estratto con l'Italia su alcuni indicatori medi.
- Mostra `anno` e `fonte` per ogni metrica mostrata in UI.
- Integra `HDI` da UNDP e `poverta nazionale` da World Bank.
- Mostra i principali paesi per quota stimata di nascite mondiali.

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
- `GE.EST` Worldwide Governance Indicators: Rule of Law (estimate)
- `SH.XPD.OOPC.CH.ZS` Out-of-pocket expenditure (% of current health expenditure)
- `SH.UHC.SRVS.CV.XD` UHC service coverage index
- `GDIM.YOSM` Global Database on Intergenerational Mobility: years of schooling mobility estimate (copertura discontinua)

Fonte aggiuntiva:

- [UNDP Human Development Reports Data Center](https://hdr.undp.org/data-center/human-development-index#/indicies/HDI)

Fonte principale:

- [World Bank Data API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation)

## Perche questo approccio

L'idea del progetto non e "giocare" con la geografia, ma far sentire quanto il punto di partenza dipenda da una distribuzione fortemente diseguale. Confrontare ogni esito con l'Italia rende il messaggio immediato: in molti casi una nuova nascita implicherebbe condizioni medie piu difficili, nonostante la normalita con cui percepiamo il nostro contesto.

## Limiti della prima versione

- Alcuni indicatori World Bank non sono disponibili con la stessa copertura per tutti i paesi.
- Le nascite annuali sono stimate, non lette da una serie unica gia pronta.
- Il confronto usa una selezione di proxy utili, ma non esaurisce il tema di poverta, diritti, sicurezza o accesso ai servizi.
- La UI e pensata come MVP concettuale, non ancora come prodotto completo.

## Come avviare il progetto

Essendo una SPA statica, basta servire la cartella con un piccolo server locale.

### Opzione Python

```bash
python3 -m http.server 4173
```

Poi apri:

- [http://localhost:4173](http://localhost:4173)

## Struttura del progetto

- [index.html](/Users/tonga/Documents/GitHub/birth-lottery/index.html)
- [styles.css](/Users/tonga/Documents/GitHub/birth-lottery/styles.css)
- [app.js](/Users/tonga/Documents/GitHub/birth-lottery/app.js)
- [data.js](/Users/tonga/Documents/GitHub/birth-lottery/data.js)
- [scripts/generate-data.mjs](/Users/tonga/Documents/GitHub/birth-lottery/scripts/generate-data.mjs)
- [scripts/extract-undp-hdi.py](/Users/tonga/Documents/GitHub/birth-lottery/scripts/extract-undp-hdi.py)

## Aggiornare il dataset

Il repository contiene gia un dataset locale pronto all'uso in `data.js`.

Lo script [scripts/generate-data.mjs](/Users/tonga/Documents/GitHub/birth-lottery/scripts/generate-data.mjs) serve per rigenerarlo a partire dalle esportazioni World Bank e dal file ufficiale UNDP sull'HDI. In questa prima iterazione l'ho usato per congelare una base dati stabile, cosi l'app non dipende dal supporto `fetch` del browser in cui viene aperta.

## Evoluzioni consigliate

- Aggiungere indicatori di poverta e sviluppo umano con una seconda fonte dedicata, ad esempio UNDP o Our World in Data.
- Permettere il confronto con un paese scelto dall'utente, non solo con l'Italia.
- Mostrare anche una mappa e una simulazione multipla di 100 o 1.000 nascite.
- Esplicitare anno e copertura di ogni metrica direttamente nella UI.
- Introdurre un punteggio narrativo piu prudente e trasparente, evitando semplificazioni moralistiche.
