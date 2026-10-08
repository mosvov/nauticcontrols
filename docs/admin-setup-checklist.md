# Shopify Admin setup checklist (requires your login)

The Headless **private** token is Storefront-scoped (shop read only on Admin GraphQL). Catalog, theme, locations, and webhooks need you in Admin (or a custom app with `write_products`, `write_themes`, `write_locations`, `write_publications`).

Browser: log into https://admin.shopify.com/store/dev-store-749237498237499137

## A. Headless theme

1. Online Store → Themes → Add theme → Upload zip  
2. Upload `docs/shopify-headless-theme.zip` from this repo  
3. Customize → Theme settings → Storefront → hostname `www.nauticcontrols.com`  
4. Publish

## B. Florida location

1. Settings → Locations → Add location  
2. Name: `Florida Warehouse`  
3. Address: 606 Stargaze Lane, Saint Augustine, FL 32095, US  
4. Make it the default fulfillment location when ready

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

## E. Optional: Admin API custom app

If you want agent automation later: Settings → Apps → Develop apps → create app with `write_products`, `read_products`, `write_inventory`, `read_locations`, `write_publications`, `write_themes`. Install and paste Admin token privately (not in chat).
