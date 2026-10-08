# Nautic Controls metafields schema

**Namespace:** `nautic`  
**Owner:** merchant-owned product metafields (Shopify Admin)  
**Updated:** 2026-10-08

## Storefront (`PUBLIC_READ`)

| Key | Type | Purpose |
| --- | --- | --- |
| `docs_url` | `url` | Primary Hat Labs docs link |
| `firmware_url` | `url` | Optional GitHub / SensESP / example firmware |
| `compliance_url` | `url` | Manufacturer compliance page when available |
| `install_guide_url` | `url` | Nautic kit install guide when published |
| `warranty_summary` | `single_line_text_field` | Short warranty line on PDP |
| `fcc_summary` | `multi_line_text_field` | Short Part 15 / responsible-party pointer |
| `hatlabs_sku` | `single_line_text_field` | Manufacturer SKU for support / warranty matching |

## Admin only (no Storefront access)

| Key | Type | Purpose |
| --- | --- | --- |
| `invoice_ref` | `single_line_text_field` | e.g. `ACC-SINV-2026-00401` |
| `wholesale_eur` | `number_decimal` | Wholesale cost (EUR) |
| `planned_qty` | `number_integer` | Pilot planned quantity |

## Per-SKU seed values

Default warranty summary (all sellable SKUs):

`2-year limited warranty. See Returns & Warranty.`

Default FCC summary (RF / computer / kits with RF boards):

`Contains pre-certified radio modules. US importer (SDoC responsible party): RigSense LLC dba Nautic Controls. See FCC / Responsible Party.`

Accessories (enclosures, connectors): omit `docs_url`, `firmware_url`, `compliance_url`; still set `warranty_summary` and a shorter FCC note only if the accessory itself is not an intentional radiator (skip `fcc_summary` for passive accessories).

| Handle | SKU | `hatlabs_sku` | `docs_url` | `firmware_url` | `compliance_url` | `install_guide_url` | Ops |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `signal-k-gateway-kit` | KIT-GATEWAY-ESP32 | DEV-SHESP32-2 | https://docs.hatlabs.fi | https://github.com/SignalK/SensESP | (pending) | (pending) | invoice ACC-SINV-2026-00401 |
| `engine-monitoring-kit` | KIT-ENGINE-HALMET | DEV-HALMET-1 | https://docs.hatlabs.fi/halmet | https://github.com/hatlabs/HALMET-example-firmware | (pending) | (pending) | same invoice |
| `sh-esp32` | DEV-SHESP32-2 | DEV-SHESP32-2 | https://docs.hatlabs.fi | https://github.com/SignalK/SensESP | (pending) | — | qty 20, €18.98 |
| `halmet` | DEV-HALMET-1 | DEV-HALMET-1 | https://docs.hatlabs.fi/halmet | https://github.com/hatlabs/HALMET-example-firmware | (pending) | — | qty 12, €23.36 |
| `sh-rpi` | MOD-SHRPI-2 | MOD-SHRPI-2 | https://docs.hatlabs.fi/sh-rpi | — | (pending) | — | from invoice |
| `halpi2-4gb-256` | COM-HALPI2-04-256 | COM-HALPI2-04-256 | https://docs.hatlabs.fi/halpi2 | — | https://docs.hatlabs.fi/halpi2/appendices/compliance/ | — | from invoice |
| `enclosure-pw100` | ECK-PW100-FH | ECK-PW100-FH | — | — | — | — | accessory |
| `enclosure-pw158` | ECK-PW158-H | ECK-PW158-H | — | — | — | — | accessory |
| `n2k-m12-pigtail` | CX-M12-PM5A-PW200 | CX-M12-PM5A-PW200 | — | — | — | — | accessory |
| `sp13-cf2-pigtail` | CXP-SP13-CF2-PW200 | CXP-SP13-CF2-PW200 | — | — | — | — | accessory |
| `sp13-cf5-pigtail` | CXP-SP13-CF5-PW200 | CXP-SP13-CF5-PW200 | — | — | — | — | accessory |
| `sp13-cm4-pigtail` | CXP-SP13-CM4-PW200 | CXP-SP13-CM4-PW200 | — | — | — | — | accessory |

## Shop policy pages (not metafields)

| Handle | Title |
| --- | --- |
| `fcc` | FCC / Responsible Party |
| `returns` | Returns & Warranty |
| `shipping` | Shipping |
| `about` | About |

Draft copy lives in `docs/policy-pages/`. Publish to Shopify Admin pages with matching handles.

## Naming notes

- Use `invoice_ref` (not `invoice_sku`) for the Hat Labs invoice id.
- Use `hatlabs_sku` for the manufacturer SKU (matches invoice line SKUs for bare boards).
- Kits use the primary board SKU in `hatlabs_sku` for warranty/support matching.

## Go-live gaps

See [`docs/compliance-gaps-checklist.md`](compliance-gaps-checklist.md).
