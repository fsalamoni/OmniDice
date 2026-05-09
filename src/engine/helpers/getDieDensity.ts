import { Die } from "../types/Die";

const HEAVY_STYLES = new Set(["STEEL", "COPPER", "DIVINE_OBSIDIAN", "DIVINE_GOLD"]);
const MEDIUM_STYLES = new Set(["DIVINE_ICE", "DIVINE_PEARL", "IVORY", "ROSE_GOLD"]);

/** Get the density multiplier for a die */
export function getDieDensity(die: Die): number {
  if (HEAVY_STYLES.has(die.style)) {
    return 2;
  } else if (MEDIUM_STYLES.has(die.style)) {
    return 1.5;
  } else {
    return 1;
  }
}
