# Nautic Controls - online shop best practices

Practical guidance for a small US Signal K / marine hardware storefront (headless Shopify + Next.js).

## Live theme

**Studio Shelf** is the live storefront system (dense white shelf grid + sticky buy panel).

- Tokens: `app/globals.css` (`ink`, `shelf`, `tile`, `line`, `accent`, `mute`)
- Fonts: Syne (display) + Manrope (body) via `next/font`
- Stack: existing Next.js Commerce + Tailwind v4 + Storefront API `2026-10` (no Hydrogen / shadcn required for this pass)
- Watch (do not adopt yet): framework-agnostic `@shopify/hydrogen@preview` — see [`docs/hydrogen-preview-watch.md`](hydrogen-preview-watch.md)

Shopify Liquid headless theme zip remains redirect-only for checkout/email links.

## Positioning

- Lead with **ships from the USA** and Signal K / NMEA 2000 fit. That is the buying reason vs Hat Labs EU or Amazon.
- Kits first, boards second, connectors third. Homepage and nav should mirror that order.
- One job per page: browse, decide, or buy. Do not mix blog, docs dump, and checkout friction on the PDP.

## Catalog IA

| Surface | Rule |
| --- | --- |
| Home | Flagship HALPI2 hero + trust strip + shop-by-type + featured shelf + why-buy pillars |
| Collection / list | Dense shelf tiles; filter by type; sort by price and newest |
| PDP | Stage image, sticky buy panel, docs below CTA, related shelf row |
| Cart / checkout | Hosted Shopify checkout. Do not rebuild checkout |

Publish every sellable SKU to the **Headless** channel. Hidden homepage collections only for curated merchandising.

## PDP content that converts

1. **Hero title** buyers search for (product role, not only SKU code).
2. **Price + availability** next to CTA (In stock when true).
3. **Sales package** as bullets (what arrives).
4. **Compatibility** (Signal K, NMEA 2000, SH-ESP32, HALMET, Pi, voltage range).
5. **Docs** (Hat Labs product page + firmware examples). Keep regulatory fine print below the fold.
6. **Related** kits/parts that complete the install (enclosure, M12, SP13).

Images: first image = board or kit on clean background; then connectors, enclosure context, scale.

## Trust and ops

- Shipping, returns, FCC/disclaimer pages linked from footer and PDP.
- Contiguous US rates: **$9.95** under $75, **free ground** at $75+. Other destinations: contact for a quote (do not say “we don’t ship”). Peer UX: sitewide bar + PDP below ATC + cart progress + footer. See `docs/plans/2026-10-08-shipping-rates.md`.
- Inventory truth = Florida Warehouse location. Never sell ghost stock.
- Order emails and checkout links must land on `www.nauticcontrols.com` (headless theme hostname).
- Revalidation webhooks on product + collection changes so the storefront cache stays honest.

## UX / visual

- Light-first shelf system only (no dark Commerce chrome).
- List pages: scannable tiles with price and stock visible without hover.
- Mobile: sticky Add to cart on PDP.
- Accessibility: real buttons, contrast, focus rings, alt text from product titles.

## Performance

- Cache Storefront reads; revalidate on webhooks.
- Optimize Shopify CDN images (Next Image). Prefer AVIF/WebP.
- Keep cart and checkout dynamic; everything else static-friendly.

## SEO

- Unique title + description per product (role + brand + US stock).
- Product JSON-LD on PDP.
- Collection pages indexable; `hidden-*` collections stay out of nav/search facets.
- Canonical on `www.nauticcontrols.com`.

## Soft launch vs public

- Private: Vercel Authentication (all deployments) while wiring and seeding.
- Public: disable protection, confirm webhooks still hit `/api/revalidate` (bypass secret if needed).
- Do not run paid ads until PDP content, shipping page, and 1 full test order work.
