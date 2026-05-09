import { useTexture } from "@react-three/drei";

import albedo from "./albedo.png";
import normal from "./normal.png";
import { gltfTexture } from "../../helpers/gltfTexture";

export function DivineVoidMaterial(
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
      roughness={0.3}
      metalness={0.25}
      clearcoat={0.8}
      clearcoatRoughness={0.15}
      {...props}
    />
  );
}
