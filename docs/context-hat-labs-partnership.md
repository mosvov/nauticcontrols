# Context Handoff: Hat Labs Partnership, Distribution Agreement & Pilot Order Strategy

> **Internal supplier record.** Public brand and catalog rules: [`context-brand-and-catalog.md`](context-brand-and-catalog.md). Do not copy sourcing or warehouse detail into the storefront.

**Last verified:** 2026-09-27  
**Sources:** `moskalyk-2026-09-25` price list · Reseller Terms/Annex v0.2 · live `shop.hatlabs.fi` · US retail comps · `draft-pilot-order-analysis.md`  
**Related:** `context-shopify-us-store.md` · `draft-pilot-order-analysis.md` · `context-sourcing-hatlabs-vs-china.md` · `suppliers-china-accessories.md`

## 1. Executive Summary & Strategic Objective

* **Initiative:** Establishing **Nautic Controls** (owned by Volodymyr "Vova" Moskalyk) as a US stocking reseller of **Hat Labs Oy** (Helsinki, Finland; founder: Matti Airas), selling via a **Shopify-backed storefront** built in this repository.
* **Core Problem Solved:** US and Canadian boaters buying from Finland face multi-week delivery (~2 weeks), high international freight, customs clearance friction, and carrier brokerage fees on small hardware orders.
* **Nautic Controls Value Proposition:**
  1. Domestic US stock with 2-to-4-day delivery and no unexpected import duties for the end customer.
  2. Installation kits (genuine Hat Labs boards + IP-rated enclosures + NMEA 2000 M12 / SP13 leads) — **requires written Hat Labs consent to repackage** (Terms §4.2). Boards ship as developer kits; kits need firmware/docs from Nautic Controls.
  3. US first-line technical support; Hat Labs remains second-line.
* **Pilot capital:** **€1,884.20** goods (revised 2026-09-30) + UPS freight (re-quote) + ~$21 brokerage + **~15% US tariff on goods**. See §6.
* **Sourcing rule:** Order **only Hat Labs proprietary hardware** from Matti. Third-party HATs, sensors, OLEDs, and commodity NMEA 2000 cabling → **China / US domestic** (not via Finland). See `context-sourcing-hatlabs-vs-china.md` and `suppliers-china-accessories.md` (Hysik, AnBox).
* **Commerce stack:** Shopify Admin + Next.js headless storefront in this folder. See `context-shopify-us-store.md`.

### Status (2026-09-27)

| Area | Status |
| --- | --- |
| Wholesale prices | Verified vs CSV/PDF |
| FI web retail & wholesale discounts | Verified live (§4) |
| US shelf prices & comps | Verified (§7) |
| Pilot BOM math (kit-balanced) | Verified (§6) |
| Contract terms summary | Matches Annex/Terms v0.2 |
| Hat Labs entity / VAT / address | Matches docs + hatlabs.fi |
| Finland VAT 25.5% | Current standard rate |
| Factory HALPI2 vs barebones while CM5 scarce | Sound |
| Contracts signature-ready | Open — both PDFs **DRAFT — not for signature** |
| Annex §1 reseller entity fields | Open — blank |
| Insurance certificate | Open |
| Kit repackaging written consent | Open |
| Kit firmware / install docs | Open |
| Shopify live with inventory | Open — after stock + Admin setup |

**Bottom line:** Numbers and strategy are verified. Execute §9 checklist before wiring money. Do not claim “signed authorized distributor” until non-draft contracts are signed.

---

## 2. Key Entities & Operational Roles

* **Supplier:**
  * **Legal Name:** Hat Labs Oy
  * **Business ID / VAT:** 3178629-6 / FI31786296
  * **Address:** Yliskylänkaari 4, 00840 Helsinki, Finland
  * **Primary Contact:** Matti Airas (`info@hatlabs.fi`)
  * **Role:** Hardware R&D, SMT manufacturing, core board firmware, second-line support. **Continues selling direct worldwide**, including into the US (non-exclusive).

* **Reseller / Distributor:**
  * **Brand Name:** Nautic Controls
  * **Principal / Operator:** Volodymyr Moskalyk
  * **Jurisdiction:** Florida, United States *(legal name / EIN / registered address — TODO in Annex §1)*
  * **Storefront:** Shopify + this Next.js repo (URL TBD)
  * **Role:** Importer of record, FCC SDoC responsible party, inventory holding, value-added packaging (with consent), domestic fulfillment, first-line support.

---

## 3. Contractual & Legal Framework

Source docs: `docs/reseller-terms.pdf`, `docs/reseller-annex.pdf` — **Version 0.2 · 2026-08-28 · DRAFT — not for signature**.

Intended agreement: **Hat Labs Reseller Terms (v0.2)** + **Reseller Annex (v0.2)**. Annex prevails on conflict. Neither has effect without the other once signed.

### Commercial & Operational Terms

* **Territory:** Annex primary market = **United States**. Sales elsewhere permitted (compliance/sanctions apply). Update Annex if CA/MX should be “main market.”
* **Exclusivity:** **Non-exclusive.** Hat Labs may sell direct and appoint other resellers.
* **Delivery & Title:** **DAP (Incoterms 2020)** to Reseller’s US address. Hat Labs books carriage, invoices at cost. Reseller is importer of record. Title on payment in full.
* **Payment:** In advance of dispatch, EUR, no credit limit.
* **MOQ:** None. Orders bind when Hat Labs confirms.
* **Lead time:** ~3 working days from confirmation for stocked items + international transit (get freight quote on pro-forma).
* **Termination:** Indefinite; 90 days’ written notice. Sell-off of remaining stock unlimited in time; stop using Hat Labs reseller branding/logo.

### Warranty & Defective Items

* **Period:** 24 months from sale to end customer, capped at 36 months from Hat Labs invoice. Warranty runs **to the Reseller** — Nautic Controls defines end-customer warranty.
* **Returns:** Physical return **not required** by default; replacement with next order or credit.
* **Claim rate >3%** (rolling 12 months) may trigger mandatory returns. Hat Labs may request FA units at its freight cost.
* **Support:** Reseller first-line; Hat Labs second-line to Reseller only.

### Compliance, Branding & Insurance

* **FCC Part 15:** Pre-certified modules. US importer = **SDoC Responsible Party**. Docs held by Hat Labs, supplied on request. Confirm before first shipment (Annex §9.1).
* **Brand / modify (Terms §4.2 & §6.2):** Do not remove markings. **No modify / repackage / rebrand without written consent.** Kit bundling needs Matti’s written OK. Modified goods become Reseller’s product for regulatory/warranty purposes.
* **Insurance:** ≥ **USD 1,000,000** CGL per occurrence incl. product liability; Hat Labs **Additional Insured**; term + **2 years** after.
* **Law:** Finland; Finland Chamber of Commerce arbitration, Helsinki, English.

---

## 4. Wholesale & FI Retail (verified 2026-09-27)

**Authoritative wholesale:** `docs/moskalyk-2026-09-25.csv` / `.pdf` — net EUR, ex-VAT.  
**FI web:** `shop.hatlabs.fi` prices include **25.5%** VAT. FX planning: **1 EUR = 1.10 USD** (recheck on wire day).

| SKU | Description | Reseller EUR | FI web (inc VAT) | FI ex-VAT ≈ | Wholesale discount |
| --- | --- | ---: | ---: | ---: | ---: |
| `DEV-SHESP32-2` | SH-ESP32 | **€18.98** | €32.63 | ~€26.00 | **~27%** |
| `DEV-HALMET-1` | HALMET | **€23.36** | €40.16 | ~€32.00 | **~27%** |
| `DEV-HALSER-1` | HALSER | **€23.36** | €48.58 | ~€38.71 | **~40%** |
| `MOD-SHRPI-2` | SH-RPi | **€35.04** | €75.30 | ~€60.00 | **~42%** |
| `ECK-PW100-FH` | Enclosure 100×68×50 | **€6.97** | — | — | — |
| `ECK-PW158-H` | Enclosure 158×90×60 | **€9.30** | — | — | — |
| `CX-M12-PM5A-PW200` | N2K M12 pigtail | **€4.11** | — | — | — |
| `CXP-SP13-CF2-PW200` | SP13 2-pin pair | **€4.31** | — | — | — |
| `COM-HALPI2-00-000` | HALPI2 barebones | **€157.94** | — | — | — |
| `COM-HALPI2-04-256` | HALPI2 4GB / 256GB | **€294.49** | page ~€579.91 (config varies) | config-dependent | ~25% on list math |
| `COM-HALPI2-04-512` | HALPI2 4GB / 512GB | **€328.35** | — | — | — |
| `COM-HALPI2-08-1024` | HALPI2 8GB / 1TB | **€435.81** | — | — | — |

CSV also lists other HALPI2 configs (2GB/32GB eMMC, 4GB/64GB eMMC, 8GB/16GB variants, etc.) for later orders.

**Marketing rule:** Do not claim a blanket “40% off Hat Labs.” Use the row above — SH-ESP32/HALMET are ~**27%**; HALSER/SH-RPi are ~**40–42%**.

---

## 5. HALPI2 vs CM5 Sourcing

* Raspberry Pi CM5 official list starts ~**$67.50**; many DigiKey SKUs still **0 immediate stock**. Hat Labs shop warns of CM5 short supply and rising costs. Scarcity is real; spot prices move.
* **DIY barebones** (€157.94 + CM5 + SSD + labor) often loses vs factory once assembly time and warranty are counted.
* **Rule:** Buy **factory-assembled HALPI2** while CM5 availability is poor. Pilot includes **1× `COM-HALPI2-04-256`** as demonstrator.

---

## 6. Pilot Stocking Order (revised 2026-09-30 after Matti quote)

**Status:** Revised vs quote `SAL-QTN-2026-00001` per Matti’s availability/mix notes. Sheet: [Pilot PO](https://docs.google.com/spreadsheets/d/1TN4DFogLBJ0O-x8m1u8AkCcoVxRXmJn8LDjQBUi8CzM/edit). Local CSV: `pilot-po-revised-2026-09-30.csv`.

**Changes from first draft:** Dropped HALSER (wait new rev / only 2 in stock). SH-ESP32 25→20. HALMET 15→12. SH-RPi 4→8. ECK-PW158 12→6 (keep PW100 at 20). M12 25→20. SP13-CF2 15→8. Added CF5×5 + CM4×5. HALPI2 kept at **2** (as quoted; consider cutting to 1 — see further steps).

| Item Code | Description | Qty | Unit EUR | Subtotal EUR |
| --- | --- | ---: | ---: | ---: |
| `DEV-SHESP32-2` | SH-ESP32 Sales Package | **20** | 18.98 | 379.60 |
| `DEV-HALMET-1` | HALMET Sales Package | **12** | 23.36 | 280.32 |
| `COM-HALPI2-04-256` | HALPI2 (4GB, 256GB) | **2** | 294.49 | 588.98 |
| `MOD-SHRPI-2` | SH-RPi Sales Package | **8** | 35.04 | 280.32 |
| `ECK-PW100-FH` | Enclosure 100×68×50 | **20** | 6.97 | 139.40 |
| `ECK-PW158-H` | Enclosure 158×90×60 | **6** | 9.30 | 55.80 |
| `CX-M12-PM5A-PW200` | N2K M12 panel connector | **20** | 4.11 | 82.20 |
| `CXP-SP13-CF2-PW200` | SP13 2-pin power pigtail | **8** | 4.31 | 34.48 |
| `CXP-SP13-CF5-PW200` | SP13 5-pin female | **5** | 4.31 | 21.55 |
| `CXP-SP13-CM4-PW200` | SP13 4-pin male | **5** | 4.31 | 21.55 |
| **TOTALS** |  | **106** |  | **€1,884.20** |

**Kit fit:** ~20 gateway kits (SH-ESP32 + PW100 + M12). ~6 engine kits (HALMET + PW158 + CF2; 12 HALMET / 8 CF2 leave bare/spare). No HALSER.

**Landed (planning):** goods ~$2,073 @1.10 + UPS ship (re-quote; was €219.73 on heavier mix) + ~$21 brokerage + **15% tariff on goods**. Ask Matti for updated shipping on this lighter mix.

---

## 7. US Pricing, Comps & Unit Economics

Position as **DIY / Signal K installation kits with docs**, not as drop-in Actisense or Yacht Devices clones. SH-ESP32 and HALMET ship **without useful firmware**; Nautic Controls must provide FW + guides for kit claims.

### Recommended shelf prices

| Offer | USD retail | Landed ≈ | Gross before fees | Market reference (2026-09) |
| --- | ---: | ---: | ---: | --- |
| Gateway kit (SH-ESP32 + enc100 + M12 + USB) | **$89.99** | ~$38 | ~58% | Yacht Devices YDWG-02 **$249**; Digital Yacht iKonvert ~$215–250 (finished Wi-Fi/USB gateways — different product class) |
| Engine kit (HALMET + enc158 + SP13) | **$139.99** | ~$43 | ~69% | Actisense EMU-1 **~$475–$683** (finished analog→N2K — different product class) |
| SH-ESP32 bare | **$49** | ~$22 | ~55% | FI ex-VAT ~$29 + FI freight |
| HALMET bare | **$59** | ~$27 | ~54% | FI ex-VAT ~$35 + FI freight |
| HALSER bare | **$59** | ~$27 | ~54% | FI listing ~$46 |
| SH-RPi bare | **$79** | ~$41 | ~48% | FI ~$72–75 |
| HALPI2 4GB/256 | **$449** | ~$346 w/ freight share | ~23% | Victron Cerbo GX MK2 street **~$273** / list ~$321 — power-system hub, **not** a substitute; position HALPI2 as marine CM5 / Signal K server |
| Enclosure / connector spares | $15–25 | cost+ | filler | optional |

### Pilot P&L model (full sell-out at prices above)

Assumptions: FX 1.10 · freight $132 · Shopify ~2.9% · USB $3 × 20 gateway kits. Detail: `draft-pilot-order-analysis.md`.

| | Amount |
| --- | ---: |
| Cash out (goods + freight + USB) | **~$2,243** |
| Gross sales | **~$5,259** |
| Est. net profit | **~$2,860** |
| Margin on sales | ~**54%** |
| ROI on cash out | ~**128%** |

Profit engine = **kits + boards**. HALPI2 contributes ~$90–100 — demo/flagship, not the volume return.

### Sell-through expectation

Niche Signal K / DIY marine demand:

| Pace | Clear ~53 primary units |
| --- | --- |
| Optimistic (~8/mo) | ~6–7 months |
| **Base (~4–5/mo)** | **~10–12 months** |
| Conservative (~2–3/mo) | ~18 months |

Plan the pilot as **~9–12 month inventory**. Reorder bestsellers when ~50% sold.

---

## 8. Have vs Need

### Have

* Wholesale price list (2026-09-25)
* Draft Reseller Terms + Annex v0.2
* Verified pilot BOM + P&L (`draft-pilot-order-analysis.md`)
* Headless Shopify storefront codebase
* Shopify + partnership intent docs

### Need before order wire + shop launch

§9 checklist.

---

## 9. Execution Checklist — Order + Shopify Launch

### A. Legal / entity

- [ ] Form / confirm Florida entity (legal name, form)
- [ ] EIN; Florida sales tax plan
- [ ] Fill **Annex §1** (name, form/jurisdiction, address, EIN, tax #, website)
- [ ] Fill delivery address, invoice delivery, contacts (Annex §5–§6, §11)
- [ ] SDoC responsible-party US address/contact (Annex §9)
- [ ] Request **signature-ready** (non-draft) Terms + Annex; set Terms version/date in Annex §2

### B. Insurance

- [ ] Bind CGL ≥ **$1,000,000** per occurrence incl. product liability
- [ ] Name **Hat Labs Oy** Additional Insured
- [ ] ACORD certificate; keep cover for term + 2 years post-termination

### C. Commercial with Matti (`info@hatlabs.fi`)

- [ ] Confirm §6 quantities
- [ ] Pro-forma (goods EUR + DAP freight)
- [ ] Written consent to bundle kits without altering PCB/markings
- [ ] Listing on hatlabs.fi as US reseller once live (Annex §10)
- [ ] HALPI2 lead time / CM5 substitution risk
- [ ] Wire EUR after confirmation

### D. Import / ops

- [ ] Florida delivery facility / 3PL
- [ ] Customs broker plan if needed (you are importer of record)
- [ ] Receiving check within **10 business days** (Terms §3.2)
- [ ] Lot tracking: sale → Hat Labs order ref (Terms §4.5, 24 months)

### E. Shopify + storefront

- [x] Shopify store: contiguous US shipping ($9.95 under $75 / free $75+; other destinations contact for quote)
- [ ] Shopify store: payments + tax + checkout smoke
- [ ] `.env.local`: `SHOPIFY_STORE_DOMAIN` + Storefront API token
- [ ] Products: SKUs + kits (after consent)
- [ ] Inventory from received stock; cost basis
- [ ] Policies: shipping, returns, end-customer warranty
- [ ] FCC / responsible-party statement where required
- [ ] Domain + go-live; optional hatlabs.fi link

### F. Kit product readiness

- [ ] Firmware path (SensESP / HALMET example / documented DIY)
- [ ] Install guides; honest DIY positioning vs finished gateways
- [ ] Source USB-C / packaging not on Hat Labs list

### Next email to Matti

1. Annex §1 ETA  
2. Confirm §6 qty → pro-forma + freight  
3. Non-draft signature pack  
4. Written kit/repackaging consent  
5. Insurance certificate ETA  

---

## 10. Source Documents

| File | Contents |
| --- | --- |
| `docs/context-hat-labs-partnership.md` | This handoff |
| `docs/context-shopify-us-store.md` | Shopify / US store intent |
| `docs/draft-pilot-order-analysis.md` | Draft PO, P&L, sell-through, email text |
| `docs/context-sourcing-hatlabs-vs-china.md` | Cat 1 vs China/US accessories; original sheet vs pilot |
| `docs/suppliers-china-accessories.md` | Hysik (N2K) + AnBox (enclosures) — Matti pointers 2026-10-06 |
| `docs/moskalyk-2026-09-25.csv` | Wholesale price list |
| `docs/moskalyk-2026-09-25.pdf` | Wholesale price list (PDF) |
| `docs/reseller-annex.pdf` | Annex v0.2 DRAFT |
| `docs/reseller-terms.pdf` | Terms v0.2 DRAFT |
