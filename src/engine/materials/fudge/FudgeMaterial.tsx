import { useTexture } from "@react-three/drei";

import diffuse from "./diffuse-dark.png";
import normal from "./normal.png";
import specular from "./specular.png";

/**
 * Material for Fudge dice.
 * Uses custom texture atlas with +, -, and blank face symbols.
 * Textures sourced from the fudge3 theme (BabylonJS Protagonista Dice).
 *
 * Note: We do NOT use gltfTexture here because the geometry is not from
 * a GLTF/GLB file. BabylonJS uses top-left UV origin (same as Three.js default),
 * so flipY should remain true (default).
 */
export function FudgeMaterial(
  props: JSX.IntrinsicElements["meshStandardMaterial"]
) {
  const [diffuseMap, normalMap, specularMap] = useTexture([
    diffuse,
    normal,
    specular,
  ]);

  return (
    <meshStandardMaterial
      map={diffuseMap}
      normalMap={normalMap}
      roughnessMap={specularMap}
      roughness={0.7}
      metalness={0.1}
      {...props}
    />
  );
}
