import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";

import placeholderTexture from "../color/numbers_template.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

interface FudgeLayeredMaterialProps
  extends Omit<JSX.IntrinsicElements["meshPhysicalMaterial"], "color" | "map"> {
  backgroundTexture?: string | null;
  backgroundColor?: string;
  symbolColor: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  envMapIntensity?: number;
  emissive?: string;
  emissiveIntensity?: number;
  sheen?: number;
  sheenColor?: string;
  transmission?: number;
  thickness?: number;
  attenuationColor?: string;
  attenuationDistance?: number;
  symbolDepth?: number;
  symbolRoughnessBoost?: number;
  symbolMetalnessFade?: number;
  symbolOcclusionStrength?: number;
  symbolClearcoatStrength?: number;
}

interface TextureSurface {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  imageData: ImageData;
}

interface FudgeMaterialMaps {
  albedoMap: THREE.Texture;
  aoMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  metalnessMap: THREE.Texture;
  normalMap: THREE.Texture;
  clearcoatMap?: THREE.Texture;
}

type FudgeSymbol = "plus" | "minus" | "blank";

const DEFAULT_TEXTURE_SIZE = 2048;
const FACE_SIZE = 236 / 2048;
const FUDGE_FACES: Array<{ x: number; y: number; symbol: FudgeSymbol }> = [
  { x: 147.5 / 2048, y: 372 / 2048, symbol: "minus" },
  { x: 379 / 2048, y: 854.5 / 2048, symbol: "minus" },
  { x: 380 / 2048, y: 141.5 / 2048, symbol: "blank" },
  { x: 380 / 2048, y: 618 / 2048, symbol: "blank" },
  { x: 381 / 2048, y: 383.5 / 2048, symbol: "plus" },
  { x: 609.5 / 2048, y: 379.5 / 2048, symbol: "plus" },
];

function getTextureSize(texture: THREE.Texture | null | undefined) {
  if (!texture) {
    return null;
  }

  const image = texture.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | OffscreenCanvas
    | ImageBitmap
    | undefined;

  if (!image) {
    return null;
  }

  const width = "naturalWidth" in image ? image.naturalWidth : image.width;
  const height = "naturalHeight" in image ? image.naturalHeight : image.height;

  if (!width || !height) {
    return null;
  }

  return { width, height };
}

function getTextureImage(texture: THREE.Texture) {
  return texture.image as CanvasImageSource | undefined;
}

function readTextureSurface(
  texture: THREE.Texture,
  width: number,
  height: number
): TextureSurface | null {
  const image = getTextureImage(texture);
  if (!image || typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.drawImage(image, 0, 0, width, height);

  return {
    canvas,
    context,
    imageData: context.getImageData(0, 0, width, height),
  };
}

function createSolidSurface(
  width: number,
  height: number,
  color: THREE.Color
): TextureSurface | null {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.fillStyle = `#${color.getHexString()}`;
  context.fillRect(0, 0, width, height);

  return {
    canvas,
    context,
    imageData: context.getImageData(0, 0, width, height),
  };
}

function createCanvasTexture(
  canvas: HTMLCanvasElement,
  sourceTexture: THREE.Texture,
  encoding: "LINEAR" | "SRGB"
) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = sourceTexture.wrapS;
  texture.wrapT = sourceTexture.wrapT;
  texture.minFilter = sourceTexture.minFilter;
  texture.magFilter = sourceTexture.magFilter;
  texture.generateMipmaps = true;
  texture.repeat.copy(sourceTexture.repeat);
  texture.offset.copy(sourceTexture.offset);
  texture.center.copy(sourceTexture.center);
  texture.rotation = sourceTexture.rotation;
  texture.anisotropy = sourceTexture.anisotropy;
  gltfTexture(texture, encoding);
  texture.needsUpdate = true;
  return texture;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const clamped = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();
}

function createSymbolSurface(width: number, height: number) {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";

  const faceSize = width * FACE_SIZE;
  const symbolWidth = faceSize * 0.52;
  const symbolThickness = faceSize * 0.14;
  const radius = symbolThickness * 0.45;

  for (const face of FUDGE_FACES) {
    if (face.symbol === "blank") {
      continue;
    }

    const centerX = width * face.x;
    const centerY = height * face.y;

    context.save();
    context.translate(centerX, centerY);

    drawRoundedRect(
      context,
      -symbolWidth / 2,
      -symbolThickness / 2,
      symbolWidth,
      symbolThickness,
      radius
    );

    if (face.symbol === "plus") {
      drawRoundedRect(
        context,
        -symbolThickness / 2,
        -symbolWidth / 2,
        symbolThickness,
        symbolWidth,
        radius
      );
    }

    context.restore();
  }

  return {
    canvas,
    context,
    imageData: context.getImageData(0, 0, width, height),
  };
}

function composeFudgeMaps(
  backgroundMap: THREE.Texture | null,
  backgroundColor: THREE.Color | undefined,
  placeholderMap: THREE.Texture,
  symbolColor: THREE.Color,
  roughness: number,
  metalness: number,
  symbolDepth: number,
  symbolRoughnessBoost: number,
  symbolMetalnessFade: number,
  symbolOcclusionStrength: number,
  symbolClearcoatStrength: number
): FudgeMaterialMaps {
  const size = getTextureSize(backgroundMap) ?? {
    width: DEFAULT_TEXTURE_SIZE,
    height: DEFAULT_TEXTURE_SIZE,
  };

  const backgroundSurface = backgroundMap
    ? readTextureSurface(backgroundMap, size.width, size.height)
    : createSolidSurface(
        size.width,
        size.height,
        backgroundColor ?? new THREE.Color("#808080")
      );
  const symbolSurface = createSymbolSurface(size.width, size.height);

  if (!backgroundSurface || !symbolSurface) {
    return {
      albedoMap: backgroundMap ?? placeholderMap,
      aoMap: placeholderMap,
      roughnessMap: placeholderMap,
      metalnessMap: placeholderMap,
      normalMap: placeholderMap,
    };
  }

  const albedoPixels = backgroundSurface.imageData.data;
  const symbolPixels = symbolSurface.imageData.data;

  const aoCanvas = document.createElement("canvas");
  aoCanvas.width = size.width;
  aoCanvas.height = size.height;
  const aoContext = aoCanvas.getContext("2d");

  const roughnessCanvas = document.createElement("canvas");
  roughnessCanvas.width = size.width;
  roughnessCanvas.height = size.height;
  const roughnessContext = roughnessCanvas.getContext("2d");

  const metalnessCanvas = document.createElement("canvas");
  metalnessCanvas.width = size.width;
  metalnessCanvas.height = size.height;
  const metalnessContext = metalnessCanvas.getContext("2d");

  const clearcoatCanvas = document.createElement("canvas");
  clearcoatCanvas.width = size.width;
  clearcoatCanvas.height = size.height;
  const clearcoatContext = clearcoatCanvas.getContext("2d");

  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = size.width;
  normalCanvas.height = size.height;
  const normalContext = normalCanvas.getContext("2d");

  if (
    !aoContext ||
    !roughnessContext ||
    !metalnessContext ||
    !clearcoatContext ||
    !normalContext
  ) {
    return {
      albedoMap: backgroundMap ?? placeholderMap,
      aoMap: placeholderMap,
      roughnessMap: placeholderMap,
      metalnessMap: placeholderMap,
      normalMap: placeholderMap,
    };
  }

  const aoImage = aoContext.createImageData(size.width, size.height);
  const roughnessImage = roughnessContext.createImageData(size.width, size.height);
  const metalnessImage = metalnessContext.createImageData(size.width, size.height);
  const clearcoatImage = clearcoatContext.createImageData(size.width, size.height);
  const normalImage = normalContext.createImageData(size.width, size.height);

  const aoOutput = aoImage.data;
  const roughnessOutput = roughnessImage.data;
  const metalnessOutput = metalnessImage.data;
  const clearcoatOutput = clearcoatImage.data;
  const normalOutput = normalImage.data;

  const maskValues = new Float32Array(size.width * size.height);
  const targetRed = Math.round(symbolColor.r * 255);
  const targetGreen = Math.round(symbolColor.g * 255);
  const targetBlue = Math.round(symbolColor.b * 255);

  for (let index = 0; index < albedoPixels.length; index += 4) {
    const alpha = symbolPixels[index + 3] / 255;
    const mask = smoothstep(0.02, 0.98, alpha);
    maskValues[index / 4] = mask;

    if (mask > 0.001) {
      albedoPixels[index] = Math.round(albedoPixels[index] * (1 - mask) + targetRed * mask);
      albedoPixels[index + 1] = Math.round(
        albedoPixels[index + 1] * (1 - mask) + targetGreen * mask
      );
      albedoPixels[index + 2] = Math.round(
        albedoPixels[index + 2] * (1 - mask) + targetBlue * mask
      );
    }
    albedoPixels[index + 3] = 255;

    const aoValue = THREE.MathUtils.clamp(1 - mask * symbolOcclusionStrength, 0, 1);
    const roughnessValue = THREE.MathUtils.clamp(
      roughness + mask * symbolRoughnessBoost,
      0,
      1
    );
    const metalnessValue = THREE.MathUtils.clamp(
      metalness * (1 - mask * symbolMetalnessFade),
      0,
      1
    );
    const clearcoatValue = THREE.MathUtils.clamp(1 - mask * symbolClearcoatStrength, 0, 1);

    const aoByte = Math.round(aoValue * 255);
    const roughnessByte = Math.round(roughnessValue * 255);
    const metalnessByte = Math.round(metalnessValue * 255);
    const clearcoatByte = Math.round(clearcoatValue * 255);

    aoOutput[index] = aoByte;
    aoOutput[index + 1] = aoByte;
    aoOutput[index + 2] = aoByte;
    aoOutput[index + 3] = 255;

    roughnessOutput[index] = roughnessByte;
    roughnessOutput[index + 1] = roughnessByte;
    roughnessOutput[index + 2] = roughnessByte;
    roughnessOutput[index + 3] = 255;

    metalnessOutput[index] = metalnessByte;
    metalnessOutput[index + 1] = metalnessByte;
    metalnessOutput[index + 2] = metalnessByte;
    metalnessOutput[index + 3] = 255;

    clearcoatOutput[index] = clearcoatByte;
    clearcoatOutput[index + 1] = clearcoatByte;
    clearcoatOutput[index + 2] = clearcoatByte;
    clearcoatOutput[index + 3] = 255;
  }

  for (let y = 0; y < size.height; y += 1) {
    for (let x = 0; x < size.width; x += 1) {
      const pixelIndex = y * size.width + x;
      const index = pixelIndex * 4;
      const left = maskValues[y * size.width + Math.max(0, x - 1)];
      const right = maskValues[y * size.width + Math.min(size.width - 1, x + 1)];
      const up = maskValues[Math.max(0, y - 1) * size.width + x];
      const down = maskValues[Math.min(size.height - 1, y + 1) * size.width + x];

      const slopeX = -(right - left) * symbolDepth * 0.5;
      const slopeY = -(down - up) * symbolDepth * 0.5;
      const inverseLength = 1 / Math.sqrt(slopeX * slopeX + slopeY * slopeY + 1);

      const nx = -slopeX * inverseLength;
      const ny = -slopeY * inverseLength;
      const nz = inverseLength;

      normalOutput[index] = Math.round((nx * 0.5 + 0.5) * 255);
      normalOutput[index + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      normalOutput[index + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      normalOutput[index + 3] = 255;
    }
  }

  backgroundSurface.context.putImageData(backgroundSurface.imageData, 0, 0);
  aoContext.putImageData(aoImage, 0, 0);
  roughnessContext.putImageData(roughnessImage, 0, 0);
  metalnessContext.putImageData(metalnessImage, 0, 0);
  clearcoatContext.putImageData(clearcoatImage, 0, 0);
  normalContext.putImageData(normalImage, 0, 0);

  const referenceTexture = backgroundMap ?? placeholderMap;

  return {
    albedoMap: createCanvasTexture(backgroundSurface.canvas, referenceTexture, "SRGB"),
    aoMap: createCanvasTexture(aoCanvas, referenceTexture, "LINEAR"),
    roughnessMap: createCanvasTexture(roughnessCanvas, referenceTexture, "LINEAR"),
    metalnessMap: createCanvasTexture(metalnessCanvas, referenceTexture, "LINEAR"),
    normalMap: createCanvasTexture(normalCanvas, referenceTexture, "LINEAR"),
    clearcoatMap: createCanvasTexture(clearcoatCanvas, referenceTexture, "LINEAR"),
  };
}

export function FudgeLayeredMaterial({
  backgroundTexture,
  backgroundColor,
  symbolColor,
  roughness,
  metalness,
  clearcoat = 0,
  clearcoatRoughness = 0,
  envMapIntensity = 1,
  emissive,
  emissiveIntensity = 0,
  sheen = 0,
  sheenColor,
  transmission = 0,
  thickness = 0,
  attenuationColor,
  attenuationDistance,
  symbolDepth = 2.15,
  symbolRoughnessBoost = 0.24,
  symbolMetalnessFade = 0.18,
  symbolOcclusionStrength = 0.34,
  symbolClearcoatStrength = 0.88,
  ...props
}: FudgeLayeredMaterialProps) {
  const [loadedBackgroundMap] = useTexture(
    [backgroundTexture ?? placeholderTexture],
    (textures) => gltfTexture(textures, ["SRGB"])
  );

  const resolvedBackgroundMap = backgroundTexture ? loadedBackgroundMap : null;
  const backgroundTint = useMemo(
    () => (backgroundColor ? new THREE.Color(backgroundColor) : undefined),
    [backgroundColor]
  );
  const symbolTint = useMemo(() => new THREE.Color(symbolColor), [symbolColor]);
  const emissiveColor = useMemo(
    () => (emissive ? new THREE.Color(emissive) : undefined),
    [emissive]
  );
  const sheenTint = useMemo(
    () => (sheenColor ? new THREE.Color(sheenColor) : undefined),
    [sheenColor]
  );
  const attenuationTint = useMemo(
    () => (attenuationColor ? new THREE.Color(attenuationColor) : undefined),
    [attenuationColor]
  );

  const materialMaps = useMemo(
    () =>
      composeFudgeMaps(
        resolvedBackgroundMap,
        backgroundTint,
        loadedBackgroundMap,
        symbolTint,
        roughness,
        metalness,
        symbolDepth,
        symbolRoughnessBoost,
        symbolMetalnessFade,
        symbolOcclusionStrength,
        symbolClearcoatStrength
      ),
    [
      resolvedBackgroundMap,
      backgroundTint,
      loadedBackgroundMap,
      symbolTint,
      roughness,
      metalness,
      symbolDepth,
      symbolRoughnessBoost,
      symbolMetalnessFade,
      symbolOcclusionStrength,
      symbolClearcoatStrength,
    ]
  );

  useEffect(() => {
    return () => {
      for (const texture of Object.values(materialMaps)) {
        if (texture instanceof THREE.CanvasTexture) {
          texture.dispose();
        }
      }
    };
  }, [materialMaps]);

  return (
    <meshPhysicalMaterial
      map={materialMaps.albedoMap}
      aoMap={materialMaps.aoMap}
      roughnessMap={materialMaps.roughnessMap}
      metalnessMap={materialMaps.metalnessMap}
      normalMap={materialMaps.normalMap}
      clearcoatMap={materialMaps.clearcoatMap}
      clearcoatNormalMap={materialMaps.normalMap}
      roughness={roughness}
      metalness={metalness}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
      envMapIntensity={envMapIntensity}
      aoMapIntensity={1.05}
      emissive={emissiveColor}
      emissiveIntensity={emissiveIntensity}
      sheen={sheen}
      sheenColor={sheenTint}
      transmission={transmission}
      thickness={thickness}
      attenuationColor={attenuationTint}
      attenuationDistance={attenuationDistance}
      {...props}
    />
  );
}