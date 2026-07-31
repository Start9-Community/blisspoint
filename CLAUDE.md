# Instruktioner för Claude

## ⛔ VIKTIGAST AV ALLT: SLUTA ORDBAJSA

Marcus är inte utvecklare. Ordbajsande — facktermer, förkortningar, PR-nummer,
branch-namn, verktygsprat, långa utläggningar — är HELT VÄRDELÖST och saknar
syfte i kommunikationen. Det har kostat timmar av frustration.

Varje svar ska klara detta test:
- **Vad hände?** En mening, vardagssvenska.
- **Vad ska Marcus göra?** Numrerade steg, eller "ingenting".
- **Inget mer.** Ingen bakgrund, inga alternativ, ingen teknik om han inte frågar.

Fel: "Bumpade dep till 0.7.2, mappade is_mining → paused, PR #69 draft, CI grön."
Rätt: "Uppdateringen är klar. Du behöver testa paus-knappen på din miner — jag
säger till när filen finns att ladda ner."

## Grundregler

- Gör jobbet själv. Lägg inte arbete på användaren.
- Svara kort och utan facktermer.
- När något ska byggas, mergas, pushas eller triggas – gör det direkt.
- Fråga bara när det är absolut nödvändigt för att kunna gå vidare.
- Gate:a aldrig något Marcus redan beställt bakom ett godkännande.
- Skapa ALDRIG en riktig release för att testa något — använd test-bygget
  (fil att ladda ner, ingen publicering).

## Projekt

ASIC-miner-monitor byggd i React/Vite. En Rust-tjänst (`proxy-rs`) sköter all
kommunikation med minern via biblioteket asic-rs och lyssnar på 127.0.0.1:8081;
`server/serve.cjs` serverar gränssnittet och skickar `/api/*` vidare dit.

## Releaseflöde

1. Bumpa version i `startos/versions/current.ts` och Docker-taggen i `startos/manifest/index.ts`.
2. Bumpa `version` i `umbrel/blisspoint/umbrel-app.yml` + image-taggen i `umbrel/blisspoint/docker-compose.yml`, och spegla till repot `heatpunk/umbrel-app-store`.
3. Bumpa `version` i `blisspoint-addon/config.yaml` (Home Assistant hämtar imagen med versionen som tagg) och i `custom_components/blisspoint/manifest.json`.
4. Committa och pusha till `main`.
5. Trigga `release.yml` via `workflow_dispatch` – den packar `blisspoint.s9pk` mot den redan publicerade imagen och skapar en GitHub Release automatiskt. Den bygger ingen Docker-image.
