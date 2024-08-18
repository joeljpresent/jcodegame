"use client";

import { lexScript } from "./lexer";

function isInt32(n: number) {
  return (n | 0) === n;
}

function parseInt32(s: string) {
  if (!/^-?(\d+|0x[0-9a-f]+)$/i.test(s)) {
    throw Error(`could not parse int32: ${s}`);
  }
  const n = Number.parseInt(s);
  if (!isInt32(n)) {
    throw Error(`invalid int32: ${n}`);
  }
  return n | 0;
}

function runCommand(args: string[], state: CodeState): void {
  const checkCellIdx = (cellIdx: number): number => {
    if (!isInt32(cellIdx) || cellIdx < 0 || cellIdx >= state.cellCount) {
      throw Error(`invalid cell ID: ${cellIdx}`);
    }
    return cellIdx;
  }
  const getCell = (cellIdx: number): number => {
    return state.cells[checkCellIdx(cellIdx)];
  }
  const parseValue = (val: string): number => {
    if (val.charAt(0) === "@") {
      return getCell(parseInt32(val.slice(1)));
    } else if (val.charAt(0) === "&") {
      return getCell(getCell(parseInt32(val.slice(1))));
    } else if (/^'[^\x00-\x1f'\\]'$/u.test(val)) {
      return val.codePointAt(1)!;
    } else if (/^'\\[\\'bfnrt]'$/u.test(val)) {
      const ESCAPE: { [k: string]: number } = {
        "\\": "\\".charCodeAt(0),
        "'": "'".charCodeAt(0),
        b: "\b".charCodeAt(0),
        f: "\f".charCodeAt(0),
        n: "\n".charCodeAt(0),
        r: "\r".charCodeAt(0),
        t: "\t".charCodeAt(0),
      };
      return ESCAPE[val.charAt(2)!];
    }
    return parseInt32(val);
  };
  const parseCellId = (val: string): number => {
    if (val.charAt(0) === "@") {
      return checkCellIdx(parseInt32(val.slice(1)));
    } else if (val.charAt(0) === "&") {
      return checkCellIdx(getCell(parseInt32(val.slice(1))));
    }
    throw Error("cell ID must start with @ or &");
  };

  switch (args[0]) {
    case ("jump"): {
      const nextLineIdx = state.lineIdxOfLabels[args[1]];
      if (nextLineIdx == null) {
        throw Error(`could not find label ${args[1]}`);
      }
      state.lineIdx = nextLineIdx;
      return;
    }
    case ("jumpif"): {
      const nextLineIdx = state.lineIdxOfLabels[args[3]];
      if (nextLineIdx == null) {
        throw Error(`could not find label ${args[3]}`);
      }
      const CMPS: { [k: string]: (a: number, b: number) => boolean } = {
        eq: (a, b) => a === b,
        ne: (a, b) => a !== b,
        lt: (a, b) => a < b,
        le: (a, b) => a <= b,
        gt: (a, b) => a > b,
        ge: (a, b) => a >= b,
      }
      if (!Object.hasOwn(CMPS, args[1])) {
        throw Error(`invalid comparision operator: ${args[1]}`);
      }
      const cmp = CMPS[args[1]];
      const value = parseValue(args[2]);
      if (cmp(state.currentValue, value)) {
        state.lineIdx = nextLineIdx;
      } else {
        state.lineIdx += 1;
      }
      return;
    }
    case "print": {
      state.output.push(state.currentValue);
      state.lineIdx += 1;
      return;
    }
    case "load": {
      state.currentValue = parseValue(args[1]);
      state.lineIdx += 1;
      return;
    }
    case "store": {
      const cellId = parseCellId(args[1]);
      state.cells[cellId] = state.currentValue;
      state.lineIdx += 1;
      return;
    }
    case "add": {
      state.currentValue += parseValue(args[1]);
      state.lineIdx += 1;
      return;
    }
    case "sub": {
      state.currentValue -= parseValue(args[1]);
      state.lineIdx += 1;
      return;
    }
    case "label":
    case undefined: {
      state.lineIdx += 1;
      return;
    }
    default: {
      throw Error(`unknown command: ${args[0]}`);
    }
  }
}

export function runScript(code: string, settings: CodeSettings) {
  const state = initCodeState(code, settings);
  while (shouldCodeContinue(state)) {
    runNextStep(state);
  }
  return state;
}

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

export function runNextStep(state: CodeState) {
  try {
    if (state.instructionCount > state.maxInstructionCount) {
      throw Error(`the program must not execute in more than ${state.maxInstructionCount} instructions`);
    }
    const args = state.commands[state.lineIdx];
    runCommand(args, state);
    if (!isInt32(state.currentValue)) {
      throw Error(`resulting value is not an int32: ${state.currentValue}`);
    }
  } catch (err: unknown) {
    state.error = { lineNumber: state.lineIdx + 1, msg: String(err) };
  }
  state.instructionCount += 1;
}

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

export interface CodeError {
  lineNumber: number;
  msg: string;
}

export function isCodeError(v: unknown): v is CodeError {
  return v != null && typeof v === "object"
    && Object.hasOwn(v, "lineNumber")
    && Object.hasOwn(v, "msg");
}

export function shouldCodeContinue(state: CodeState) {
  return state.lineIdx < state.commands.length && state.error == null;
}
