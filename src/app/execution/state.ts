"use client";

import { CodeError, isCodeError } from "./error";
import { lexScript } from "./lexer";

export interface CodeSettings {
  maxInstructionCount: number;
  cellCount: number;
}

interface BaseCodeState {
  commands: string[][];
  currentValue: number;
  instructionCount: number;
  lineIdx: number;
  cells: Int32Array;
  lineIdxOfLabels: { [k: string]: number };
  output: number[];
  error: null | CodeError;
};

export type CodeState = CodeSettings & BaseCodeState;

export function initCodeState(code: string, settings: CodeSettings) {
  const lexing = lexScript(code);
  const state: CodeState = {
    ...settings,
    lineIdx: 0,
    instructionCount: 0,
    currentValue: 0,
    cells: new Int32Array(settings.cellCount),
    commands: isCodeError(lexing) ? [] : lexing,
    lineIdxOfLabels: {},
    output: [],
    error: isCodeError(lexing) ? lexing : null,
  };

  for (const [idx, args] of state.commands.entries()) {
    if (args[0] === "label") {
      state.lineIdxOfLabels[args[1]] = idx;
    }
  }

  return state;
}

export function shouldCodeContinue(state: CodeState) {
  return state.lineIdx < state.commands.length && state.error == null;
}
