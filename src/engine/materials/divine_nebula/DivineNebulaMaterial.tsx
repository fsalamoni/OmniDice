import { useTexture } from "@react-three/drei";

import albedo from "./albedo.png";
import normal from "./normal.png";
import { gltfTexture } from "../../helpers/gltfTexture";

export function DivineNebulaMaterial(
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
      roughness={0.35}
      metalness={0.15}
      clearcoat={0.7}
      clearcoatRoughness={0.2}
      {...props}
    />
  );
}
