"use client";

function isInt32(n: number) {
  return (n | 0) === n;
}

function runCommand(args: string[], state: CodeState): CodeState {
  const checkCellIdx = (cellIdx: number): number => {
    if (!isInt32(cellIdx) || cellIdx < 0 || cellIdx >= state.cellCount) {
      throw Error(`invalid cell ID: ${cellIdx}`);
    }
    return cellIdx;
  }
  const parseValue = (val: string): number => {
    if (val.charAt(0) === "@") {
      return state.cells[checkCellIdx(parseInt(val.slice(1)))];
    } else if (val.charAt(0) === "&") {
      return checkCellIdx(state.cells[(state.cells[parseInt(val.slice(1))])]);
    }
    return parseInt(val);
  };
  const parseCellId = (val: string): number => {
    if (val.charAt(0) === "@") {
      return checkCellIdx(parseInt(val.slice(1)));
    } else if (val.charAt(0) === "&") {
      return state.cells[checkCellIdx(parseInt(val.slice(1)))];
    }
    throw Error("cell ID must start with @ or &");
  };

  if (args[0] === "jump") {
    const nextLineIdx = state.lineIdxOfLabels[args[1]];
    if (nextLineIdx == null) {
      throw Error(`could not find label ${args[1]}`);
    }
    state.lineIdx = nextLineIdx;
    return state;
  } else if (args[0] === "jumpif") {
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
    return state;
  }

  state.lineIdx += 1;

  switch (args[0]) {
    case "print": {
      state.output.push(state.currentValue);
      return state;
    }
    case "load": {
      state.currentValue = parseValue(args[1]);
      return state;
    }
    case "store": {
      const cellId = parseCellId(args[1]);
      state.cells[cellId] = state.currentValue;
      return state;
    }
    case "add": {
      state.currentValue += parseValue(args[1]);
      return state;
    }
    case "sub": {
      state.currentValue -= parseValue(args[1]);
      return state;
    }
    case "label":
    case "": {
      return state;
    }
    default: {
      throw Error(`unknown command: ${args[0]}`);
    }
  }
}

export function runScript(code: string, settings: CodeSettings) {
  const state = initCodeState(code, settings);
  while (state.lineIdx < state.commands.length && state.error == null) {
    runNextStep(state);
  }
  return state;
}

export function initCodeState(code: string, settings: CodeSettings) {
  const commands = code.split("\n").map(line => line.trim().split(/\s+/g));
  const state: CodeState = {
    ...settings,
    lineIdx: 0,
    instructionCount: 0,
    currentValue: 0,
    cells: new Int32Array(settings.cellCount),
    commands,
    lineIdxOfLabels: {},
    output: [],
    error: null,
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
