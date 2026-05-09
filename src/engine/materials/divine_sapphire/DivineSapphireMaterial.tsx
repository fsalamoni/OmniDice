import { useTexture } from "@react-three/drei";

import albedo from "./albedo.png";
import normal from "./normal.png";
import { gltfTexture } from "../../helpers/gltfTexture";

export function DivineSapphireMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  const [albedoMap, normalMap] = useTexture(
    [albedo, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR"])
  );

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      normalMap={normalMap}
      roughness={0.25}
      metalness={0.2}
      clearcoat={0.9}
      clearcoatRoughness={0.1}
      {...props}
    />
  );
}
