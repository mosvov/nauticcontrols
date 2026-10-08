# Draft Purchase Order — Hat Labs Pilot Stock (US Resale)

**Prepared:** 2026-09-27  
**Buyer:** Volodymyr Moskalyk / Nautic Controls (Florida, USA)  
**Supplier:** Hat Labs Oy · `info@hatlabs.fi`  
**Price list:** `moskalyk-2026-09-25` (net EUR, ex-VAT)  
**FX assumption:** **1.00 EUR = 1.10 USD** (recheck on wire day)  
**Status:** DRAFT for review — not yet sent / not confirmed by Hat Labs

---

## 1. What this order is for

Stock ~€1.8–1.9k of Hat Labs hardware in the US so Nautic Controls can sell via Shopify (this repo) with domestic shipping, instead of customers ordering from Finland (~2 weeks + high freight).

**Verified against:** wholesale CSV/PDF, Reseller Terms/Annex (draft), live `shop.hatlabs.fi`, US marine retail comps (2026-09-27).

---

## 2. Recommended line items (kit-balanced)

Original §6 mix left **connectors short** for kits (only 15× M12 → max 15 gateway kits from 25 boards; only 10× SP13 → max 10 engine kits from 15 HALMET).  

**Recommended draft** keeps board counts, adds connectors so you can build **20 gateway kits + 12 engine kits**:

| # | Item code | Description | Qty | Unit EUR | Subtotal EUR | Est. USD @1.10 |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 1 | `DEV-SHESP32-2` | SH-ESP32 Sales Package | **25** | 18.98 | 474.50 | 522 |
| 2 | `DEV-HALMET-1` | HALMET Sales Package | **15** | 23.36 | 350.40 | 385 |
| 3 | `COM-HALPI2-04-256` | HALPI2 Computer (4GB, 256GB) | **1** | 294.49 | 294.49 | 324 |
| 4 | `DEV-HALSER-1` | HALSER Sales Package | **8** | 23.36 | 186.88 | 206 |
| 5 | `MOD-SHRPI-2` | SH-RPi Sales Package | **4** | 35.04 | 140.16 | 154 |
| 6 | `ECK-PW100-FH` | Enclosure 100×68×50 mm, flanges | **20** | 6.97 | 139.40 | 153 |
| 7 | `ECK-PW158-H` | Enclosure 158×90×60 mm, pre-drilled | **12** | 9.30 | 111.60 | 123 |
| 8 | `CX-M12-PM5A-PW200` | N2K M12 panel connector pigtail | **25** | 4.11 | 102.75 | 113 |
| 9 | `CXP-SP13-CF2-PW200` | SP13 2-pin power pigtail pair | **15** | 4.31 | 64.65 | 71 |
| | **GOODS TOTAL** | | **125** | | **€1,864.83** | **~$2,051** |

### vs original plan (€1,802.18)

| | Original | **Recommended** |
| --- | ---: | ---: |
| Goods | €1,802.18 | **€1,864.83** (+€62.65) |
| Max gateway kits | 15 | **20** |
| Max engine kits | 10 | **12** |
| Bare boards left after kits | 10 SH-ESP32 + 5 HALMET | **5 SH-ESP32 + 3 HALMET** |

### Not in goods total (ask on pro-forma)

| Cost | Estimate | Notes |
| --- | --- | --- |
| International freight (DAP at cost) | **~$100–180** | Confirm with Matti; used **$132** mid in models |
| US import duty / MPF | **~$0–50?** | Electronics often low/0; confirm with broker |
| USB-C programming leads (local) | ~$3 × kits | Not sold by Hat Labs on this list |
| Packaging / labels | TBD | Local |

**Planning investment (goods + mid freight): ~$2,180–2,250 USD** before duty/packaging.

---

## 3. Cross-check: wholesale vs FI web vs US market

### Board / computer — your cost vs Finland web

| SKU | Your unit (EUR) | FI web (inc VAT, live) | FI ex-VAT ≈ | Your discount vs live ex-VAT | FI → US customer pain |
| --- | ---: | ---: | ---: | ---: | --- |
| SH-ESP32 | €18.98 | €32.63 | ~€26.00 | ~**27%** | +~€35–45 freight, ~2 weeks |
| HALMET | €23.36 | €40.16 | ~€32.00 | ~**27%** | same |
| HALSER | €23.36 | €48.58 | ~€38.71 | ~**40%** | same |
| SH-RPi | €35.04 | €75.30 | ~€60.00 | ~**42%** | same |
| HALPI2 4/256 | €294.49 | page shows €579.91 (config varies) | config-dependent | ~25% on list math | same + CM5 scarcity |

**Takeaway:** Your wholesale is solid. FI “40% off” marketing is **wrong for SH-ESP32/HALMET at current web prices** (~27%). HALSER / SH-RPi still look steeply discounted.

### How to price in the US (recommended shelf)

| Offer | Suggested USD retail | Your landed ≈ | Gross before fees | US / FI reference |
| --- | ---: | ---: | ---: | --- |
| **Gateway kit** (SH-ESP32 + enc100 + M12 + USB) | **$89.99** | ~$38 | ~58% | Yacht Devices YDWG-02 **$249**; iKonvert ~$215–250; Actisense Wi-Fi gateways higher. *Different product* (DIY/SensESP vs finished Wi-Fi gateway) — price on “kit + docs,” not clone claim. |
| **Engine kit** (HALMET + enc158 + SP13) | **$139.99** | ~$43 | ~69% | Actisense EMU-1 **~$475–$683**. Again: DIY vs certified finished gateway. |
| SH-ESP32 bare | **$49** | ~$22 | ~55% | FI ex-VAT ~$29 + freight; US stock wins on speed |
| HALMET bare | **$59** | ~$27 | ~54% | FI ex-VAT ~$35 + freight |
| HALSER bare | **$59** | ~$27 | ~54% | FI USD listing ~$46 |
| SH-RPi bare | **$79** | ~$41 | ~48% | FI ~$72–75 |
| HALPI2 4GB/256 | **$449** | ~$346 landed w/ freight share | ~23% | Cerbo GX MK2 street **~$273** — *not a substitute*; position as marine CM5 / Signal K server. FI HALPI2 page ~€580 inc VAT for some configs. |
| Enclosure / connector spares | $15–25 | cost+ | filler | optional add-ons |

---

## 4. Investment → revenue → profit (modeled)

Assumptions: FX 1.10 · freight $132 · Shopify ~2.9% · USB $3/kit · **sell all recommended stock** at prices above · kits-first allocation.

| | Amount |
| --- | ---: |
| Goods (EUR) | €1,864.83 |
| Goods (USD) | ~$2,051 |
| + Freight (est.) | ~$132 |
| + USB leads (20 kits) | ~$60 |
| **Cash out (est.)** | **~$2,243** |
| **Gross sales if sold out** | **~$5,259** |
| − Payment fees ~2.9% | ~$152 |
| **Est. net profit** | **~$2,860** |
| Margin on sales | ~**54%** |
| ROI on cash out | ~**128%** |

### Sensitivity

| Scenario | What changes | Approx. profit |
| --- | --- | --- |
| Kits-first (base above) | Full sell-out at target prices | **~$2,860** |
| No kits (bare boards + accessories only) | Lower ASP, simpler ops | **~$2,000–2,200** |
| Freight $200 + 5% duty | Higher landed | Profit **−$150–250** |
| Soft pricing (−15% retail) | Clearance / slow demand | Profit **~$1,900–2,100** |
| Only 50% of stock sells | Capital stuck | Profit on sold half only; rest = inventory risk |

**HALPI2 alone:** ~$449 − ~$346 landed − fees ≈ **~$90–100** contribution — fine as demo/flagship, not the profit engine. **Kits + volume boards** carry the return.

---

## 5. Expected sell-through time

Niche: Signal K / DIY marine / maker boaters. Not Actisense-volume retail.

| Pace | Units / month (mixed) | Time to clear ~53 primary units | Conditions |
| --- | ---: | ---: | --- |
| **Optimistic** | 8 | **~6–7 months** | Strong content, Signal K Slack/forums, boat-show or YouTube, kits ship with FW |
| **Base** | 4–5 | **~10–12 months** | Shopify live + organic/search + some community posts |
| **Conservative** | 2–3 | **~18 months** | Soft launch, little marketing, DIY-only positioning |

**Practical plan:** Treat the pilot as **9–12 month inventory**. Reorder bestsellers (SH-ESP32 / HALMET / kits) when 50% sold; don’t expect full clear in 90 days.

Seasonality: US boat DIY peaks spring–early summer; winter is slower for installs.

---

## 6. Kit build plan from this PO

| Kit | Build qty | Consumes | Leftover for bare sale |
| --- | ---: | --- | --- |
| Gateway | **20** | 20× SH-ESP32, 20× enc100, 20× M12 | 5× SH-ESP32, 5× M12 |
| Engine | **12** | 12× HALMET, 12× enc158, 12× SP13 | 3× HALMET, 3× SP13 |
| — | — | — | 8× HALSER, 4× SH-RPi, 1× HALPI2 |

**Before marketing kits:** written Hat Labs consent to repackage (Terms §4.2) + firmware/docs path (boards are developer kits with no useful FW preinstalled).

---

## 7. Email / PO text to paste to Matti

Subject: **Pilot stocking order — Nautic Controls (US) — confirm qty + pro-forma**

```
Hi Matti,

I'd like to place a first stocking order for US resale (Nautic Controls / Florida),
based on the 2026-09-25 reseller price list.

Please confirm availability and send a pro-forma (goods + DAP freight to Florida)
for:

DEV-SHESP32-2          × 25
DEV-HALMET-1           × 15
COM-HALPI2-04-256      × 1
DEV-HALSER-1           × 8
MOD-SHRPI-2            × 4
ECK-PW100-FH           × 20
ECK-PW158-H            × 12
CX-M12-PM5A-PW200      × 25
CXP-SP13-CF2-PW200     × 15

Goods total on list: EUR 1,864.83 (ex VAT).

Also please confirm:
1) Lead time and any CM5/HALPI2 substitution risk
2) Delivery address / wire instructions for payment in advance
3) Written OK to bundle boards + your enclosures/connectors into
   Nautic Controls installation kits without modifying PCBs or markings
4) When we can sign the non-draft Reseller Terms + Annex

Thanks,
Vova
```

---

## 8. Verdict

| Question | Answer |
| --- | --- |
| Is the mix sensible? | **Yes** — high-turnover boards + matching enclosures/connectors + 1 HALPI2 demo. |
| Cross-check prices? | **Wholesale exact.** FI retail refreshed. US comps support kit ASPs if positioned as DIY kits, not Actisense clones. |
| Investment? | **~$2.2k** all-in planning number. |
| Profit if sold out? | **~$2.5–2.9k** net at target prices (model). |
| Sell time? | Plan **~10–12 months** base case; 6–7 if marketing works. |
| Ready to send PO? | **Qty draft yes.** Still need entity/insurance/signature pack before wire — but you can ask for pro-forma + availability now. |

### Optional tweaks before sending

1. **Keep recommended connector bump** (+€63) — best ROI fix.  
2. If cash-tight: drop to **20× SH-ESP32 / 12× HALMET** and match enclosures 1:1 (`balanced` ~€1,620).  
3. Skip HALPI2 on pilot (−€294) if you only want board/kit velocity — lose demo unit.  
4. Add 5-pin SP13 later only if you sell NMEA 0183 HALPI2 add-ons.

---

## Sources

* `docs/moskalyk-2026-09-25.csv` / `.pdf`  
* `docs/context-hat-labs-partnership.md`  
* Live: shop.hatlabs.fi (SH-ESP32, HALMET, HALSER, SH-RPi, HALPI2)  
* US comps: Yacht Devices US YDWG-02 $249; Digital Yacht iKonvert ~$215–250; Actisense EMU-1 ~$475–683; Victron Cerbo GX MK2 ~$273 street
