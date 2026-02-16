import { DiceStyle } from "./DiceStyle";
import { DiceType } from "./DiceType";

export interface Die {
  id: string;
  style: DiceStyle;
  type: DiceType;
}

export function isDie(value: unknown): value is Die {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Die).id === "string" &&
    typeof (value as Die).style === "string" &&
    typeof (value as Die).type === "string"
  );
}
