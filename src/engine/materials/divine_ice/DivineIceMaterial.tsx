import { useTexture } from "@react-three/drei";

import albedo from "./albedo.png";
import normal from "./normal.png";
import { gltfTexture } from "../../helpers/gltfTexture";

export function DivineIceMaterial(
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
      roughness={0.15}
      metalness={0.1}
      clearcoat={1.0}
      clearcoatRoughness={0.05}
      transmission={0.15}
      thickness={1.5}
      {...props}
    />
  );
}
