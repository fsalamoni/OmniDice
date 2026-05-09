import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineNebulaMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#6a0dad"
      roughness={0.35}
      metalness={0.15}
      clearcoat={0.7}
      clearcoatRoughness={0.2}
      {...props}
    />
  );
}
