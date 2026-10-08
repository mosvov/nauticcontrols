# Research Brief: Hat Labs Community Feedback (for internet research agent)

**Use this as the full prompt for a research agent with web access.**  
**Repo:** `/private/var/www/nauticcontrols`  
**Local context (read first, lightly — do not rewrite strategy docs):** `docs/` folder listed below.

---

## Prompt (copy below)

You are a market-research agent with internet access. Research **current public opinion** of **Hat Labs** (Hat Labs Oy, Helsinki; founder Matti Airas; shop `shop.hatlabs.fi`; docs `docs.hatlabs.fi`) across Reddit, marine/DIY forums, Signal K / OpenPlotter communities, GitHub discussions, and similar.

### Who we are (minimal context)

**Nautic Controls** (Florida, USA) plans to become a **US stocking reseller** of Hat Labs hardware via Shopify (headless Next.js store in this repo). Problem we solve: Finland shipping to US takes ~2 weeks and costs a lot on small orders. Pilot PO ~**€1,865** of Hat Labs boards + enclosures + M12/SP13 pigtails. Kits (board + enclosure + connectors) + domestic sensors/cables. We buy **only Hat Labs proprietary SKUs** from Matti; Waveshare/OLED/DS18B20/generic N2K cable from **China/US**, not via Finland.

### Local docs — skim for strategy/SKU names only

Path: `/private/var/www/nauticcontrols/docs/`

| File | What it is |
| --- | --- |
| `context-hat-labs-partnership.md` | Partnership strategy, pilot order, pricing, checklist |
| `context-shopify-us-store.md` | Shopify US store intent |
| `context-sourcing-hatlabs-vs-china.md` | Why Cat 2/3 accessories not ordered from Hat Labs |
| `draft-pilot-order-analysis.md` | Draft PO, P&L, sell-through, email to Matti |
| `moskalyk-2026-09-25.csv` / `.pdf` | Official wholesale price list |
| `reseller-annex.pdf` / `reseller-terms.pdf` | Draft contract (v0.2) — legal only, skip for sentiment |

**Pilot SKUs to watch in community chatter:** SH-ESP32, HALMET, HALSER, SH-RPi / Sailor Hat, HALPI / HALPI2, SensESP, Signal K, NMEA 2000.

### Research sources (search all you can)

- Reddit: r/sailing, r/boating, r/Sailboat, r/SignalK (if any), r/raspberry_pi, r/esp32, r/NMEA, related
- Cruisers Forum, Panbo, SailNet, ContinuousWave, Practical Boat Owner comments
- Signal K Slack/Discord archives or public forum posts; OpenPlotter / OpenCPN threads
- GitHub: `hatlabs/*`, SensESP, SH-ESP32, HALMET issues/discussions
- YouTube / blog reviews if substantive
- Hat Labs own docs/shop comments only as secondary

Search terms ideas: `Hat Labs`, `hatlabs`, `SH-ESP32`, `HALMET`, `HALPI`, `HALPI2`, `Sailor Hat` Raspberry Pi, `SensESP`, `Matti Airas`, `shop.hatlabs.fi`.

Prefer **2023–2026** posts; note older history if still relevant. Cite **links + dates** for every claim.

### Questions to answer

1. **What do people think of Hat Labs overall?** Trust, quality, support, open-source angle, price vs Yacht Devices / Actisense / DIY.
2. **What’s good?** Reliability, N2K isolation, docs, community, firmware ecosystem (SensESP / Signal K), value.
3. **What’s bad / friction?** Stockouts, lead times, international shipping/customs, developer-board (no FW) expectation mismatch, support limits, bugs, CM5/HALPI2 availability, steep learning curve.
4. **What sells / gets recommended most?** Rank products by mention frequency and enthusiasm (SH-ESP32 vs HALMET vs SH-RPi vs HALPI/HALPI2 vs HALSER). Note “wish I could buy in US” or shipping complaints.
5. **Fit with our strategy:** Does US stock + kits + faster shipping address real complaints? Risks (DIY complexity, support burden, competing with free DIY)? What kit positioning resonates vs overselling as Actisense clones?
6. **Competitors people compare to:** Yacht Devices, Actisense, Digital Yacht, Victron Cerbo, generic ESP32/Pi DIY.

### Deliverable format

Write a concise research summary:

1. **Executive take** (5–8 sentences)
2. **Sentiment table** (product or theme → positive / negative / neutral + evidence links)
3. **Best-mentioned / likely demand winners** (ranked, with caveats)
4. **Implications for Nautic Controls** (what to stock first, how to market kits, support expectations, what *not* to claim)
5. **Open gaps** (what you couldn’t find online)
6. **Source list** (URLs)

Do **not** invent quotes. If evidence is thin, say so. Do **not** change local docs unless asked — research output only.

---

## After research

Save agent output as e.g. `docs/research-hatlabs-community-feedback.md` (optional) and update partnership GTM notes only if findings change bestsellers or kit messaging.
