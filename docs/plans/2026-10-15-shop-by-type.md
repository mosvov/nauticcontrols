# Shop by type - visual plan

**Goal:** Make homepage category tiles scannable without product photos (catalog is small; SKU photos would look sparse and repeat Featured).

**Constraint:** Keep Nautic Controls shelf language (clean, industrial, no purple glow / AI-slop collage).

## What others do

| Approach | Who | Fit for us |
|---|---|---|
| Product photos on category tiles | Hat Labs, fashion/home | Weak when few SKUs; tiles look empty or duplicate Featured |
| Custom illustrated icons | SparkFun (homepage category marks) | Strong for electronics; brand-owned, not tied to inventory count |
| Outline icons + labels | DigiKey-style / utility UIs | Fast, already matches our Heroicons usage |
| Text-only cards | Current Nautic | Clear but slow to scan (Baymard) |
| AI lifestyle scenes | Common Shopify themes | Avoid - generic, hard to keep consistent, fights brand rules |

Research takeaway: visuals help, but for technical catalogs **labeled icons/illustrations beat sparse product photos**. Icons must stay literal and always paired with text (never icon-only).

## Recommendation (phased)

### Phase A - ship first (preferred)
**Outline icons + tighter copy** in `components/home/shop-categories.tsx`.

- One Heroicons (or simple custom SVG) per category, stroke style matching cart/search
- Keep title + one-line blurb
- Blurbs must not overlap (Kits vs Accessories today both say enclosures/connectors)
- Layout: keep 5 tiles; on `lg` stay 5-col; on mobile stack or 2-col

Suggested icon mapping:

| Category | Icon direction |
|---|---|
| Kits | Cube / archive (bundle) |
| Development Boards | CpuChip / rectangle-stack |
| Marine Computers | ComputerDesktop / server |
| Accessories | PuzzlePiece / wrench-screwdriver |
| NMEA 2000 | Share / link (network) |

Suggested blurbs (draft):

| Category | Blurb |
|---|---|
| Kits | Board + enclosure, ready to assemble |
| Development Boards | SH-ESP32, HALMET, bare modules |
| Marine Computers | HALPI2 and Pi hosts |
| Accessories | Enclosures, glands, small parts |
| NMEA 2000 | Cables, tees, backbone parts |

### Phase B - optional brand lift
**Custom monoline marks** (5 SVGs) in one stroke weight/color, stored under `public/icons/categories/` or `components/icons/categories/`.

- Hand-drawn or carefully prompted AI → **trace to SVG** (do not ship raw AI PNG/JPG)
- Same canvas, same stroke, mute/ink only
- Use if outline icons feel too generic after Phase A

### Explicitly skip for now
- Product photo tiles
- AI-generated photo-real category scenes
- Decorative abstract gradients as the “visual”

## Copy / IA tweaks in same pass
- Section title: keep `Shop by type` or switch to `Shop by category` (either fine; type matches current collections)
- Ensure each tile links to existing collection handles (no new Shopify work)

## Implementation sketch
1. Extend category config with `icon` (React component) + updated `blurb`
2. Tile layout: icon (24-28px) above title, or left of title on wider cards
3. Hover: existing border/shadow only; icon can shift to `text-accent`
4. A11y: decorative icons `aria-hidden`; link name remains title + blurb
5. Verify desktop + mobile in browser

## Success criteria
- Categories readable in <2s without reading every blurb
- No dependence on which SKUs are in stock
- Visual language matches navbar/cart icons
- Distinct blurbs; no duplicate “enclosures and connectors”

## Open choice for you
Confirm Phase A (Heroicons now) vs jump straight to Phase B (custom SVGs).
