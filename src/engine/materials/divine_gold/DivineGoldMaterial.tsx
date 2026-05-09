import diffuse from "./diffuse.png";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

export function DivineGoldMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  return (
    <DivineLayeredMaterial
      backgroundTexture={diffuse}
      numberColor="#651408"
      roughness={0.38}
      metalness={0.72}
      clearcoat={0.3}
      clearcoatRoughness={0.42}
      envMapIntensity={0.82}
      numberDepth={2.25}
      numberRoughnessBoost={0.26}
      numberMetalnessFade={0.18}
      numberOcclusionStrength={0.4}
      numberClearcoatStrength={0.88}
      {...props}
    />
  );
}
