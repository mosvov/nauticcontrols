# Shopify Admin setup checklist (requires your login)

The Headless **private** token is Storefront-scoped (shop read only on Admin GraphQL). Catalog, theme, locations, and webhooks need you in Admin (or a custom app with `write_products`, `write_themes`, `write_locations`, `write_publications`).

Browser: log into https://admin.shopify.com/store/dev-store-749237498237499137

## A. Headless theme

1. Online Store → Themes → Add theme → Upload zip  
2. Upload `docs/shopify-headless-theme.zip` from this repo  
3. Customize → Theme settings → Storefront → hostname `www.nauticcontrols.com`  
4. Publish

## B. Florida location (done 2026-10-08)

1. Location: `Florida Warehouse` (Florida, USA)  
2. General shipping profile ships from **Florida Warehouse**  
3. Sellable inventory stocked at Florida; `Shop location (unused)` has `fulfillsOnlineOrders: false` (Shopify may block full deactivate if it is still the primary shell location)  
4. Package presets: create in Admin UI (API cannot create packages) - see § E

## C. Catalog import

1. Products → Import → upload `docs/shopify-catalog-seed.csv`  
2. For each product: Sales channels → enable **Headless**  
3. Create collections (exact titles):
   - `Hidden: Homepage Featured Items` (add gateway + engine kits)
   - `Hidden: Homepage Carousel` (add kits + boards)
4. Navigation → create menus:
   - `Next.js Frontend Header Menu`
   - `Next.js Frontend Footer Menu`
5. Pages: Shipping, Returns & Warranty, About, FCC / Responsible Party

## D. Webhooks (after Vercel has env)

Settings → Notifications → Webhooks →  
`https://www.nauticcontrols.com/api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>`  
for: products/create, products/update, products/delete, collections/create, collections/update, collections/delete

Local secret is in `.env.local` as `SHOPIFY_REVALIDATION_SECRET`.

## E. Shipping rates (done 2026-10-08; contiguous US)

General profile → zone **Contiguous United States** (lower 48 + DC):

| Rate | Condition | Price |
| --- | --- | ---: |
| US Ground | Subtotal $0 – $74.99 | **$9.95** |
| Free US Ground | Subtotal $75+ | **$0** |

Markets: United States active; Canada + Mexico **DRAFT**. Other destinations: contact for quote (policy). Detail: `docs/plans/2026-10-08-shipping-rates.md`. Policy: handle `shipping` + `docs/policy-pages/shipping.html`.

### Package presets (Admin UI - no API create)

Settings → Shipping and delivery → Packages → Add package:

| Name | Type | Outside dims (in) | Empty weight |
| --- | --- | --- | --- |
| Small board box | Box | 8 × 6 × 3 | 0.1 lb |
| Kit box | Box | 12 × 9 × 4 | 0.2 lb |

Set **Small board box** as default. Use these when buying Shopify Shipping labels.

## F. Optional: Admin API custom app

If you want agent automation later: Settings → Apps → Develop apps → create app with `write_products`, `read_products`, `write_inventory`, `read_locations`, `write_publications`, `write_themes`. Install and paste Admin token privately (not in chat).
