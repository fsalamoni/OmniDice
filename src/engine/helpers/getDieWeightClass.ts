import { Die } from "../types/Die";
import { WeightClass } from "../types/WeightClass";

const HEAVY_STYLES = new Set(["STEEL", "COPPER", "DIVINE_OBSIDIAN", "DIVINE_GOLD"]);

export function getDieWeightClass(die: Die): WeightClass {
  if (HEAVY_STYLES.has(die.style)) {
    if (die.type === "D4") {
      return "MEDIUM";
    } else {
      return "HEAVY";
    }
  } else {
    if (die.type === "D4") {
      return "LIGHT";
    } else {
      return "MEDIUM";
    }
  }
}
