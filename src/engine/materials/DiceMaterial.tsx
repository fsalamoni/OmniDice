import { DiceStyle } from "../types/DiceStyle";
import { DiceType } from "../types/DiceType";
import { FudgeMaterial } from "./fudge/FudgeMaterial";
import { GalaxyMaterial } from "./galaxy/GalaxyMaterial";
import { GemstoneMaterial } from "./gemstone/GemstoneMaterial";
import { GlassMaterial } from "./glass/GlassMaterial";
import { IronMaterial } from "./iron/IronMaterial";
import { NebulaMaterial } from "./nebula/NebulaMaterial";
import { SunriseMaterial } from "./sunrise/SunriseMaterial";
import { SunsetMaterial } from "./sunset/SunsetMaterial";
import { WalnutMaterial } from "./walnut/WalnutMaterial";

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
    case "GALAXY":
      return <GalaxyMaterial />;
    case "GEMSTONE":
      return <GemstoneMaterial />;
    case "GLASS":
      return <GlassMaterial />;
    case "IRON":
      return <IronMaterial />;
    case "NEBULA":
      return <NebulaMaterial />;
    case "SUNRISE":
      return <SunriseMaterial />;
    case "SUNSET":
      return <SunsetMaterial />;
    case "WALNUT":
      return <WalnutMaterial />;
    default:
      throw Error(`Dice style ${diceStyle} error: not implemented`);
  }
}
