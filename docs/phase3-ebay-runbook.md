# Phase 3 — eBay via Marketplace Connect

Prereqs: Shopify on paid plan, Florida inventory accurate, 1–2 real DTC orders fulfilled.

## Account

- Existing seller: https://www.ebay.com/usr/v.moskalyk
- [ ] Before first Nautic listing: rename public username toward `nauticcontrols` (or closest available) to keep feedback history
- [ ] Confirm business policies: shipping from FL ($9.95 under $75 / free $75+ on Shopify DTC; eBay policy may differ), returns, marine electronics category readiness

## Connect

1. Shopify Admin → Apps → Marketplace Connect
2. Connect eBay → authorize `v.moskalyk` (or renamed)
3. Mapping → Select Inventory Location → **Florida** location only
4. Inventory rule: **Stock Level** + **Buffer 1**
5. Order import: linked products only, paid/complete
6. Fulfill **only in Shopify** (tracking pushes back to eBay)

## Listings (kits first)

| Shopify SKU | eBay Custom Label | Start? |
| --- | --- | --- |
| KIT-GATEWAY-ESP32 | KIT-GATEWAY-ESP32 | Yes |
| KIT-ENGINE-HALMET | KIT-ENGINE-HALMET | Yes |
| Bare boards / spares | match Shopify SKU | After kits prove out |

Do not explode kit BOMs into separate eBay qty logic. Sell finished kit qty only.

## Do not

- Port `rig-sense-fleet` China/WanYiLian sync
- Edit linked listings only in Seller Hub (use Marketplace Connect after link)
- List without Buffer while sync lag is untested
