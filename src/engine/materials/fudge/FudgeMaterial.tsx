import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";
import { DiceStyle } from "../../types/DiceStyle";

/**
 * Fudge dice material — structurally identical to GalaxyMaterial.
 * Uses its OWN texture files (albedo.jpg, orm.jpg, normal.jpg)
 * where the D6 face regions have fudge symbols (+, −, blank)
 * instead of numbers.
 */
export function FudgeMaterial(
  { diceStyle, ...props }: { diceStyle: DiceStyle } & JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  const [albedoMap, ormMap, normalMap] = useTexture(
    [albedo, orm, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      aoMap={ormMap}
      metalnessMap={ormMap}
      roughnessMap={ormMap}
      normalMap={normalMap}
      clearcoat={1}
      clearcoatRoughness={0.3}
      {...props}
    />
  );
}
