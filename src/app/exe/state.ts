"use client";

import { ExeError, isExeError } from "./error";
import { lexScript } from "./lexer";

export interface ExeSettings {
  maxInstructionCount: number;
  cellCount: number;
  input: number[];
}

interface BaseExeState {
  commands: string[][];
  currentValue: number;
  instructionCount: number;
  lineIdx: number;
  previousLineIdx: number | null;
  nextInputIdx: number;
  cells: number[];
  lineIdxOfLabels: { [k: string]: number };
  output: number[];
  error: null | ExeError;
};

export type ExeState = ExeSettings & BaseExeState;

export function initExeState(script: string, settings: ExeSettings) {
  const lexing = lexScript(script);
  const state: ExeState = {
    ...settings,
    lineIdx: 0,
    previousLineIdx: null,
    nextInputIdx: 0,
    instructionCount: 0,
    currentValue: 0,
    cells: new Array(settings.cellCount).fill(0),
    commands: isExeError(lexing) ? [] : lexing,
    lineIdxOfLabels: {},
    output: [],
    error: isExeError(lexing) ? lexing : null,
  };

  for (const [idx, args] of state.commands.entries()) {
    if (args[0] === "label") {
      state.lineIdxOfLabels[args[1]] = idx;
    }
  }

  return state;
}

export function shouldExeContinue(state: ExeState) {
  return (
    state.lineIdx < state.commands.length
    && state.nextInputIdx <= state.input.length
    && state.error == null
  );
}

export function setLineIdx(state: ExeState, newLineIdx: number) {
  state.previousLineIdx = state.lineIdx;
  state.lineIdx = newLineIdx;
}
