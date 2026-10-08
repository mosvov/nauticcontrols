# Suppliers — China Accessories (Cat 2 / Cat 3)

**Saved:** 2026-10-06  
**Source:** Matti Airas (Hat Labs), email 2026-10-06 — *Re: Hat Labs reseller agreement*  
**Related:** `context-sourcing-hatlabs-vs-china.md` · `context-hat-labs-partnership.md`

Pointers from Matti for parts we buy ourselves (not through Hat Labs). Use these for kit accessories and commodity cabling; keep Hat Labs PO on Category 1 only.

---

## NMEA 2000 cables / connectors / tees

| Field | Detail |
| --- | --- |
| **Supplier** | Shenzhen Hysik Electronics Co., Ltd. |
| **URL** | https://hysik.en.alibaba.com/ |
| **What for** | DeviceNet / NMEA 2000 style cable, metal connectors, tees, related Micro-C network parts |
| **Notes from Matti** | Good quality metal connectors; DeviceNet cable |
| **MOQ** | Typically ~20–100 pcs depending on part |
| **Next step** | Contact them and ask for their **PDF catalog** |

---

## Enclosures (alternate to Hat Labs ECK when buying blank boxes)

| Field | Detail |
| --- | --- |
| **Supplier** | AnBox Electric |
| **Contact** | Annie Zeng |
| **URL** | https://www.anboxelectric.com/ |
| **What for** | Plastic enclosures matching common kit sizes |

### Part numbers Matti recommended

| Size (mm) | AnBox P/N | Notes |
| --- | --- | --- |
| 100 × 68 × 50 | **100B-23** | Specify **AIS316 stainless screws** (marine) |
| 158 × 90 × 60 | **158A-2** | Same family as Hat Labs larger enclosure footprint |

**Note:** Pilot order still uses Hat Labs pre-drilled enclosures (`ECK-PW100-FH`, `ECK-PW158-H`). AnBox is for future blank-box / volume sourcing when we machine or drill ourselves.

---

## How this fits the sourcing split

| Category | Buy from | These suppliers |
| --- | --- | --- |
| Cat 1 proprietary boards + Hat Labs tooling | Hat Labs (Matti) | — |
| Cat 2 sensors / HATs / OLEDs | Waveshare, Amazon, AliExpress | — (not listed yet) |
| Cat 3 N2K cabling | China / US marine | **Hysik** |
| Blank enclosures (optional alt) | China | **AnBox** |

---

## Open follow-ups

- [ ] Request Hysik PDF catalog; shortlist Micro-C T, drop 0.5m, terminators, field plugs, 5-way
- [ ] Quote AnBox 100B-23 + 158A-2 with AIS316 screws (sample qty)
- [ ] Add Cat 2 preferred vendors (Waveshare CAN, MAX-M8Q, DS18B20, OLED) when locked
