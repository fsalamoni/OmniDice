import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivinePearlMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#f5f0e6"
      roughness={0.2}
      metalness={0.15}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
      sheen={0.8}
      sheenColor="#f0e6d3"
      {...props}
    />
  );
}
