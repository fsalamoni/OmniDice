import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedo from "./albedo.png";
import normal from "./normal.png";
import { gltfTexture } from "../../helpers/gltfTexture";

const sheenColor = new THREE.Color("#f0e6d3");

export function DivinePearlMaterial(
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
      roughness={0.2}
      metalness={0.15}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
      sheen={0.8}
      sheenColor={sheenColor}
      {...props}
    />
  );
}
