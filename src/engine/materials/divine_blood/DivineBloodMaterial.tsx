import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineBloodMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#cc2233"
      roughness={0.3}
      metalness={0.15}
      clearcoat={0.9}
      clearcoatRoughness={0.15}
      {...props}
    />
  );
}
