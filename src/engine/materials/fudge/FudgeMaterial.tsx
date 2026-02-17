import { useTexture } from "@react-three/drei";

import albedo from "./fudge-albedo.png";
import normal from "./fudge-normal.png";
import { gltfTexture } from "../../helpers/gltfTexture";

/**
 * Material for Fudge dice.
 * Uses a custom albedo texture with +, -, and blank symbols
 * positioned at the exact UV regions of the D6 GLB mesh faces.
 * Uses gltfTexture because the geometry comes from a GLTF/GLB file.
 */
export function FudgeMaterial(
  props: JSX.IntrinsicElements["meshStandardMaterial"]
) {
  const [albedoMap, normalMap] = useTexture(
    [albedo, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR"])
  );

  return (
    <meshStandardMaterial
      map={albedoMap}
      normalMap={normalMap}
      roughness={0.6}
      metalness={0.05}
      {...props}
    />
  );
}
