/**
 * Generate favicon / app icon set
 *
 * Tab icons (16/32/192) use public/images/favicon-mark.svg (blue disc + waves).
 * Apple touch + 512 + maskable use the full logo on a dark plate.
 *
 * Usage: npm run icons
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "public/images/logo.png");
const tabMarkPath = path.join(root, "public/images/favicon-mark.svg");

const APP_PLATE = "#0B1220";

/** Pack one or more PNG buffers into a multi-size .ico (PNG-compressed). */
function pngBuffersToIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + entrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  for (const png of pngBuffers) {
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function squareSource() {
  const image = sharp(sourcePath);
  const { width = 0, height = 0 } = await image.metadata();
  const size = Math.min(width, height);

  return image
    .extract({
      left: Math.floor((width - size) / 2),
      top: Math.floor((height - size) / 2),
      width: size,
      height: size,
    })
    .png();
}

async function renderMark(markSvg, size) {
  return sharp(markSvg)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Opaque hard plate for Apple / maskable (platforms dislike transparency). */
async function platedIcon(pipeline, canvas, { background, padRatio = 0.1 } = {}) {
  const inner = Math.max(1, Math.round(canvas * (1 - padRatio * 2)));
  const logo = await pipeline
    .clone()
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background,
    },
  })
    .composite([
      {
        input: logo,
        left: Math.round((canvas - inner) / 2),
        top: Math.round((canvas - inner) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function appleTouchIcon(pipeline) {
  return platedIcon(pipeline, 180, { background: APP_PLATE, padRatio: 20 / 180 });
}

async function maskableIcon(pipeline, canvas = 512) {
  return platedIcon(pipeline, canvas, { background: APP_PLATE, padRatio: 0.1 });
}

async function main() {
  const source = await squareSource();
  const markSvg = await readFile(tabMarkPath);
  const appDir = path.join(root, "app");
  const iconsDir = path.join(root, "public/icons");
  await mkdir(iconsDir, { recursive: true });

  const icon16 = await renderMark(markSvg, 16);
  const icon32 = await renderMark(markSvg, 32);
  const icon192 = await renderMark(markSvg, 192);
  const icon512 = await platedIcon(source, 512, { background: APP_PLATE, padRatio: 0.08 });
  const apple = await appleTouchIcon(source);
  const maskable = await maskableIcon(source, 512);
  const faviconIco = pngBuffersToIco([icon16, icon32]);

  const outputs = [
    [path.join(appDir, "favicon.ico"), faviconIco],
    [path.join(appDir, "icon.png"), icon32],
    [path.join(appDir, "apple-icon.png"), apple],
    [path.join(iconsDir, "icon-192.png"), icon192],
    [path.join(iconsDir, "icon-512.png"), icon512],
    [path.join(iconsDir, "icon-maskable.png"), maskable],
  ];

  await Promise.all(outputs.map(([file, buf]) => writeFile(file, buf)));

  console.log("Generated favicons:");
  console.log(`  tab mark: ${path.relative(root, tabMarkPath)}`);
  console.log(`  full logo: ${path.relative(root, sourcePath)} (apple / 512 / maskable)`);
  for (const [file] of outputs) {
    console.log(`  - ${path.relative(root, file)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
