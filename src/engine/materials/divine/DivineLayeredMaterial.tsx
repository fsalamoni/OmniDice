import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";

import numbersTemplate from "../color/numbers_template.jpg";
import alignedNormal from "../iron/normal.jpg";
import alignedOrm from "../iron/orm.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

interface DivineLayeredMaterialProps
  extends Omit<JSX.IntrinsicElements["meshPhysicalMaterial"], "color" | "map"> {
  backgroundTexture?: string | null;
  backgroundColor?: string;
  numberColor: string;
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
  numberThresholdLow?: number;
  numberThresholdHigh?: number;
  numberDepth?: number;
  numberRoughnessBoost?: number;
  numberMetalnessFade?: number;
  numberOcclusionStrength?: number;
  numberClearcoatStrength?: number;
}

interface TextureSurface {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  imageData: ImageData;
}

interface DivineMaterialMaps {
  albedoMap: THREE.Texture;
  aoMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  metalnessMap: THREE.Texture;
  normalMap: THREE.Texture;
  clearcoatMap?: THREE.Texture;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const clamped = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

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

function composeDivineMaps(
  backgroundMap: THREE.Texture | null,
  backgroundColor: THREE.Color | undefined,
  numberMap: THREE.Texture,
  ormMap: THREE.Texture,
  baseNormalMap: THREE.Texture,
  numberColor: THREE.Color,
  thresholdLow: number,
  thresholdHigh: number,
  numberDepth: number,
  numberRoughnessBoost: number,
  numberMetalnessFade: number,
  numberOcclusionStrength: number,
  numberClearcoatStrength: number
): DivineMaterialMaps {
  const size =
    getTextureSize(backgroundMap) ??
    getTextureSize(numberMap) ??
    getTextureSize(ormMap) ??
    getTextureSize(baseNormalMap);

  if (!size || typeof document === "undefined") {
    return {
      albedoMap: backgroundMap,
      aoMap: ormMap,
      roughnessMap: ormMap,
      metalnessMap: ormMap,
      normalMap: baseNormalMap,
    };
  }

  const backgroundSurface = backgroundMap
    ? readTextureSurface(backgroundMap, size.width, size.height)
    : createSolidSurface(
        size.width,
        size.height,
        backgroundColor ?? new THREE.Color("#808080")
      );
  const numberSurface = readTextureSurface(numberMap, size.width, size.height);
  const ormSurface = readTextureSurface(ormMap, size.width, size.height);
  const normalSurface = readTextureSurface(
    baseNormalMap,
    size.width,
    size.height
  );

  if (!backgroundSurface || !numberSurface || !ormSurface || !normalSurface) {
    return {
      albedoMap: backgroundMap,
      aoMap: ormMap,
      roughnessMap: ormMap,
      metalnessMap: ormMap,
      normalMap: baseNormalMap,
    };
  }

  const albedoPixels = backgroundSurface.imageData.data;
  const numberPixels = numberSurface.imageData.data;
  const ormPixels = ormSurface.imageData.data;
  const normalPixels = normalSurface.imageData.data;

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

  const composedNormalCanvas = document.createElement("canvas");
  composedNormalCanvas.width = size.width;
  composedNormalCanvas.height = size.height;
  const composedNormalContext = composedNormalCanvas.getContext("2d");

  if (
    !aoContext ||
    !roughnessContext ||
    !metalnessContext ||
    !clearcoatContext ||
    !composedNormalContext
  ) {
    return {
      albedoMap: backgroundMap,
      aoMap: ormMap,
      roughnessMap: ormMap,
      metalnessMap: ormMap,
      normalMap: baseNormalMap,
    };
  }

  const aoImage = aoContext.createImageData(size.width, size.height);
  const roughnessImage = roughnessContext.createImageData(size.width, size.height);
  const metalnessImage = metalnessContext.createImageData(size.width, size.height);
  const clearcoatImage = clearcoatContext.createImageData(size.width, size.height);
  const composedNormalImage = composedNormalContext.createImageData(
    size.width,
    size.height
  );

  const aoOutput = aoImage.data;
  const roughnessOutput = roughnessImage.data;
  const metalnessOutput = metalnessImage.data;
  const clearcoatOutput = clearcoatImage.data;
  const normalOutput = composedNormalImage.data;

  const targetRed = Math.round(numberColor.r * 255);
  const targetGreen = Math.round(numberColor.g * 255);
  const targetBlue = Math.round(numberColor.b * 255);
  const maskValues = new Float32Array(size.width * size.height);

  for (let index = 0; index < albedoPixels.length; index += 4) {
    const luminance =
      (numberPixels[index] * 0.2126 +
        numberPixels[index + 1] * 0.7152 +
        numberPixels[index + 2] * 0.0722) /
      255;
    const mask = 1 - smoothstep(thresholdLow, thresholdHigh, luminance);
    maskValues[index / 4] = mask;

    if (mask <= 0.001) {
      albedoPixels[index + 3] = 255;
    } else {
      albedoPixels[index] = Math.round(
        albedoPixels[index] * (1 - mask) + targetRed * mask
      );
      albedoPixels[index + 1] = Math.round(
        albedoPixels[index + 1] * (1 - mask) + targetGreen * mask
      );
      albedoPixels[index + 2] = Math.round(
        albedoPixels[index + 2] * (1 - mask) + targetBlue * mask
      );
      albedoPixels[index + 3] = 255;
    }

    const baseAo = ormPixels[index] / 255;
    const baseRoughness = ormPixels[index + 1] / 255;
    const baseMetalness = ormPixels[index + 2] / 255;

    const aoValue = THREE.MathUtils.clamp(
      baseAo * (1 - mask * numberOcclusionStrength),
      0,
      1
    );
    const roughnessValue = THREE.MathUtils.clamp(
      baseRoughness + mask * numberRoughnessBoost,
      0,
      1
    );
    const metalnessValue = THREE.MathUtils.clamp(
      baseMetalness * (1 - mask * numberMetalnessFade),
      0,
      1
    );
    const clearcoatValue = THREE.MathUtils.clamp(
      1 - mask * numberClearcoatStrength,
      0,
      1
    );

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

      const engravedSlopeX = -(right - left) * numberDepth * 0.5;
      const engravedSlopeY = -(down - up) * numberDepth * 0.5;

      const baseNx = normalPixels[index] / 255 * 2 - 1;
      const baseNy = normalPixels[index + 1] / 255 * 2 - 1;
      const baseNz = Math.max(normalPixels[index + 2] / 255 * 2 - 1, 0.05);

      const baseSlopeX = -baseNx / baseNz;
      const baseSlopeY = -baseNy / baseNz;
      const slopeX = baseSlopeX + engravedSlopeX;
      const slopeY = baseSlopeY + engravedSlopeY;
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
  composedNormalContext.putImageData(composedNormalImage, 0, 0);

  return {
    albedoMap: createCanvasTexture(
      backgroundSurface.canvas,
      backgroundMap ?? numberMap,
      "SRGB"
    ),
    aoMap: createCanvasTexture(aoCanvas, ormMap, "LINEAR"),
    roughnessMap: createCanvasTexture(roughnessCanvas, ormMap, "LINEAR"),
    metalnessMap: createCanvasTexture(metalnessCanvas, ormMap, "LINEAR"),
    normalMap: createCanvasTexture(composedNormalCanvas, baseNormalMap, "LINEAR"),
    clearcoatMap: createCanvasTexture(clearcoatCanvas, ormMap, "LINEAR"),
  };
}

export function DivineLayeredMaterial({
  backgroundTexture,
  backgroundColor,
  numberColor,
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
  numberThresholdLow = 0.48,
  numberThresholdHigh = 0.72,
  numberDepth = 2.25,
  numberRoughnessBoost = 0.26,
  numberMetalnessFade = 0.18,
  numberOcclusionStrength = 0.4,
  numberClearcoatStrength = 0.88,
  ...props
}: DivineLayeredMaterialProps) {
  const [loadedBackgroundMap, numberMap, ormMap, normalMap] = useTexture(
    [backgroundTexture ?? numbersTemplate, numbersTemplate, alignedOrm, alignedNormal],
    (textures) => gltfTexture(textures, ["SRGB", "SRGB", "LINEAR", "LINEAR"])
  );

  const resolvedBackgroundMap = backgroundTexture ? loadedBackgroundMap : null;
  const backgroundTint = useMemo(
    () => (backgroundColor ? new THREE.Color(backgroundColor) : undefined),
    [backgroundColor]
  );
  const fontColor = useMemo(() => new THREE.Color(numberColor), [numberColor]);
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
      composeDivineMaps(
        resolvedBackgroundMap,
        backgroundTint,
        numberMap,
        ormMap,
        normalMap,
        fontColor,
        numberThresholdLow,
        numberThresholdHigh,
        numberDepth,
        numberRoughnessBoost,
        numberMetalnessFade,
        numberOcclusionStrength,
        numberClearcoatStrength
      ),
    [
      resolvedBackgroundMap,
      backgroundTint,
      numberMap,
      ormMap,
      normalMap,
      fontColor,
      numberThresholdLow,
      numberThresholdHigh,
      numberDepth,
      numberRoughnessBoost,
      numberMetalnessFade,
      numberOcclusionStrength,
      numberClearcoatStrength,
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
      aoMapIntensity={1.15}
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