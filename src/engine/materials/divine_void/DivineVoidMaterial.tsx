import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineVoidMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#0d0d1a"
      roughness={0.3}
      metalness={0.25}
      clearcoat={0.8}
      clearcoatRoughness={0.15}
      {...props}
    />
  );
}
