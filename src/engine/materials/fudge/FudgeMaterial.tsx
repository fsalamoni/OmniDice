import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gltfTexture } from "../../helpers/gltfTexture";
import { DiceStyle } from "../../types/DiceStyle";
import { useFudgeTextures } from "./useFudgeTextures";

// Import all style textures
import galaxyAlbedo from "../galaxy/albedo.jpg";
import galaxyOrm from "../galaxy/orm.jpg";
import galaxyNormal from "../galaxy/normal.jpg";

import gemstoneAlbedo from "../gemstone/albedo.jpg";
import gemstoneOrm from "../gemstone/orm.jpg";
import gemstoneNormal from "../gemstone/normal.jpg";

import glassAlbedo from "../glass/albedo.jpg";
import glassMask from "../glass/mask.png";
import glassNormal from "../glass/normal.jpg";

import ironAlbedo from "../iron/albedo.jpg";
import ironOrm from "../iron/orm.jpg";
import ironNormal from "../iron/normal.jpg";

import nebulaAlbedo from "../nebula/albedo.jpg";
import nebulaOrm from "../nebula/orm.jpg";
import nebulaNormal from "../nebula/normal.jpg";

import sunriseAlbedo from "../sunrise/albedo.jpg";
import sunriseOrm from "../sunrise/orm.jpg";
import sunriseNormal from "../sunrise/normal.jpg";

import sunsetAlbedo from "../sunset/albedo.jpg";
import sunsetOrm from "../sunset/orm.jpg";
import sunsetNormal from "../sunset/normal.jpg";

import walnutAlbedo from "../walnut/albedo.jpg";
import walnutOrm from "../walnut/orm.jpg";
import walnutNormal from "../walnut/normal.jpg";

const STYLE_TEXTURES: Record<
  DiceStyle,
  { albedo: string; orm: string; normal: string }
> = {
  GALAXY: { albedo: galaxyAlbedo, orm: galaxyOrm, normal: galaxyNormal },
  GEMSTONE: { albedo: gemstoneAlbedo, orm: gemstoneOrm, normal: gemstoneNormal },
  GLASS: { albedo: glassAlbedo, orm: glassMask, normal: glassNormal },
  IRON: { albedo: ironAlbedo, orm: ironOrm, normal: ironNormal },
  NEBULA: { albedo: nebulaAlbedo, orm: nebulaOrm, normal: nebulaNormal },
  SUNRISE: { albedo: sunriseAlbedo, orm: sunriseOrm, normal: sunriseNormal },
  SUNSET: { albedo: sunsetAlbedo, orm: sunsetOrm, normal: sunsetNormal },
  WALNUT: { albedo: walnutAlbedo, orm: walnutOrm, normal: walnutNormal },
};

/**
 * Fudge dice material that renders using the selected dice style
 * but with +, -, and blank symbols replacing numbers on both
 * the albedo (color) and normal (relief/bump) maps.
 */
export function FudgeMaterial({ diceStyle }: { diceStyle: DiceStyle }) {
  const texturePaths = STYLE_TEXTURES[diceStyle];

  const [albedoMap, ormMap, normalMap] = useTexture(
    [texturePaths.albedo, texturePaths.orm, texturePaths.normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );

  // Paint fudge symbols over both albedo AND normal map
  const { fudgeAlbedo, fudgeNormal } = useFudgeTextures(albedoMap, normalMap);

  // Render with style-specific properties (identical to each style's own material)
  switch (diceStyle) {
    case "GALAXY":
      return (
        <meshPhysicalMaterial
          map={fudgeAlbedo}
          aoMap={ormMap}
          metalnessMap={ormMap}
          roughnessMap={ormMap}
          normalMap={fudgeNormal}
          clearcoat={1}
          clearcoatRoughness={0.3}
        />
      );
    case "GLASS":
      return (
        <meshPhysicalMaterial
          map={fudgeAlbedo}
          sheen={1}
          sheenColor={new THREE.Color("#4abff4")}
          normalMap={fudgeNormal}
          roughness={0.3}
          metalness={0}
          transmission={1}
          transmissionMap={ormMap}
          thickness={2}
          envMapIntensity={1}
          attenuationColor={new THREE.Color(43 / 255, 1, 115 / 255)}
          attenuationDistance={0.1}
        />
      );
    case "IRON":
      return (
        <meshStandardMaterial
          map={fudgeAlbedo}
          aoMap={ormMap}
          roughnessMap={ormMap}
          metalnessMap={ormMap}
          normalMap={fudgeNormal}
          metalness={1}
        />
      );
    default:
      // GEMSTONE, NEBULA, SUNRISE, SUNSET, WALNUT
      return (
        <meshStandardMaterial
          map={fudgeAlbedo}
          aoMap={ormMap}
          roughnessMap={ormMap}
          metalnessMap={ormMap}
          normalMap={fudgeNormal}
        />
      );
  }
}
