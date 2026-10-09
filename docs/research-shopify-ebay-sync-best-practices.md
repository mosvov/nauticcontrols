# Research: Shopify ↔ eBay Sync Best Practices (Nautic Controls)

**Date:** 2026-10-08  
**Brand:** Nautic Controls, Florida  
**Profile:** Small US seller, niche marine electronics hardware, domestic Florida stock (not dropship), catalog under ~20 SKUs initially (gateway kits, engine kits, maybe bare boards)  
**Stack:** Headless Shopify + Next.js on Vercel; Shopify Admin remains commerce system of record  

---

## Verdict (recommended approach)

**Use Shopify as inventory/order truth. Use Shopify Marketplace Connect (formerly Codisto) as the eBay bridge for listing + inventory + order import. Do not build custom eBay sync for this business line yet.**

Why this fits Nautic Controls:

- One Florida stock location, tiny SKU count, low initial volume.
- Headless storefront does not change the model: Storefront API sells from Shopify inventory; Marketplace Connect still syncs from Shopify Admin.
- Custom sync in other RigSense repos (`rig-sense-fleet` / `shopintegrations`) is aimed at a different ops model (China warehouse / WanYiLian-style flows). Reusing that here would import the wrong assumptions (multi-warehouse foreign stock, different SKU/order semantics) into a simple domestic DTC + eBay setup.

**Fallback if Marketplace Connect reliability fails in practice:** CedCommerce eBay Integration (Shopify App Store), still with Shopify as source of truth.  
**Do not use yet:** Rithum/ChannelAdvisor, Inventory Lab, Sellbrite-as-middle-layer, or a custom Inventory API project.

---

## 1. Official Shopify eBay channel / Marketplace Connect (2025–2026)

### What it is

Shopify Marketplace Connect is Shopify’s first-party multi-marketplace app (formerly Codisto). Supported marketplaces: **Amazon, eBay, Walmart (US), Target Plus (US)**.

Sources:

- https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect  
- https://apps.shopify.com/marketplace-connect  
- https://www.shopify.com/blog/shopify-ebay-integration (updated Jun 16, 2026)

### Capabilities (eBay-relevant)

| Capability | Status / notes |
|---|---|
| Connect eBay seller account | Yes (“Add new eBay connection”) |
| Create / manage eBay listings from Shopify | Yes (single edit, bulk edit, attribute mapping) |
| Link existing eBay listings | Yes (match by SKU, UPC, or title) |
| Inventory sync | Yes (Stock Level / Fixed / Buffer / Max Quantity; can disable) |
| Multi-location inventory | Yes (select Shopify location for Amazon/eBay/Walmart US) |
| Order import into Shopify | Yes (transfer settings: all / linked only / none; paid vs pending) |
| Tracking sync back to marketplace | Yes (fulfill in Shopify → tracking pushed) |
| eBay listing defaults | Shipping, returns, title/description rules, inventory adjustments, auto-categorize, auto-list |
| Image sync | Can turn off per listing (manage images on eBay) |

Sources:

- https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect/products/manage/ebay  
- https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect/products/link-existing  
- https://help.shopify.com/en/manual/online-sales-channels/marketplaces/marketplace-connect/products  
- https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7249987736975-Quick-Start-Guide  
- https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7241800373903-Managing-Orders  
- https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7312134306191-Inventory-Settings  
- https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/8804291903503-Multi-Location-Inventory-Amazon-ebay-and-Walmart-US  

### Pricing (app)

From Shopify App Store listing:

- Free to install  
- **First 50 marketplace-synced orders/month free**  
- Then **1% per additional synced order, capped at $99/month**

Managing Orders help also states: free to transfer orders from **unsynced** listings; subscription/plan prompt after **more than 50 orders/month from Shopify-synced listings**.

Sources:

- https://apps.shopify.com/marketplace-connect  
- https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7241800373903-Managing-Orders  
- https://www.shopify.com/blog/shopify-ebay-integration  

### Operational caveats (important)

1. **Once a listing is linked/enabled, Shopify/Marketplace Connect becomes the listing editor.** Direct eBay edits get overwritten.  
   - https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7234054213135-Linking-Existing-eBay-listings  
2. **Inventory push is not instantaneous on the marketplace side.** Marketplace Connect publishes immediately, but marketplaces typically take **5–60 minutes** to process. Fast movers should use a **Quantity Buffer**.  
   - https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7377731825935-How-long-does-it-take-to-update-inventory  
3. Recent App Store reviews (2026) report intermittent eBay sync/price/inventory bugs for some merchants. Fine as default for a tiny catalog; keep CedCommerce as a known exit ramp.  
   - https://apps.shopify.com/marketplace-connect  

---

## 2. Inventory sync models

### Model A — Shopify as source of truth (recommended)

```
Florida physical stock
        ↓
Shopify inventory (location = FL warehouse)
        ↓
Marketplace Connect (Stock Level ± Buffer)
        ↓
eBay listing quantity
        ↑
eBay order → imported to Shopify → inventory decrements → eBay qty revised
```

- DTC (headless) and eBay share one available quantity.  
- Fulfillment, shipping labels, and customer ops stay in Shopify.  
- Best match for “domestic Florida stock, one warehouse.”

Marketplace Connect inventory operators:

| Operator | Behavior |
|---|---|
| **Stock Level** | eBay qty = Shopify available |
| **Quantity Buffer** | eBay qty = Shopify − buffer (reserves DTC safety stock) |
| **Max Quantity** | Cap eBay exposure (e.g. never show more than 2) |
| **Fixed Quantity** | Static eBay qty (risky; avoid for live stock) |
| **Sync off** | Use only if a third-party IMS owns marketplace qty |

Source: https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7312134306191-Inventory-Settings  

### Model B — eBay as source of truth

Rarely right when Shopify is the brand storefront. Only makes sense if eBay is primary and Shopify is a mirror. **Not recommended** for Nautic Controls.

### Model C — Middle layer (Sellbrite / Rithum / custom IMS)

Middle layer owns catalog + inventory, pushes to Shopify and eBay.

- **Sellbrite:** Two modes — “Sellbrite for Shopify” (Shopify truth) vs classic Sellbrite (Sellbrite truth for multi-cart). Useful when many marketplaces or multiple Shopify stores. Overkill under 20 SKUs / one FL location.  
  - https://www.sellbrite.com/integrations/sellbrite-for-shopify/  
  - https://support.sellbrite.com/en/articles/3367153-marketplace-and-shopping-cart-integrations  
- **Rithum (ChannelAdvisor):** Enterprise GMV + subscription; listing limits in terms docs up to hundreds of thousands. Wrong scale/cost.  
  - https://www.rithum.com/terms/marketplaces/  
- **Custom API middle layer:** Justified for China multi-warehouse / non-Shopify ERPs, not for this pilot.

### Model D — Custom eBay Inventory API ↔ Shopify

eBay Sell Inventory API can manage locations, inventory items, offers, and publish listings. Appropriate when:

- Non-Shopify WMS is truth, or  
- Complex multi-warehouse / multi-merchant logic (e.g. WanYiLian-style China stock), or  
- App connectors cannot express required business rules.

**Not appropriate yet** for Nautic Controls Florida DTC: cost of maintaining OAuth, offer lifecycle, category aspects, business policies, and oversell races exceeds value at &lt;20 SKUs.

Developer entry: https://developer.ebay.com/api-docs/sell/inventory/overview.html (direct fetch often blocked; use eBay Developer Portal).

---

## 3. Listing sync vs inventory-only vs order import

Treat these as three separate decisions:

| Mode | What syncs | When to use |
|---|---|---|
| **Full listing sync** | Title, description, images, price, category, qty, policies | Greenfield eBay launch from Shopify catalog |
| **Link existing + selective override** | Keep eBay title/description/price OR switch to MC settings; always sync orders/inventory once linked | Already have eBay sales history / Best Match |
| **Inventory-only** | Qty only; listing content managed on eBay | Strong eBay SEO listings already; turn off image sync / keep eBay content rules |
| **Order import only** | Orders into Shopify; inventory managed elsewhere | Using a third-party IMS; MC inventory sync **off** |

For Nautic Controls launch:

1. Create clean Shopify SKUs first (Florida location stocked).  
2. Prefer **create listings from Shopify** (or link if any manual eBay drafts exist).  
3. Enable **order transfer for linked products only** (avoids importing unrelated eBay junk).  
4. Use **Stock Level + small Buffer (1)** while volume is tiny.  
5. Optionally keep eBay-optimized titles via “Use eBay settings” on link, then manage revisions carefully.

Sources:

- https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect/products/link-existing  
- https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7241800373903-Managing-Orders  

---

## 4. Fees, category mapping, shipping profiles (hardware)

### eBay selling economics (US, planning figures)

eBay’s official fee pages are account-context specific (Managed Payments + category). Third-party 2026 summaries of eBay’s published schedules commonly cite for **most US categories / no Store**:

- Final value fee ~**13.6%** of total sale (item + buyer-paid shipping + tax base per eBay rules), with higher-price tiers stepping down  
- Per-order fee ~**$0.30** (≤$10) / **$0.40** (&gt;$10)  
- ~**250** free listings/month without a Store; insertion fee beyond that  
- Managed Payments: payment processing is inside FVF (no separate classic PayPal seller fee)

**Always verify in Seller Hub invoice / eBay “Selling fees” for the exact category** (marine electronics / boat parts can differ). Official starting point:

- https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822  
- Payments Terms (Managed Payments): https://ir.ebaystatic.com/pictures/aw/pics/payment/us-payments-terms-of-use-2026-07-30.pdf  

Implication for Nautic Controls pricing: eBay list price should cover FVF on **item + shipping**, Promoted Listings if used, and still clear vs Shopify DTC margin. Flat “free shipping” increases FVF base.

### Category mapping

- Marketplace Connect offers **auto-categorization** or manual eBay category per listing defaults.  
  - https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect/products/manage/ebay  
- CedCommerce uses **Category Templates** + Profiles for repeatable mapping.  
  - https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/  
- For niche NMEA / marine gateway kits: **manually pick category + item specifics** (brand, MPN, compatible systems). Auto-categorize is a starting point only; wrong category kills search and can raise fee surprises.

### Shipping / business policies (hardware)

eBay expects **Payment, Shipping, and Return** business policies on listings. Opt in via Seller Hub; create named policies (e.g. “FL Parcel – USPS Priority / UPS Ground”, “30-day returns buyer pays return ship”).

Sources:

- Inventory onboarding (business policies section): https://ir.ebaystatic.com/cr/v/c1/rsc/feeds/v1/guide-inventory-onboarding.pdf  
- Business policies overview (eBay help family): https://www.ebay.com.au/help/policies/business-policy/business-policies?id=4212  

Practical hardware setup for Florida stock:

1. One **domestic US shipping policy** with realistic handling time (1–2 business days once goods landed).  
2. Shopify DTC (done): **$9.95** under $75, **free ground** at $75+, contiguous US (`docs/plans/2026-10-08-shipping-rates.md`). eBay can use calculated or a matching flat table; free shipping on eBay increases FVF base.  
3. Separate eBay policy or rate table if bare boards ship cheaper than full kits.  
4. Returns policy aligned with electronics (restocking / opened packaging rules stated clearly).  
5. Item location = Florida (buyer trust + domestic shipping expectations).

Marketplace Connect lets you set default eBay shipping method for future listings; keep detailed carrier rules in eBay business policies.

---

## 5. Built-in channel vs third-party vs custom API

| Option | Fit for &lt;20 SKUs FL stock | Cost shape | Notes |
|---|---|---|---|
| **Shopify Marketplace Connect** | **Best default** | Free ≤50 synced orders/mo; then 1% to $99 cap | Native, Shopify-supported, multi-marketplace later |
| **CedCommerce eBay Integration** | Strong alternative | Free tier (≤10 one-time listings / 100 managed); Bronze $19/mo (watch order sync caps); Silver $49/mo | Higher App Store rating (~4.7); templates/profiles; warehouse select; **Bronze only syncs 10 orders/mo** — tiny sellers may need Silver once eBay moves |
| **Sellbrite for Shopify** | Optional if adding Etsy/Newegg/many channels | Order-tier SaaS | Shopify-truth mode exists; more moving parts |
| **Rithum / ChannelAdvisor** | No | Quote + GMV | Enterprise |
| **Inventory Lab** | No for eBay sync | Amazon-focused | Officially Amazon-only for auto pull; eBay is manual P&amp;L entry |
| **Custom eBay + Shopify APIs** | Later / other business line | Eng + maintenance | Appropriate for China multi-warehouse sync elsewhere, not this pilot |

Sources:

- https://apps.shopify.com/marketplace-connect  
- https://apps.shopify.com/ebay-integration  
- https://www.shopify.com/blog/shopify-ebay-integration  
- https://inventorylab.threecolts.support/en/articles/10415904-can-inventorylab-handle-additional-marketplaces-ebay-etsy-etc  
- https://www.rithum.com/terms/marketplaces/  
- https://www.sellbrite.com/integrations/sellbrite-for-shopify/  

### When custom *is* appropriate (other RigSense line)

Custom sync (`shopintegrations` / fleet tooling) makes sense when:

- Inventory truth is a China warehouse / 3PL API, not Shopify  
- SKU mapping, kits, or order routing differ by marketplace and cannot be expressed in MC/Ced templates  
- You need deterministic multi-system reconciliation beyond what apps expose  

For Nautic Controls: Shopify *is* the warehouse system for Florida stock. Custom is premature.

---

## 6. Recommended architecture (&lt;20 SKUs)

### Target architecture

```
[Florida shelf stock]
        │
        ▼
[Shopify Admin inventory @ FL location]  ←── SOURCE OF TRUTH
        │
        ├── Storefront API → Next.js (Vercel) DTC
        │
        └── Marketplace Connect → eBay.com listings
                 │
                 ├── qty/price (Stock Level + Buffer 1)
                 ├── orders → Shopify (linked products only)
                 └── fulfill + tracking → eBay
```

### Setup checklist

1. **One Shopify location** representing Florida stock; do not split phantom locations.  
2. **SKU discipline:** identical Shopify variant SKU ↔ eBay Custom Label (SKU). Highest-confidence link match.  
3. **Finished-good SKUs for kits:** e.g. `NC-GW-KIT-01`, `NC-ENG-KIT-01`, `NC-BOARD-XX` each with their own on-hand qty (kits pre-built or reserved).  
4. Install **Marketplace Connect** → connect eBay → set eBay defaults (no auto-list until defaults reviewed).  
5. Map **inventory location** to Florida for eBay.  
6. List or link ≤20 products in **single edit** mode (Shopify docs call this best for small catalogs).  
7. Order transfer: **Only Orders with Linked Products**, send when **Complete** (paid).  
8. Enable eBay **Out of Stock Control** (Seller Hub selling preferences) so qty 0 hides rather than ending GTC listings (verify current eBay help in account).  
9. Pilot with 2–3 SKUs, sell/test order, confirm: Shopify available ↓, eBay qty ↓ within an hour, tracking returns to eBay.

### Pricing posture

- DTC can undercut eBay slightly or match after fee-aware eBay pricing.  
- Use Marketplace Connect **price adjustment** (% markup) if you want eBay = Shopify + fee cushion without maintaining two price fields.

### What NOT to build custom yet

- eBay Inventory/Offer publish pipeline  
- Webhook-based dual-write inventory service  
- Porting China-warehouse sync from `shopintegrations`  
- Kit BOM explosion across channels  
- Multi-marketplace middleware (Sellbrite/Rithum)  

Revisit custom only if: Marketplace Connect + CedCommerce both fail reliability, SKU count/complexity jumps (BOM kits sold as components + assemblies), or a non-Shopify WMS becomes truth.

---

## 7. Pitfalls

### Overselling

- Marketplace qty updates can lag **5–60 minutes**.  
- Concurrent Shopify + eBay buy on last unit is the classic failure.  
- Mitigations: Buffer 1; Max Quantity on scarce boards; avoid Fixed Quantity; don’t disable inventory sync “to be safe.”  
- Source: https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7377731825935-How-long-does-it-take-to-update-inventory  

### SKU mapping

- Mismatched SKUs → duplicate listings or failed links.  
- Title-only matching needs human review.  
- CedCommerce explicitly requires matching Shopify SKU ↔ eBay custom label for reliable match.  
  - https://support.cedcommerce.com/portal/en/kb/articles/app-to-ebay  
  - https://support.cedcommerce.com/portal/en/kb/articles/manage-products-23-6-2026  

### Kits / bundles on eBay

- eBay **variations** = same product family (color/size), not arbitrary kits. Parts & Accessories compatibility must apply to **all** variations.  
  - https://www.ebay.co.uk/help/selling/listings/creating-managing-listings/multiquantity-listings-listings-variations?id=4150  
- Native eBay does **not** BOM-decrement component SKUs when a kit sells.  
- **Best practice for Nautic Controls:** sell kits as **distinct finished SKUs** with their own inventory. If you also sell bare boards, keep separate stock pools (physically reserve boards into kits, or accept that Shopify won’t auto-deduct components unless you add a kit app).  
- Specialized kit tools (e.g. 3Dsellers bundles) exist but add another sync brain — skip at this scale.

### Multi-location inventory

- Marketplace Connect can pin eBay qty to a **specific Shopify location**. Wrong location → eBay sells stock that isn’t in Florida.  
  - https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/8804291903503-Multi-Location-Inventory-Amazon-ebay-and-Walmart-US  
- CedCommerce similarly syncs from selected Shopify warehouse(s) only.  
  - https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/  
- Headless doesn’t create a second inventory pool; misconfigured apps do.

### Dual editors

- Editing live linked listings in both Seller Hub and Shopify causes overwrites and ghost qty. Pick Shopify (via MC) as editor of record after link.

### Order double-fulfillment

- If order import is on **and** staff also fulfills in Seller Hub, tracking/state can diverge. Fulfill in **Shopify only** when MC manages the listing.

### CedCommerce plan traps

- Free/Bronze listing vs **order sync caps** matter even for small catalogs once eBay sells. Check current App Store plan limits before relying on Bronze.  
  - https://apps.shopify.com/ebay-integration  

### Inventory Lab confusion

- Not an eBay↔Shopify inventory bridge. Amazon seller accounting/ops tool.  
  - https://inventorylab.threecolts.support/en/articles/10415904-can-inventorylab-handle-additional-marketplaces-ebay-etsy-etc  

---

## Tool comparison (compressed)

| Tool | Shopify truth? | eBay listings | Inventory | Orders | Tiny catalog fit |
|---|---|---|---|---|---|
| Marketplace Connect | Yes | Create/link | Operators + location | Import + tracking | **Primary** |
| CedCommerce | Yes (Shopify → app → eBay) | Templates/AI assist | Warehouse select | Import + tracking | **Fallback** |
| Sellbrite for Shopify | Yes (Shopify mode) | Yes (US eBay) | Rules | Import | If multi-channel expands |
| Classic Sellbrite | Sellbrite middle | Yes | Central | Yes | Only if multi-cart |
| Rithum | Platform middle | Yes | Yes | Yes | No (enterprise) |
| Inventory Lab | N/A | No auto | Amazon only | Amazon | No |
| Custom API | Your design | Full control | Full control | Full control | Later / other biz |

---

## Action plan for Nautic Controls

1. Land Florida stock; create Shopify products with stable SKUs and FL location qty.  
2. Open eBay seller account; create business policies (ship/return/payment); enable out-of-stock control.  
3. Install Marketplace Connect; connect eBay; **disable auto-list** until defaults correct.  
4. Manually categorize 3 pilot SKUs; Stock Level + Buffer 1; linked-orders-only import.  
5. Run a controlled eBay test purchase; verify inventory + tracking loop.  
6. Scale to remaining SKUs (&lt;20).  
7. If MC sync is unreliable after 2–4 weeks of real use, migrate to CedCommerce (Silver once order volume exceeds Bronze caps).  
8. Keep `shopintegrations` / China-warehouse custom stack **isolated** from this store.

---

## Primary source index

| Topic | URL |
|---|---|
| MC overview | https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect |
| MC App Store + pricing | https://apps.shopify.com/marketplace-connect |
| MC eBay listing defaults | https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect/products/manage/ebay |
| Link existing listings | https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect/products/link-existing |
| List/edit products | https://help.shopify.com/en/manual/online-sales-channels/marketplaces/marketplace-connect/products/manage/list-and-edit-products |
| Inventory settings | https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7312134306191-Inventory-Settings |
| Inventory update latency | https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7377731825935-How-long-does-it-take-to-update-inventory |
| Multi-location | https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/8804291903503-Multi-Location-Inventory-Amazon-ebay-and-Walmart-US |
| Managing orders | https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7241800373903-Managing-Orders |
| Quick start | https://www.shopifymarketplaceconnecthelp.com/hc/en-us/articles/7249987736975-Quick-Start-Guide |
| Shopify blog (2026) | https://www.shopify.com/blog/shopify-ebay-integration |
| CedCommerce App Store | https://apps.shopify.com/ebay-integration |
| CedCommerce docs | https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/ |
| CedCommerce SKU matching | https://support.cedcommerce.com/portal/en/kb/articles/app-to-ebay |
| Sellbrite Shopify | https://www.sellbrite.com/integrations/sellbrite-for-shopify/ |
| Sellbrite channel matrix | https://support.sellbrite.com/en/articles/3367153-marketplace-and-shopping-cart-integrations |
| Rithum marketplaces terms | https://www.rithum.com/terms/marketplaces/ |
| Inventory Lab eBay stance | https://inventorylab.threecolts.support/en/articles/10415904-can-inventorylab-handle-additional-marketplaces-ebay-etsy-etc |
| eBay selling fees | https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822 |
| eBay variations | https://www.ebay.co.uk/help/selling/listings/creating-managing-listings/multiquantity-listings-listings-variations?id=4150 |
| eBay inventory onboarding / policies | https://ir.ebaystatic.com/cr/v/c1/rsc/feeds/v1/guide-inventory-onboarding.pdf |
| eBay Inventory API overview | https://developer.ebay.com/api-docs/sell/inventory/overview.html |
