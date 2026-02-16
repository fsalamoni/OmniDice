import { Die, isDie } from "./Die";

export interface Dice {
  dice: (Die | Dice)[];
  combination?: "HIGHEST" | "LOWEST" | "SUM" | "NONE";
  bonus?: number;
}

export function isDice(value: unknown): value is Dice {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as Dice).dice)
  );
}
