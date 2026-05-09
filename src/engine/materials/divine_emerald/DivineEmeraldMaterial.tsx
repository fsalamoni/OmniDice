import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineEmeraldMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#2ecc71"
      roughness={0.3}
      metalness={0.2}
      clearcoat={0.9}
      clearcoatRoughness={0.15}
      {...props}
    />
  );
}
