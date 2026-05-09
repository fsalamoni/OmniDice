import { DiceStyle } from "../types/DiceStyle";
import { DiceType } from "../types/DiceType";
import { FudgeMaterial } from "./fudge/FudgeMaterial";
// Divine skins
import { DivineAmethystMaterial } from "./divine_amethyst/DivineAmethystMaterial";
import { DivineBloodMaterial } from "./divine_blood/DivineBloodMaterial";
import { DivineEmeraldMaterial } from "./divine_emerald/DivineEmeraldMaterial";
import { DivineGoldMaterial } from "./divine_gold/DivineGoldMaterial";
import { DivineIceMaterial } from "./divine_ice/DivineIceMaterial";
import { DivineNebulaMaterial } from "./divine_nebula/DivineNebulaMaterial";
import { DivineObsidianMaterial } from "./divine_obsidian/DivineObsidianMaterial";
import { DivinePearlMaterial } from "./divine_pearl/DivinePearlMaterial";
import { DivineSapphireMaterial } from "./divine_sapphire/DivineSapphireMaterial";
import { DivineVoidMaterial } from "./divine_void/DivineVoidMaterial";
// Color-based skins
import { ColorMaterial, COLOR_SKINS } from "./color/ColorMaterial";
// Custom skin
import { CustomMaterial } from "./custom/CustomMaterial";

export function DiceMaterial({
  diceStyle,
  diceType,
}: {
  diceStyle: DiceStyle;
  diceType?: DiceType;
}) {
  // Fudge dice use the selected style's material but with +/−/blank symbols
  if (diceType === "DFUDGE") {
    return <FudgeMaterial diceStyle={diceStyle} />;
  }

  switch (diceStyle) {
    // --- Divine skins ---
    case "DIVINE_AMETHYST":
      return <DivineAmethystMaterial />;
    case "DIVINE_BLOOD":
      return <DivineBloodMaterial />;
    case "DIVINE_EMERALD":
      return <DivineEmeraldMaterial />;
    case "DIVINE_GOLD":
      return <DivineGoldMaterial />;
    case "DIVINE_ICE":
      return <DivineIceMaterial />;
    case "DIVINE_NEBULA":
      return <DivineNebulaMaterial />;
    case "DIVINE_OBSIDIAN":
      return <DivineObsidianMaterial />;
    case "DIVINE_PEARL":
      return <DivinePearlMaterial />;
    case "DIVINE_SAPPHIRE":
      return <DivineSapphireMaterial />;
    case "DIVINE_VOID":
      return <DivineVoidMaterial />;

    // --- Color-based skins ---
    case "CRIMSON":
      return <ColorMaterial config={COLOR_SKINS.CRIMSON} />;
    case "ROYAL_BLUE":
      return <ColorMaterial config={COLOR_SKINS.ROYAL_BLUE} />;
    case "FOREST":
      return <ColorMaterial config={COLOR_SKINS.FOREST} />;
    case "STEEL":
      return <ColorMaterial config={COLOR_SKINS.STEEL} />;
    case "COPPER":
      return <ColorMaterial config={COLOR_SKINS.COPPER} />;
    case "ROSE_GOLD":
      return <ColorMaterial config={COLOR_SKINS.ROSE_GOLD} />;
    case "NEON_PINK":
      return <ColorMaterial config={COLOR_SKINS.NEON_PINK} />;
    case "NEON_GREEN":
      return <ColorMaterial config={COLOR_SKINS.NEON_GREEN} />;
    case "IVORY":
      return <ColorMaterial config={COLOR_SKINS.IVORY} />;
    case "MIDNIGHT":
      return <ColorMaterial config={COLOR_SKINS.MIDNIGHT} />;

    // --- Custom skin ---
    case "CUSTOM":
      return <CustomMaterial />;

    default:
      throw Error(`Dice style ${diceStyle} error: not implemented`);
  }
}
