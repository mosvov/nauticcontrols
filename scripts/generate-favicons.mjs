/**
 * Generate favicon / app icon set from public/images/logo.png
 *
 * Follows the modern minimal set (Evil Martians + Next.js App Router):
 * - app/favicon.ico          (32x32 ICO for legacy / /favicon.ico)
 * - app/icon.png             (32x32 PNG for modern browsers)
 * - app/apple-icon.png       (180x180 Apple touch icon)
 * - public/icons/icon-192.png
 * - public/icons/icon-512.png
 * - public/icons/icon-maskable.png (512 with safe-zone padding)
 *
 * Usage: npm run icons
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "public/images/logo.png");

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

async function resizePng(pipeline, size, { background = "#000000", fit = "cover" } = {}) {
  return pipeline
    .clone()
    .resize(size, size, {
      fit,
      background,
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

/** Apple recommends ~20px padding on a 180px canvas. */
async function appleTouchIcon(pipeline) {
  const inner = 140;
  const canvas = 180;
  const logo = await pipeline
    .clone()
    .resize(inner, inner, { fit: "contain", background: "#000000" })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: "#000000",
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

/** Maskable: keep logo inside ~80% safe zone (409/512). */
async function maskableIcon(pipeline, canvas = 512) {
  const inner = Math.round(canvas * 0.8);
  const logo = await pipeline
    .clone()
    .resize(inner, inner, { fit: "contain", background: "#000000" })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: "#000000",
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

async function main() {
  const source = await squareSource();
  const appDir = path.join(root, "app");
  const iconsDir = path.join(root, "public/icons");
  await mkdir(iconsDir, { recursive: true });

  const icon32 = await resizePng(source, 32);
  const icon16 = await resizePng(source, 16);
  const icon192 = await resizePng(source, 192);
  const icon512 = await resizePng(source, 512);
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

  console.log("Generated favicons from public/images/logo.png:");
  for (const [file] of outputs) {
    console.log(`  - ${path.relative(root, file)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
