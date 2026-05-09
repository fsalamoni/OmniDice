import { useMemo } from "react";
import { useCustomSkinStore, CustomSkinType } from "../../../store/customSkinStore";
import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

/**
 * Get PBR properties based on the custom skin type
 */
function getTypeProperties(type: CustomSkinType) {
  switch (type) {
    case "solid":
      return {
        roughness: 0.35,
        metalness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
      };
    case "metallic":
      return {
        roughness: 0.1,
        metalness: 0.95,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.8,
      };
    case "neon":
      return {
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        emissiveIntensity: 0.5,
      };
    case "glossy":
      return {
        roughness: 0.05,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      };
    case "matte":
      return {
        roughness: 0.8,
        metalness: 0.0,
        clearcoat: 0,
        clearcoatRoughness: 0,
      };
  }
}

/**
 * Custom material that reads its configuration from the customSkinStore.
 * Always uses the numbers template so dice numbers are visible.
 * The `color` property tints the template to the user's chosen color.
 */
export function CustomMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  const config = useCustomSkinStore((s) => s.config);
  const typeProps = useMemo(() => getTypeProperties(config.type), [config.type]);
  const emissiveColor = config.type === "neon" ? config.baseColor : undefined;

  return (
    <DivineLayeredMaterial
      backgroundTexture={config.backgroundImage}
      backgroundColor={config.baseColor}
      numberColor={config.numberColor}
      roughness={typeProps.roughness}
      metalness={typeProps.metalness}
      clearcoat={typeProps.clearcoat}
      clearcoatRoughness={typeProps.clearcoatRoughness}
      envMapIntensity={typeProps.envMapIntensity ?? 1}
      emissive={emissiveColor}
      emissiveIntensity={typeProps.emissiveIntensity ?? 0}
      {...props}
    />
  );
}
