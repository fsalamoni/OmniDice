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

/**
 * Takes an existing albedo THREE.Texture (from a dice style material),
 * draws fudge symbols (+, -, blank) over the D6 face regions,
 * and returns a new texture ready to use.
 */
export function useFudgeAlbedo(
  sourceAlbedo: THREE.Texture
): THREE.Texture {
  return useMemo(() => {
    const srcImage = sourceAlbedo.image as
      | HTMLImageElement
      | HTMLCanvasElement
      | ImageBitmap;
    if (!srcImage) return sourceAlbedo;

    // Determine source dimensions
    const sw = srcImage.width || 1024;
    const sh = srcImage.height || 1024;

    // Create a canvas and draw the original albedo
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(srcImage as CanvasImageSource, 0, 0, sw, sh);

    // Scale factor if texture is not 1024x1024
    const scaleX = sw / 1024;
    const scaleY = sh / 1024;

    // Paint fudge symbols over each D6 face region
    for (const face of D6_FACES) {
      const x1 = Math.floor(face.x1 * scaleX);
      const y1 = Math.floor(face.y1 * scaleY);
      const x2 = Math.ceil(face.x2 * scaleX);
      const y2 = Math.ceil(face.y2 * scaleY);
      const w = x2 - x1;
      const h = y2 - y1;
      const cx = x1 + w / 2;
      const cy = y1 + h / 2;

      // Clear the face region (fill with dark base matching the texture)
      // Sample a pixel from just outside the face region for base color
      const imgData = ctx.getImageData(x1 + 2, y1 + 2, 1, 1).data;
      const baseColor = `rgb(${imgData[0]}, ${imgData[1]}, ${imgData[2]})`;
      ctx.fillStyle = baseColor;
      ctx.fillRect(x1, y1, w, h);

      if (face.symbol === "+") {
        ctx.fillStyle = "#ffffff";
        const armLen = w * 0.28;
        const armThick = w * 0.10;
        // Horizontal bar
        ctx.fillRect(cx - armLen, cy - armThick / 2, armLen * 2, armThick);
        // Vertical bar
        ctx.fillRect(cx - armThick / 2, cy - armLen, armThick, armLen * 2);
      } else if (face.symbol === "-") {
        ctx.fillStyle = "#ffffff";
        const armLen = w * 0.28;
        const armThick = w * 0.10;
        // Horizontal bar only
        ctx.fillRect(cx - armLen, cy - armThick / 2, armLen * 2, armThick);
      }
      // blank = no drawing needed
    }

    // Create new texture from the modified canvas
    const newTexture = new THREE.CanvasTexture(canvas);
    // Copy settings from source
    newTexture.flipY = sourceAlbedo.flipY;
    newTexture.colorSpace = sourceAlbedo.colorSpace;
    newTexture.wrapS = sourceAlbedo.wrapS;
    newTexture.wrapT = sourceAlbedo.wrapT;
    newTexture.minFilter = sourceAlbedo.minFilter;
    newTexture.magFilter = sourceAlbedo.magFilter;
    newTexture.needsUpdate = true;

    return newTexture;
  }, [sourceAlbedo]);
}
