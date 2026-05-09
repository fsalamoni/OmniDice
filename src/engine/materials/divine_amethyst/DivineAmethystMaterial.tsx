import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineAmethystMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#9966cc"
      roughness={0.35}
      metalness={0.2}
      clearcoat={0.8}
      clearcoatRoughness={0.2}
      {...props}
    />
  );
}
