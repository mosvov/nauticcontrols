# Context: Sourcing Split — Hat Labs vs China / US Domestic

> **Internal supplier record.** Public brand and catalog rules: [`context-brand-and-catalog.md`](context-brand-and-catalog.md). Do not copy sourcing or warehouse detail into the storefront.

**Saved:** 2026-09-27 · **Updated:** 2026-10-06  
**Related:** `context-hat-labs-partnership.md` · `draft-pilot-order-analysis.md` · `suppliers-china-accessories.md` · Google Sheet PO

## Decision (locked)

We originally planned a larger mixed order from Matti. After the **2026-09-25 reseller price list**, the rule is:

| Source | What to buy |
| --- | --- |
| **Hat Labs (Finland)** | Only **Category 1** — his proprietary boards + custom enclosures / M12 / SP13 pigtails |
| **China / US domestic** (Amazon, AliExpress, Waveshare, marine distributors) | **Category 2** third-party boards/sensors + **Category 3** commodity NMEA 2000 cabling |

**Do not** route Waveshare HATs, OLEDs, DS18B20, USB panel adapters, or generic Micro-C N2K cable/tees/terminators through Hat Labs. Matti said the list only covers his own design / Hat Labs custom tooling, and offered sourcing channels for the rest. Re-importing China commodity via Finland adds double freight, handling, and EU markup.

Pilot PO to Matti stays focused: **€1,864.83** Hat Labs hardware only (see sheet / `draft-pilot-order-analysis.md`).

---

## Three categories (original sheet vs price list)

```
Original Google Sheet (pre–price-list draft)
 ├── Category 1: Hat Labs proprietary (HALPI2, HALMET, SH-RPi, HALSER, …)
 ├── Category 2: Third-party / generic (Waveshare CAN, MAX-M8Q GNSS, OLED, DS18B20, USB panel)
 └── Category 3: Commodity NMEA 2000 cabling (T, drop, terminators, field plugs, 5-way)
```

Matti’s wholesale list covers **Category 1 (+ custom enclosures/pigtails) only**.

### Hat Labs list SKUs (order from him)

- `COM-HALPI2-…` (all configs)
- `DEV-HALMET-1`, `DEV-HALSER-1`, `DEV-SHESP32-2`, `MOD-SHRPI-2`
- `ECK-PW100-FH`, `ECK-PW158-H`
- `CX-M12-PM5A-PW200`
- `CXP-SP13-CF2-PW200`, `CXP-SP13-CF5-PW200`, `CXP-SP13-CM3-PW200`, `CXP-SP13-CM4-PW200`

### Current pilot PO (Hat Labs only)

| Code | Name | Qty |
| --- | --- | ---: |
| `DEV-SHESP32-2` | SH-ESP32 Sales Package | 25 |
| `DEV-HALMET-1` | HALMET Sales Package | 15 |
| `COM-HALPI2-04-256` | HALPI2 (4GB, 256GB) | 1 |
| `DEV-HALSER-1` | HALSER Sales Package | 8 |
| `MOD-SHRPI-2` | SH-RPi Sales Package | 4 |
| `ECK-PW100-FH` | Enclosure 100×68×50 | 20 |
| `ECK-PW158-H` | Enclosure 158×90×60 | 12 |
| `CX-M12-PM5A-PW200` | N2K M12 panel connector | 25 |
| `CXP-SP13-CF2-PW200` | SP13 2-pin power pigtail | 15 |

---

## Original sheet items (for history)

```text
HALPI2                              qty ?
HALMET                              10
SH-RPi                              6
HALSER                              6
MAX-M8Q GNSS HAT                    5
Waveshare 2-Ch Isolated CAN HAT     5
NMEA 2000 micro T-connector         15
NMEA 2000 cable (0.5m)              15
NMEA 2000 terminator male/female    10 / 10
NMEA 2000 cable plug female/male    10 / 10
0.96" OLED display                  15
1-Wire temperature sensor 3m        15
USB 3.0 Type A Panel Adapter        8
SP13 Pigtail Pair 5-pin             10
NMEA 2000 panel pigtail male        10
NMEA 2000 5-way T                   4
```

### Category 1 — how original sheet → pilot

| Original | Sheet qty | Pilot | Why |
| --- | ---: | --- | --- |
| HALPI2 | ? | **1×** `COM-HALPI2-04-256` | Resolve `?`; factory unit vs US CM5 shortage |
| HALMET | 10 | **15** | Anchor engine kits |
| SH-RPi | 6 | **4** | Rebalance capital |
| HALSER | 6 | **8** | Serial/N2K stock |
| SH-ESP32 | *missing* | **25** | Add — high-turnover board (was missing, likely shop stockouts) |
| Enclosures | *missing* | **20 + 12** | Needed for marine kits; Matti pre-drills |
| M12 panel | 10 | **25** | Pair with gateway enclosures |
| SP13 | 5-pin ×10 on sheet | **2-pin ×15** on pilot | 2-pin for HALMET power kits; 5-pin still on his list if needed |

**SP13 note:** Original sheet specified **5-pin** (`CXP-SP13-CF5-PW200` @ €4.31). Pilot uses **2-pin** (`CXP-SP13-CF2-PW200` @ €4.31) for engine power disconnect kits. Same unit price — swap or add 5-pin on a later PO if multi-sensor wiring needs it. Do **not** block the pilot on this.

---

## Category 2 — buy China / US, not Hat Labs

| Item (original sheet) | Qty planned | Source instead |
| --- | ---: | --- |
| Waveshare 2-Ch Isolated CAN HAT | 5 | Waveshare / Amazon US |
| MAX-M8Q GNSS HAT | 5 | Waveshare / Amazon US |
| 0.96" OLED (I2C) | 15 | Amazon / AliExpress (~$2–3) |
| 1-Wire temp sensor 3m (DS18B20) | 15 | Amazon / AliExpress (~$1.50–2.50) |
| USB 3.0 Type A panel adapter | 8 | Amazon / AliExpress |

**Budget band for kit accessories:** roughly **$150–$250** domestic / China for a first accessory lot (probes, OLEDs, small HATs as needed). Expand after kits sell.

---

## Category 3 — commodity N2K cabling, not Hat Labs

| Item | Qty planned | Source instead |
| --- | ---: | --- |
| Micro-C T-connector | 15 | US marine distributor / factory bulk |
| N2K drop cable 0.5m | 15 | same |
| Terminators male / female | 10 / 10 | same |
| Field-attachable plugs male / female | 10 / 10 | same |
| 5-way multiport T | 4 | same |

Matti is a boutique electronics maker, not an N2K cable factory. Domestic/bulk Micro-C yields better accessory margins (~65–75% target on add-ons when priced right).

**Matti’s supplier pointers (2026-10-06):** see `suppliers-china-accessories.md` — **Hysik** (N2K/DeviceNet cable & connectors) and **AnBox** (100B-23 / 158A-2 enclosures).

---

## Action checklist

- [x] Keep Hat Labs PO = Category 1 only (~€1,865 pilot)
- [x] Ask Matti for sourcing pointers → saved in `suppliers-china-accessories.md`
- [ ] Domestic/China shopping list for Cat 2 + Cat 3 (use Hysik / AnBox + Waveshare/Amazon)
- [ ] Optional later: add `CXP-SP13-CF5-PW200` if 5-pin kits needed

## Why this matters for Shopify kits

Turnkey kits = **Hat Labs board + Hat Labs enclosure/pigtail** + **our** sensors/cables sourced cheaply. That protects margin and avoids Finland round-trips on commodity parts.
