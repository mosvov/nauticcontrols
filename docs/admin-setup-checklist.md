# Shopify Admin setup checklist (requires your login)

**Production store (do all new work here):**  
https://admin.shopify.com/store/nautic-controls-bh11vkhs  
Domain: `nautic-controls-bh11vkhs.myshopify.com`

**Staging (keep for experiments; do not delete yet):**  
https://admin.shopify.com/store/dev-store-749237498237499137

The Headless **private** token is Storefront-scoped. Catalog, theme, locations, and webhooks need you in Admin (or a custom app with `write_products`, `write_themes`, `write_locations`, `write_publications`).

## A. Headless channel + tokens

1. Sales channels → add **Headless**
2. Create storefront (e.g. "Nautic Controls Web")
3. Copy public + private Storefront API tokens into a password manager (not chat, not git)
4. Generate a fresh `SHOPIFY_REVALIDATION_SECRET` for Production

## B. Headless theme

1. Online Store → Themes → Add theme → Upload zip  
2. Upload `docs/shopify-headless-theme.zip` from this repo  
3. Customize → Theme settings → Storefront → hostname `www.nauticcontrols.com`  
4. Publish

## C. Florida location

1. Location: `Florida Warehouse` (Florida, USA)  
2. General shipping profile ships from **Florida Warehouse**  
3. Sellable inventory stocked at Florida; unused default Shop location: `fulfillsOnlineOrders: false` if Shopify blocks deactivate  
4. Package presets: create in Admin UI - see § F

## D. Catalog import

1. Products → Import → upload `docs/shopify-catalog-seed.csv`  
2. For each product: Sales channels → enable **Headless**  
3. Create collections (exact titles):
   - `Hidden: Homepage Featured Items` (add gateway + engine kits)
   - `Hidden: Homepage Carousel` (add kits + boards)
4. Navigation → create menus:
   - `Next.js Frontend Header Menu`
   - `Next.js Frontend Footer Menu` (optional; storefront footer links are hard-coded in `components/layout/footer.tsx`)
5. Pages: Shipping, Returns & Warranty, About, FCC / Responsible Party, Privacy, Terms of Service
   - Handles must be: `shipping`, `returns`, `about`, `fcc`, `privacy`, `terms`
   - Paste HTML from `docs/policy-pages/<handle>.html` into each page body
   - Publish to the **Headless** sales channel

## E. Webhooks (after Vercel Production has env)

Settings → Notifications → Webhooks →  
`https://www.nauticcontrols.com/api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>`  
for: products/create, products/update, products/delete, collections/create, collections/update, collections/delete  
(optional pages/create|update|delete)

Use the **Production** secret, not the staging one.

## F. Shipping rates (contiguous US)

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

## G. Payments & tax

1. Enable Shopify Payments (USD)
2. Legal business name as registered
3. Florida sales tax if required; configure Shopify Tax

## H. Optional: Admin API custom app

If you want agent automation on the live store: Settings → Apps → Develop apps → create app with `write_products`, `read_products`, `write_inventory`, `read_locations`, `write_publications`, `write_themes`, `write_online_store_navigation`, `write_content`, `read_files`, `write_files`. Install and paste Admin token privately (not in chat).

For checkout branding automation (Development / Plus only), also add:
`read_checkout_branding_settings`, `write_checkout_branding_settings`

Then: `node scripts/apply-brand-assets.mjs --checkout`

## I. Brand assets (Settings → General → Branding)

**Admin page:** https://admin.shopify.com/store/nautic-controls-bh11vkhs/settings/general/branding

Shopify has **no public write API** for Brand kit fields. Fill them once in Admin. Logos and cover are already in **Content → Files**.

**Verified empty (Storefront Brand API):** slogan, description, logos, cover, colors were unset before this pass.

### Assets already uploaded

| Role | Filename in Files | Spec |
| --- | --- | --- |
| Default + square logo | `nautic-controls-logo.png` | 638×638 PNG (from `public/images/logo.png`) |
| Cover image | `nautic-controls-brand-cover.jpg` | 1920×1080 JPEG (from `public/images/brand/cover-1920x1080.jpg`) |

Local cover source: `public/images/brand/cover-1920x1080.jpg`. Re-upload / verify: `node scripts/apply-brand-assets.mjs` then `--verify` after Admin save.

### Paste these values

| Field | Value |
| --- | --- |
| Default logo | Select `nautic-controls-logo.png` |
| Square logo | Same file |
| Primary color | `#2F6FED` (contrast `#FFFFFF`) |
| Secondary color | `#1A2330` (contrast `#FFFFFF`) |
| Optional 2nd secondary | `#F5F7FA` (contrast `#1A2330`) |
| Slogan (≤80) | `US stock marine and RV electronics for Signal K and NMEA 2000.` |
| Description (≤150) | `Marine and RV electronics: Signal K kits, boards, HALPI2, and NMEA 2000 parts. US stock. Free ground shipping $75+.` |
| Cover image | Select `nautic-controls-brand-cover.jpg` |
| Social links | Skip until accounts exist |

Colors match storefront tokens in `app/globals.css` (`accent`, `ink`, `shelf`).

### Checkout branding (applied via API)

Profile: `Nautic Controls configuration` (`gid://shopify/CheckoutProfile/11754209563`)

| Setting | Value |
| --- | --- |
| Header logo | `nautic-controls-logo.png` (max width 120) |
| Global accent | `#2F6FED` |
| Global brand | `#1A2330` |
| Scheme1 base background | `#F5F7FA` |
| Corner radius | base 6 / large 8 / small 4 |

Re-apply: `node scripts/apply-brand-assets.mjs --checkout`  
Preview: https://admin.shopify.com/store/nautic-controls-bh11vkhs/settings/checkout → Customize

### Adjacent (after Brand kit is saved)

1. **Notification emails** - https://admin.shopify.com/store/nautic-controls-bh11vkhs/settings/notifications → confirm order emails show the logo; if blank, set logo to `nautic-controls-logo.png`.
2. **Storefront favicon** - already handled in Next.js (`npm run icons`); Brand page does not replace it.
3. Confirm Brand kit via: `node scripts/apply-brand-assets.mjs --verify`

## Env keys (Vercel Production only)

```
COMPANY_NAME
SITE_NAME
SHOPIFY_STORE_DOMAIN=nautic-controls-bh11vkhs.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SHOPIFY_STOREFRONT_PRIVATE_TOKEN   # optional but preferred
SHOPIFY_REVALIDATION_SECRET
```

Keep Vercel Preview / local `.env.local` on the **staging** det store until you deliberately cut over.
