import { Physics } from "@react-three/rapier";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { TrayColliders } from "../colliders/TrayColliders";
import { Dice as DiceType } from "../types/Dice";
import { DiceThrow } from "../types/DiceThrow";
import { DiceTransform } from "../types/DiceTransform";
import { Die } from "../types/Die";
import { Dice as DefaultDice } from "./Dice";
import { PhysicsDice } from "./PhysicsDice";

export function DiceRoll({
  roll,
  rollThrows,
  onRollFinished,
  finishedTransforms,
  DiceComponent,
}: {
  roll: DiceType;
  rollThrows: Record<string, DiceThrow>;
  onRollFinished?: (
    id: string,
    number: number,
    transform: DiceTransform
  ) => void;
  finishedTransforms?: Record<string, DiceTransform>;
  /** Override to provide a custom Dice component */
  DiceComponent?: React.FC<JSX.IntrinsicElements["group"] & { die: Die }>;
}) {
  const Dice = DiceComponent || DefaultDice;

  const dice = useMemo(() => roll && getDieFromDice(roll), [roll]);

  const emptyCallback = useCallback(() => {}, []);

  /**
   * Because we recreate the physics world every new roll
   * there is a frame where all the rigid bodies need to be created
   * to ensure smooth playback we pause the physics sim until
   * the frame after everything is created
   */
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    if (finishedTransforms) {
      setPaused(true);
    } else {
      requestAnimationFrame(() => {
        setPaused(false);
      });
    }
  }, [finishedTransforms]);

  if (finishedTransforms) {
    // Move to a static dice representation when all dice values have been found
    return (
      <group>
        {dice?.map((die) => {
          const dieTransform = finishedTransforms[die.id]!;
          if (!dieTransform) return null;
          const p = dieTransform.position;
          const r = dieTransform.rotation;
          return (
            <Dice
              userData={{ dieId: die.id }}
              key={die.id}
              die={die}
              position={[p.x, p.y, p.z]}
              quaternion={[r.x, r.y, r.z, r.w]}
            />
          );
        })}
      </group>
    );
  } else {
    return (
      <Physics
        colliders={false}
        interpolate={false}
        timeStep={1 / 120}
        updateLoop="independent"
        paused={paused}
      >
        <TrayColliders />
        {dice?.map((die) => {
          const dieThrow = rollThrows[die.id];
          if (!dieThrow) return null;
          return (
            <PhysicsDice
              key={die.id}
              die={die}
              dieThrow={dieThrow}
              onRollFinished={onRollFinished}
            >
              <Dice
                die={die}
                onClick={emptyCallback}
                onPointerDown={emptyCallback}
              />
            </PhysicsDice>
          );
        })}
      </Physics>
    );
  }
}
