import * as THREE from "three";

import divineAmethystDiffuse from "../divine_amethyst/diffuse.png";
import divineBloodDiffuse from "../divine_blood/diffuse.png";
import divineEmeraldDiffuse from "../divine_emerald/diffuse.png";
import divineGoldDiffuse from "../divine_gold/diffuse.png";
import divineIceDiffuse from "../divine_ice/diffuse.png";
import divineNebulaDiffuse from "../divine_nebula/diffuse.png";
import divineObsidianDiffuse from "../divine_obsidian/diffuse.png";
import divinePearlDiffuse from "../divine_pearl/diffuse.png";
import divineSapphireDiffuse from "../divine_sapphire/diffuse.png";
import divineVoidDiffuse from "../divine_void/diffuse.png";
import { COLOR_SKINS } from "../color/ColorMaterial";
import { useCustomSkinStore, CustomSkinType } from "../../../store/customSkinStore";
import { FudgeLayeredMaterial } from "./FudgeLayeredMaterial";
import { DiceStyle } from "../../types/DiceStyle";

/**
 * Fudge dice material.
 * Keeps the selected skin background, but replaces D6 numerals with
 * + / - / blank symbols at the current UV positions.
 */

function getContrastSymbolColor(backgroundColor: string) {
  const color = new THREE.Color(backgroundColor);
  const toLinear = (channel: number) => {
    if (channel <= 0.04045) {
      return channel / 12.92;
    }

    return Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const luminance =
    toLinear(color.r) * 0.2126 +
    toLinear(color.g) * 0.7152 +
    toLinear(color.b) * 0.0722;

  return luminance > 0.42 ? "#1b140f" : "#f6f1e8";
}

function getCustomTypeProperties(type: CustomSkinType) {
  switch (type) {
    case "solid":
      return {
        roughness: 0.35,
        metalness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
      };
    case "metallic":
      return {
        roughness: 0.1,
        metalness: 0.95,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.8,
      };
    case "neon":
      return {
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        emissiveIntensity: 0.5,
      };
    case "glossy":
      return {
        roughness: 0.05,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      };
    case "matte":
      return {
        roughness: 0.8,
        metalness: 0.0,
        clearcoat: 0,
        clearcoatRoughness: 0,
      };
  }
}

export function FudgeMaterial(
  { diceStyle, ...props }: { diceStyle: DiceStyle } & JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  const customConfig = useCustomSkinStore((s) => s.config);

  switch (diceStyle) {
    case "DIVINE_AMETHYST":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineAmethystDiffuse}
          symbolColor="#9966cc"
          roughness={0.35}
          metalness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          {...props}
        />
      );
    case "DIVINE_BLOOD":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineBloodDiffuse}
          symbolColor="#cc2233"
          roughness={0.3}
          metalness={0.15}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
          {...props}
        />
      );
    case "DIVINE_EMERALD":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineEmeraldDiffuse}
          symbolColor="#2ecc71"
          roughness={0.3}
          metalness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
          {...props}
        />
      );
    case "DIVINE_GOLD":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineGoldDiffuse}
          symbolColor="#651408"
          roughness={0.38}
          metalness={0.72}
          clearcoat={0.3}
          clearcoatRoughness={0.42}
          envMapIntensity={0.82}
          {...props}
        />
      );
    case "DIVINE_ICE":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineIceDiffuse}
          symbolColor="#aee8ff"
          roughness={0.15}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          transmission={0.15}
          thickness={1.5}
          {...props}
        />
      );
    case "DIVINE_NEBULA":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineNebulaDiffuse}
          symbolColor="#6a0dad"
          roughness={0.35}
          metalness={0.15}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          {...props}
        />
      );
    case "DIVINE_OBSIDIAN":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineObsidianDiffuse}
          symbolColor="#1a1a2e"
          roughness={0.08}
          metalness={0.4}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          {...props}
        />
      );
    case "DIVINE_PEARL":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divinePearlDiffuse}
          symbolColor="#f5f0e6"
          roughness={0.2}
          metalness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          sheen={0.8}
          sheenColor="#f0e6d3"
          {...props}
        />
      );
    case "DIVINE_SAPPHIRE":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineSapphireDiffuse}
          symbolColor="#1e3a8a"
          roughness={0.25}
          metalness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          {...props}
        />
      );
    case "DIVINE_VOID":
      return (
        <FudgeLayeredMaterial
          backgroundTexture={divineVoidDiffuse}
          symbolColor="#0d0d1a"
          roughness={0.3}
          metalness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          {...props}
        />
      );
    case "CUSTOM": {
      const typeProps = getCustomTypeProperties(customConfig.type);
      const emissive = customConfig.type === "neon" ? customConfig.baseColor : undefined;

      return (
        <FudgeLayeredMaterial
          backgroundTexture={customConfig.backgroundImage}
          backgroundColor={customConfig.baseColor}
          symbolColor={customConfig.numberColor}
          roughness={typeProps.roughness}
          metalness={typeProps.metalness}
          clearcoat={typeProps.clearcoat}
          clearcoatRoughness={typeProps.clearcoatRoughness}
          envMapIntensity={typeProps.envMapIntensity ?? 1}
          emissive={emissive}
          emissiveIntensity={typeProps.emissiveIntensity ?? 0}
          {...props}
        />
      );
    }
    default: {
      const colorConfig = COLOR_SKINS[diceStyle];

      return (
        <FudgeLayeredMaterial
          backgroundColor={colorConfig.color}
          symbolColor={colorConfig.numberColor ?? getContrastSymbolColor(colorConfig.color)}
          roughness={colorConfig.roughness}
          metalness={colorConfig.metalness}
          clearcoat={colorConfig.clearcoat ?? 0}
          clearcoatRoughness={colorConfig.clearcoatRoughness ?? 0}
          envMapIntensity={colorConfig.envMapIntensity ?? 1}
          emissive={colorConfig.emissive}
          emissiveIntensity={colorConfig.emissiveIntensity ?? 0}
          sheen={colorConfig.sheen ?? 0}
          sheenColor={colorConfig.sheenColor}
          {...props}
        />
      );
    }
  }
}
