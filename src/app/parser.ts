"use client";

function isInt32(n: number) {
  return (n | 0) === n;
}

function runCommand(args: string[], state: CodeState): CodeState {
  const parseValue = (val: string): number => {
    if (val.charAt(0) === "@") {
      return state.cells[parseInt(val.slice(1))];
    } else if (val.charAt(0) === "&") {
      return state.cells[state.cells[parseInt(val.slice(1))]];
    }
    return parseInt(val);
  };
  const parseCellId = (val: string): number => {
    if (val.charAt(0) === "@") {
      return parseInt(val.slice(1));
    } else if (val.charAt(0) === "&") {
      return state.cells[parseInt(val.slice(1))];
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
      if (state.output.kind === "unicode") {
        if (isUnicodeCodePoint(state.currentValue)) {
          state.output.value += String.fromCodePoint(state.currentValue);
        } else {
          throw Error(`invalid Unicode code point: 0x${state.currentValue.toString(16)}`);
        }
      } else {
        state.output.value.push(state.currentValue);
      }
      return state;
    }
    case "load": {
      state.currentValue = parseValue(args[1]);
      return state;
    }
    case "store": {
      const cellId = parseCellId(args[1]);
      if (!isInt32(cellId) || cellId < 0 || cellId >= state.cells.length) {
        throw Error(`invalid cell ID: ${cellId}`);
      }
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

export function parseCode(code: string, state: CodeState) {
  const commands = code.split("\n").map(line => line.trim().split(/\s+/g));
  for (const [idx, args] of commands.entries()) {
    if (args[0] === "label") {
      state.lineIdxOfLabels[args[1]] = idx;
    }
  }

  while (state.lineIdx < commands.length) {
    try {
      if (state.instructionCount > state.maxInstructionCount) {
        throw Error(`the program must not execute in more than ${state.maxInstructionCount} instructions`);
      }
      const args = commands[state.lineIdx];
      runCommand(args, state);
      if (!isInt32(state.currentValue)) {
        throw Error(`resulting value is not a 32-bit integer: ${state.currentValue}`);
      }
    } catch (err: unknown) {
      state.error = { lineNumber: state.lineIdx + 1, msg: String(err) };
      return state;
    }
    state.instructionCount += 1;
  }
  return state;
}

export interface CodeState {
  currentValue: number;
  instructionCount: number;
  maxInstructionCount: number;
  lineIdx: number;
  cellCount: number;
  cells: Int32Array;
  lineIdxOfLabels: { [k: string]: number };
  output: Output;
  error: null | Error;
};

export type Output =
  { kind: "numbers", value: number[] }
  | { kind: "unicode", value: string };

export interface Error {
  lineNumber: number;
  msg: string;
}

function isUnicodeCodePoint(n: number) {
  return n >= 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff);
}
