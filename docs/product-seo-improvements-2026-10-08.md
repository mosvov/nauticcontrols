# Product SEO / Catalog Improvements — 2026-10-08

## What Hat Labs is missing (and we improved)

| Gap on `shop.hatlabs.fi` | What we did |
| --- | --- |
| SEO titles are generic (`Product – Hat Labs`) | Unique titles with primary keyword + **US Stock** (~35–45 chars) |
| No meta descriptions emphasizing US fulfillment | Unique meta descriptions (US / Florida shipping angle) |
| Empty / vague `product_type` on many SKUs | Typed: Kit, Development Board, Raspberry Pi HAT, Marine Computer, Enclosure, NMEA 2000 Connector, Circular Connector |
| SP13 CF2 body is title-only (~33 chars) | Full install-oriented description |
| Enclosures thin vs shop capability | Expanded enclosure copy (holes, use case) |
| Tags are EU/shop-ops oriented (`All Products`, `Featured`) | Buyer + filter tags: `marine`, `diy`, `signal-k`, `nmea2000`, etc. |
| No kit SKUs (boards only) | Kits as primary offers |
| No US-localized positioning | Every listing leads with Florida / domestic shipping |

## Applied on Dev Store

- SEO title + meta on all 12 products
- Expanded tag sets (10–15 tags each)
- Product types normalized
- Accessory descriptions enriched (SP13 CF2/CF5/CM4, enclosures)
- Smart collections: Kits, Development Boards, Marine Computers, Accessories, NMEA 2000
- Populated `Hidden: Homepage Featured Items` (5) and `Hidden: Homepage Carousel` (4)
- Published those collections to **Dev Store Headless**

## Still worth doing later

1. **Image alt text** – descriptive alts per media (not just product title)
2. **Assembled kit photos** – replace component collage heroes
3. **Metafields** – `docs_url`, `invoice_sku`, `warranty`, FCC / responsible party blurb
4. **Vendor** – consider `Hat Labs` as manufacturer vendor for brand search (store brand stays Nautic Controls)
5. **Menus** – wire Kits / Boards / Accessories into Next.js header/footer menus
6. **Collection SEO** – custom SEO titles for each collection page
7. **Clean sample collections** – remove Hydrogen / Automated Collection leftovers
8. **FAQ / install snippets** – distinguish DIY vs finished Actisense/Yacht Devices competitors
9. **Weight / shipping profiles** – grams set; rates live: $9.95 under $75 / free $75+ contiguous US (`docs/plans/2026-10-08-shipping-rates.md`)
10. **Reviews / UGC** – after first US installs
