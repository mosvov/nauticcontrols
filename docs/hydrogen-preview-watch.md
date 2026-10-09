# Watch: `@shopify/hydrogen@preview` (framework-agnostic Hydrogen)

**Status as of 2026-10-08:** Developer preview. **Do not adopt for production on Nautic Controls yet.**

| Item | Value |
| --- | --- |
| npm tag | `@shopify/hydrogen@preview` |
| Version noted | `2026.10.0-preview.5` (published 2026-10-08) |
| Stable React library (current path) | `@shopify/hydrogen-react` (optional polish on Next) |
| Supported Hydrogen today | `@shopify/hydrogen@latest` = React Router + Oxygen |
| Our stack | Next.js Commerce-style + Headless channel + Storefront API `2026-10` |

## What this preview is

Shopify + Vercel rebuilt Hydrogen as a **framework-agnostic SDK** (plain JS core + thin bindings), not only React Router. Next.js is a first-class target via:

```bash
npx @shopify/hydrogen@preview setup
```

It includes typed Storefront client, cart handlers / same-origin proxies, analytics + consent, Shop Pay, agent skills, and multi-framework examples (Next, SvelteKit, Nuxt, Astro, SolidStart, React Router).

Official docs:

- [Hydrogen developer preview](https://shopify.dev/docs/storefronts/headless/developer-preview)
- [Announcement](https://hydrogen.shopify.dev/update/hydrogen-developer-preview)
- [Release notes stream](https://hydrogen.shopify.dev/updates/)

## Why we are waiting

Shopify’s own guidance:

- Labeled **developer preview**; **API will change**
- Migration guidance comes **when APIs stabilize**
- **Current** React Router Hydrogen remains the fully supported Hydrogen path
- Examples are proof-of-concepts; expect breaking preview releases (e.g. Shop Pay / `buyerIp` churn in Aug 2026 notes)

For this repo, adopting preview early would mean rewriting cart, request proxies, and analytics around preview APIs while we already have a working Cart API + server-action cart. That is high churn for a pilot store.

## What we use until then

1. **Storefront API** pinned to latest stable in [`lib/constants.ts`](../lib/constants.ts) (`SHOPIFY_STOREFRONT_API_VERSION`).
2. **Custom** [`lib/shopify`](../lib/shopify) + [`components/cart`](../components/cart) (Vercel Commerce pattern).
3. Optional later: stable **`@shopify/hydrogen-react`** for analytics / Shop Pay / UI helpers **without** replacing the cart (see research brief).
4. **Not** `@shopify/hydrogen@preview` until the checklist below passes.

## Stability checklist (adopt only when all are true)

- [ ] Shopify docs drop “developer preview” / call it stable GA (or equivalent)
- [ ] Official **migration guide** from preview → stable (or “APIs stabilized” notice)
- [ ] npm `preview` tag promoted or a non-prerelease `2026.x.y` ships for the new SDK
- [ ] Vercel / Shopify Next reference adopts it for production templates (e.g. vercel.shop note)
- [ ] At least one quiet release cycle with no breaking cart / analytics / request-handler changes
- [ ] Spike on a branch: Next App Router + our catalog + cart + checkout smoke pass

## How to keep an eye on it (quarterly or when shipping storefront work)

1. `npm view @shopify/hydrogen dist-tags` — compare `preview` vs `latest`
2. [hydrogen.shopify.dev/updates](https://hydrogen.shopify.dev/updates/) — preview release notes
3. [GitHub Discussion #3876](https://github.com/Shopify/hydrogen/discussions/3876) — roadmap / GA questions
4. [shopify.dev developer preview](https://shopify.dev/docs/storefronts/headless/developer-preview) — wording changes from “preview” to stable
5. Update the version table at the top of this file when a new `preview.N` ships

## When it becomes stable: implementation outline

Do **not** start this until the checklist passes. Then prefer a dedicated branch:

1. Spike with `npx @shopify/hydrogen@preview setup` (or the GA install command) on a throwaway Next app against the Headless channel.
2. Map preview primitives onto this repo:
   - Storefront client + `gql()` vs [`lib/shopify/index.ts`](../lib/shopify/index.ts)
   - Request handlers / same-origin proxy vs direct `shopifyFetch`
   - Cart store / React bindings vs [`components/cart`](../components/cart)
   - Analytics + Customer Privacy vs any interim `hydrogen-react` wiring
   - Shop Pay + money helpers
3. Decide migrate vs coexist: full cart cutover only if preview cart is clearly better than our server-action cart; otherwise adopt client/proxy/analytics first.
4. Keep hosted Shopify checkout (`checkoutUrl`); do not rebuild checkout.
5. Re-run [`scripts/verify-storefront.mjs`](../scripts/verify-storefront.mjs), cart smoke, and checkout smoke from [`docs/phase2-golive-runbook.md`](phase2-golive-runbook.md).
6. Update [`docs/shop-best-practices.md`](shop-best-practices.md) and this file to “adopted”.

## Related

- [`docs/research-headless-shopify-nextjs-vercel-2026.md`](research-headless-shopify-nextjs-vercel-2026.md) — stack choice (Next + Headless channel)
- [`docs/shop-best-practices.md`](shop-best-practices.md) — live storefront rules
