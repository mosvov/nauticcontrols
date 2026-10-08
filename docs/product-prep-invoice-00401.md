# Product Prep — Invoice ACC-SINV-2026-00401

**Date:** 2026-10-08  
**Invoice:** Hat Labs Oy → RigSense LLC (Nautic Controls), 2026-10-06  
**Goods:** €1,884.20 · Shipping UPS Expedited FL: €173.17 · **Grand total €2,057.37** (VAT 0% export)  
**Source images/copy:** live `shop.hatlabs.fi` products.json (scraped 2026-10-08)

## Deliverables (ready for Shopify insert)

| File | Purpose |
| --- | --- |
| `docs/shopify-catalog-import.csv` | Full Admin CSV import (Body HTML + multi-image CDN URLs) |
| `docs/shopify-catalog-seed.csv` | One-row-per-product summary (prices, cost, planned qty) |
| `docs/shopify-catalog-products.json` | Same catalog as structured JSON (Admin API / scripts) |
| `docs/product-assets/<SKU>/` | Local image archive + Hat Labs body HTML + `meta.json` |
| `docs/product-assets/manifest.json` | Invoice ↔ Hat Labs handle / image URL map |

All products are **`draft`**, inventory **0** until goods are received and counted.

## Invoice → catalog map

| Invoice SKU | Qty | Wholesale € | Hat Labs shop | Nautic handle | Retail USD | Cost USD* |
| --- | ---: | ---: | --- | --- | ---: | ---: |
| DEV-SHESP32-2 | 20 | 18.98 | [sh-esp32](https://shop.hatlabs.fi/products/sh-esp32) | `sh-esp32` | 49.00 | 20.88 |
| DEV-HALMET-1 | 12 | 23.36 | [halmet](https://shop.hatlabs.fi/products/halmet) | `halmet` | 59.00 | 25.70 |
| COM-HALPI2-04-256 | 2 | 294.49 | [halpi2-computer](https://shop.hatlabs.fi/products/halpi2-computer) (4GB/256GB) | `halpi2-4gb-256` | 449.00 | 323.94 |
| MOD-SHRPI-2 | 8 | 35.04 | [sh-rpi](https://shop.hatlabs.fi/products/sh-rpi) | `sh-rpi` | 79.00 | 38.54 |
| ECK-PW100-FH | 20 | 6.97 | [enclosure PW100](https://shop.hatlabs.fi/products/waterproof-enclosure-100x68x50-mm-flanges-holes) | `enclosure-pw100` | 19.99 | 7.67 |
| ECK-PW158-H | 6 | 9.30 | [enclosure PW158](https://shop.hatlabs.fi/products/waterproof-enclosure-158x90x60-mm-pre-drilled-holes) | `enclosure-pw158` | 24.99 | 10.23 |
| CX-M12-PM5A-PW200 | 20 | 4.11 | [panel pigtail](https://shop.hatlabs.fi/products/nmea-2000-panel-pigtail-connector-male)† | `n2k-m12-pigtail` | 18.99 | 4.52 |
| CXP-SP13-CF2-PW200 | 8 | 4.31 | [SP13 CF2](https://shop.hatlabs.fi/products/sp13-power-pigtail-connector-pair) | `sp13-cf2-pigtail` | 16.99 | 4.74 |
| CXP-SP13-CF5-PW200 | 5 | 4.31 | [SP13 CF5](https://shop.hatlabs.fi/products/sp13-pigtail-connector-pair-5-pin-female-cable-plug) | `sp13-cf5-pigtail` | 16.99 | 4.74 |
| CXP-SP13-CM4-PW200 | 5 | 4.31 | [SP13 CM4](https://shop.hatlabs.fi/products/sp13-pigtail-connector-pair-4-pin-male-cable-plug) | `sp13-cm4-pigtail` | 16.99 | 4.74 |

\*Cost = wholesale EUR × 1.10 FX only. Does **not** yet allocate UPS €173.17 or ~15% US tariff. Revisit landed cost after broker invoice.

†Shop SKU is `CX-M12-PM5A-PW300` (30 cm pigtails). Invoice is **PW200**. Photos/description adapted from shop; listing notes 200 mm stock.

## Kits (virtual BOM — assemble after receive)

| Kit SKU | Title | Retail | BOM | Max from this invoice |
| --- | --- | ---: | --- | ---: |
| KIT-GATEWAY-ESP32 | Signal K Gateway Kit | 89.99 | SH-ESP32 + PW100 + M12 | **20** |
| KIT-ENGINE-HALMET | Engine Monitoring Kit | 169.99 | HALMET + PW158 + SP13-CF2 | **6** (limited by PW158) |

Keep kits **draft** until: (1) written Hat Labs kit/repack consent, (2) firmware path + install guide, (3) component stock received.

If you sell kits, decrement component inventory (or use Shopify bundles / inventory apps). Do not double-count the same physical unit as both kit and bare board.

## Product copy structure (Nautic Controls)

Each Body HTML follows the same pattern:

1. What it is + US Florida stock value prop  
2. Kit contents or sales-package list  
3. Honest DIY / developer-kit disclaimer where needed  
4. Docs / GitHub links to Hat Labs  
5. No claim of finished Actisense / Yacht Devices equivalents  

Boards and HALMET explicitly state **no consumer firmware pre-installed**.

## Images

- **55 images** downloaded under `docs/product-assets/<SKU>/`  
- Import CSV uses Hat Labs Shopify CDN URLs (same files) so Admin CSV import works without re-upload  
- Kits reuse component photos (3 board + enclosure + connector). Replace with assembled kit hero shots before Active  

Attribution: product photography from Hat Labs shop; reseller use is intended once authorized. Do not strip Hat Labs PCB markings (Terms §4.2).

## How to insert into Shopify

### Option A — Admin CSV (fastest)

1. Shopify Admin → Products → Import  
2. Upload `docs/shopify-catalog-import.csv`  
3. Confirm 12 products, images loading from CDN  
4. Publish each sellable SKU to the **Headless** sales channel  
5. Leave Status = draft until go-live gate (`docs/plans/2026-10-08-shop-launch.md` Phase 2)

### Option B — Admin API / CLI

Use `docs/shopify-catalog-products.json` with `productCreate` + `productCreateMedia` (or Shopify CLI `shopify store execute`). Prefer API if you need metafields (invoice ref, wholesale EUR, planned qty).

Suggested metafields (namespace `nautic`):

| Key | Example |
| --- | --- |
| `hatlabs_sku` | DEV-SHESP32-2 |
| `invoice_ref` | ACC-SINV-2026-00401 |
| `wholesale_eur` | 18.98 |
| `planned_qty` | 20 |
| `docs_url` | https://docs.hatlabs.fi/... |

## Inventory plan after receiving

1. Receive / count against invoice (Terms: within 10 business days)  
2. Set Florida location inventory on bare SKUs to counted qty  
3. Decide kit vs bare sell-through mix before Activating kits  
4. Update Cost per item with landed (goods + freight share + tariff + brokerage)

## Open blockers before Active

- [ ] Goods landed and counted at 606 Stargaze Lane, FL  
- [ ] Kit repackaging written consent from Matti  
- [ ] Firmware + install guides for kits  
- [ ] Headless channel publish + collections / menus  
- [ ] Landed cost refresh (tariff + UPS final)

## Related docs

- `docs/context-hat-labs-partnership.md` §6–§7 (PO + retail targets)  
- `docs/plans/2026-10-08-shop-launch.md` Phase 1 catalog  
- Invoice PDF: `/Users/mosvov/Downloads/ACC-SINV-2026-00401.pdf` (copy into `docs/` if you want it in-repo)
