import { create } from 'zustand';
import type { DiceSelection, RollResult, DiceType, DiceStyleType } from '../types/dice.types';
import type { Die } from '../engine/types/Die';
import type { Dice } from '../engine/types/Dice';
import type { DiceThrow } from '../engine/types/DiceThrow';
import type { DiceTransform } from '../engine/types/DiceTransform';
import type { DiceStyle } from '../engine/types/DiceStyle';
import { DiceThrower } from '../engine/helpers/DiceThrower';

interface DiceStore {
  // Selection state
  selectedDice: DiceSelection;
  modifier: number;
  rollHistory: RollResult[];
  isRolling: boolean;

  // Engine state — current roll
  currentRoll: Dice | null;
  currentThrows: Record<string, DiceThrow>;
  currentResults: Record<string, number>;
  currentTransforms: Record<string, DiceTransform>;
  finishedTransforms: Record<string, DiceTransform> | null;
  rollKey: number; // incremented to force Physics world recreation

  // Dice style
  currentStyle: DiceStyle;
  setStyle: (style: DiceStyle) => void;

  // Actions
  setDiceCount: (type: DiceType, count: number) => void;
  incrementDice: (type: DiceType) => void;
  decrementDice: (type: DiceType) => void;
  setModifier: (mod: number) => void;
  incrementModifier: (delta: number) => void;
  addToHistory: (result: RollResult) => void;
  clearHistory: () => void;
  setRolling: (rolling: boolean) => void;
  getNotation: () => string;

  // Physics roll actions
  startRoll: () => void;
  onDieFinished: (id: string, value: number, transform: DiceTransform) => void;
}

function diceTypeToEngine(type: DiceType): "D4" | "D6" | "D8" | "D10" | "D12" | "D20" | "D100" {
  return type.toUpperCase() as "D4" | "D6" | "D8" | "D10" | "D12" | "D20" | "D100";
}

export const useDiceStore = create<DiceStore>((set, get) => ({
  selectedDice: { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 2, d100: 0 },
  modifier: 0,
  rollHistory: [],
  isRolling: false,

  // Engine state
  currentRoll: null,
  currentThrows: {},
  currentResults: {},
  currentTransforms: {},
  finishedTransforms: null,
  rollKey: 0,

  currentStyle: 'GALAXY',
  setStyle: (style) => set({ currentStyle: style }),

  setDiceCount: (type, count) => set((state) => ({
    selectedDice: { ...state.selectedDice, [type]: Math.max(0, Math.min(10, count)) },
  })),
  incrementDice: (type) => get().setDiceCount(type, get().selectedDice[type] + 1),
  decrementDice: (type) => get().setDiceCount(type, get().selectedDice[type] - 1),
  setModifier: (mod) => set({ modifier: Math.max(-99, Math.min(99, mod)) }),
  incrementModifier: (delta) => {
    const newMod = Math.max(-99, Math.min(99, get().modifier + delta));
    set({ modifier: newMod });
  },
  addToHistory: (result) => set((state) => ({
    rollHistory: [result, ...state.rollHistory].slice(0, 20),
  })),
  clearHistory: () => set({ rollHistory: [] }),
  setRolling: (rolling) => set({ isRolling: rolling }),
  getNotation: () => {
    const { selectedDice, modifier } = get();
    const parts: string[] = [];
    (Object.keys(selectedDice) as DiceType[]).forEach((type) => {
      if (selectedDice[type] > 0) parts.push(selectedDice[type] + type);
    });
    if (parts.length === 0) return '0';
    let n = parts.join('+');
    if (modifier !== 0) n += modifier > 0 ? '+' + modifier : '' + modifier;
    return n;
  },

  startRoll: () => {
    const { selectedDice, currentStyle, isRolling } = get();
    if (isRolling) return;

    // Build Die objects from the selection
    const dice: Die[] = [];
    const diceTypes = Object.keys(selectedDice) as DiceType[];
    let dieIndex = 0;
    for (const type of diceTypes) {
      const count = selectedDice[type];
      for (let i = 0; i < count; i++) {
        dice.push({
          id: `${type}_${dieIndex++}`,
          style: currentStyle,
          type: diceTypeToEngine(type),
        });
      }
    }

    if (dice.length === 0) return;

    // Generate throws using DiceThrower (collision avoidance)
    const thrower = new DiceThrower();
    const throws: Record<string, DiceThrow> = {};
    dice.forEach((die, index) => {
      throws[die.id] = thrower.getDiceThrow(index);
    });

    // Build roll structure
    const roll: Dice = { dice, bonus: get().modifier };

    set({
      isRolling: true,
      currentRoll: roll,
      currentThrows: throws,
      currentResults: {},
      currentTransforms: {},
      finishedTransforms: null,
      rollKey: get().rollKey + 1,
    });
  },

  onDieFinished: (id, value, transform) => {
    const state = get();
    const newResults = { ...state.currentResults, [id]: value };
    const newTransforms = { ...state.currentTransforms, [id]: transform };

    set({
      currentResults: newResults,
      currentTransforms: newTransforms,
    });

    // Check if all dice have finished
    const roll = state.currentRoll;
    if (!roll) return;

    const allDice: Die[] = [];
    for (const d of roll.dice) {
      if ('type' in d && 'style' in d) {
        allDice.push(d as Die);
      }
    }

    if (Object.keys(newResults).length >= allDice.length) {
      // All dice finished! Calculate results
      const modifier = state.modifier;
      const diceResults = allDice.map((die) => ({
        id: die.id,
        type: die.type.toLowerCase() as DiceType,
        value: newResults[die.id] || 0,
      }));

      const diceTotal = diceResults.reduce((sum, r) => sum + r.value, 0);
      const total = diceTotal + modifier;

      const isCriticalSuccess = diceResults.some((r) => r.type === 'd20' && r.value === 20);
      const isCriticalFailure = diceResults.some((r) => r.type === 'd20' && r.value === 1);

      const rollResult: RollResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        notation: state.getNotation(),
        results: diceResults,
        total,
        modifier,
        isCriticalSuccess,
        isCriticalFailure,
      };

      // Transition to static display
      set({
        isRolling: false,
        finishedTransforms: newTransforms,
      });

      // Add to history
      get().addToHistory(rollResult);
    }
  },
}));
