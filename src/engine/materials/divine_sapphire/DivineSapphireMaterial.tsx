import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineSapphireMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#1e3a8a"
      roughness={0.25}
      metalness={0.2}
      clearcoat={0.9}
      clearcoatRoughness={0.1}
      {...props}
    />
  );
}
