import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineIceMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#aee8ff"
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
