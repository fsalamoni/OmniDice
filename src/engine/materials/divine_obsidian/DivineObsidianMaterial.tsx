import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineObsidianMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#1a1a2e"
      roughness={0.08}
      metalness={0.4}
      clearcoat={1.0}
      clearcoatRoughness={0.05}
      {...props}
    />
  );
}
