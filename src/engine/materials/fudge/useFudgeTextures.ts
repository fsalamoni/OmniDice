import { useMemo } from "react";
import * as THREE from "three";

/**
 * D6 face UV regions (pixel coordinates on 1024x1024, image-space top-left origin).
 * Extracted from the D6 GLB UV mapping.
 *
 * Fudge mapping:
 *   Face 1 (-Y) = blank,  Face 2 (-X) = +,  Face 3 (+Z) = -
 *   Face 4 (-Z) = -,      Face 5 (+X) = +,  Face 6 (+Y) = blank
 */
const D6_FACES: Array<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  symbol: "+" | "-" | "";
}> = [
  { x1: 13, y1: 775, x2: 134, y2: 895, symbol: "" }, // Face 1 blank
  { x1: 132, y1: 538, x2: 252, y2: 657, symbol: "+" }, // Face 2 plus
  { x1: 132, y1: 893, x2: 252, y2: 1014, symbol: "-" }, // Face 3 minus
  { x1: 132, y1: 656, x2: 252, y2: 777, symbol: "-" }, // Face 4 minus
  { x1: 132, y1: 775, x2: 252, y2: 895, symbol: "+" }, // Face 5 plus
  { x1: 250, y1: 775, x2: 370, y2: 895, symbol: "" }, // Face 6 blank
];

/** Flat normal color: (128, 128, 255) = pointing straight out */
const FLAT_NORMAL = "#8080ff";

/** Embossed normal colors for simulating raised symbols */
const NORMAL_HIGHLIGHT = "rgba(148, 148, 255, 1)"; // top/left edge highlight
const NORMAL_SHADOW = "rgba(108, 108, 255, 1)"; // bottom/right edge shadow

function cloneTexture(source: THREE.Texture): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  sw: number;
  sh: number;
} | null {
  const srcImage = source.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageBitmap;
  if (!srcImage) return null;

  const sw = srcImage.width || 1024;
  const sh = srcImage.height || 1024;
  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(srcImage as CanvasImageSource, 0, 0, sw, sh);

  return { canvas, ctx, sw, sh };
}

function makeCanvasTexture(
  canvas: HTMLCanvasElement,
  source: THREE.Texture
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = source.flipY;
  tex.colorSpace = source.colorSpace;
  tex.wrapS = source.wrapS;
  tex.wrapT = source.wrapT;
  tex.minFilter = source.minFilter;
  tex.magFilter = source.magFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Draw a fudge symbol shape on a canvas context.
 * Used for both albedo (white symbols) and normal map (embossed relief).
 */
function drawSymbol(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  _h: number,
  symbol: "+" | "-",
  color: string
) {
  ctx.fillStyle = color;
  const armLen = w * 0.28;
  const armThick = w * 0.11;
  // Horizontal bar
  ctx.fillRect(cx - armLen, cy - armThick / 2, armLen * 2, armThick);
  if (symbol === "+") {
    // Vertical bar
    ctx.fillRect(cx - armThick / 2, cy - armLen, armThick, armLen * 2);
  }
}

/**
 * Modifies the albedo and normal map textures for Fudge dice.
 *
 * - Albedo: Replaces D6 number regions with base color + white symbols
 * - Normal: Replaces D6 number regions with flat normal + embossed symbols
 *
 * Returns { fudgeAlbedo, fudgeNormal } textures.
 */
export function useFudgeTextures(
  sourceAlbedo: THREE.Texture,
  sourceNormal: THREE.Texture
): { fudgeAlbedo: THREE.Texture; fudgeNormal: THREE.Texture } {
  return useMemo(() => {
    // --- Modify Albedo ---
    const albedoData = cloneTexture(sourceAlbedo);
    if (!albedoData) return { fudgeAlbedo: sourceAlbedo, fudgeNormal: sourceNormal };
    const { canvas: albCanvas, ctx: albCtx, sw: asw, sh: ash } = albedoData;

    const scaleAX = asw / 1024;
    const scaleAY = ash / 1024;

    for (const face of D6_FACES) {
      const x1 = Math.floor(face.x1 * scaleAX);
      const y1 = Math.floor(face.y1 * scaleAY);
      const x2 = Math.ceil(face.x2 * scaleAX);
      const y2 = Math.ceil(face.y2 * scaleAY);
      const w = x2 - x1;
      const h = y2 - y1;
      const cx = x1 + w / 2;
      const cy = y1 + h / 2;

      // Sample base color from the edges (avoid number area)
      const imgData = albCtx.getImageData(x1 + 2, y1 + 2, 1, 1).data;
      const baseColor = `rgb(${imgData[0]}, ${imgData[1]}, ${imgData[2]})`;

      // Clear face region with base color
      albCtx.fillStyle = baseColor;
      albCtx.fillRect(x1, y1, w, h);

      // Draw white symbol
      if (face.symbol) {
        drawSymbol(albCtx, cx, cy, w, h, face.symbol, "#ffffff");
      }
    }

    const fudgeAlbedo = makeCanvasTexture(albCanvas, sourceAlbedo);

    // --- Modify Normal Map ---
    const normalData = cloneTexture(sourceNormal);
    if (!normalData) return { fudgeAlbedo, fudgeNormal: sourceNormal };
    const { canvas: nrmCanvas, ctx: nrmCtx, sw: nsw, sh: nsh } = normalData;

    const scaleNX = nsw / 1024;
    const scaleNY = nsh / 1024;

    for (const face of D6_FACES) {
      const x1 = Math.floor(face.x1 * scaleNX);
      const y1 = Math.floor(face.y1 * scaleNY);
      const x2 = Math.ceil(face.x2 * scaleNX);
      const y2 = Math.ceil(face.y2 * scaleNY);
      const w = x2 - x1;
      const h = y2 - y1;
      const cx = x1 + w / 2;
      const cy = y1 + h / 2;

      // Clear face region with flat normal (no bumps)
      nrmCtx.fillStyle = FLAT_NORMAL;
      nrmCtx.fillRect(x1, y1, w, h);

      // Draw embossed symbol as normal map relief
      if (face.symbol) {
        // Main body — slightly raised
        drawSymbol(nrmCtx, cx, cy, w, h, face.symbol, NORMAL_HIGHLIGHT);

        // Shadow edge (offset 1-2px down-right) for emboss effect
        const offset = Math.max(1, Math.round(w * 0.015));
        drawSymbol(
          nrmCtx,
          cx + offset,
          cy + offset,
          w,
          h,
          face.symbol,
          NORMAL_SHADOW
        );

        // Redraw main body on top to create clean emboss
        drawSymbol(nrmCtx, cx, cy, w, h, face.symbol, NORMAL_HIGHLIGHT);
      }
    }

    const fudgeNormal = makeCanvasTexture(nrmCanvas, sourceNormal);

    return { fudgeAlbedo, fudgeNormal };
  }, [sourceAlbedo, sourceNormal]);
}
