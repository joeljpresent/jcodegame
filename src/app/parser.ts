"use client";

function runCommand(args: string[], state: CodeState) {
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
      if (!Number.isSafeInteger(cellId) || cellId < 0 || cellId >= state.cells.length) {
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
    case "mul": {
      state.currentValue *= parseValue(args[1]);
      return state;
    }
    case "div": {
      state.currentValue = Math.floor(state.currentValue / parseValue(args[1]));
      return state;
    }
    case "label": {
      // the labels should have already been indexed, so this can be ignored now
      return state;
    }
    // TODO: jump LABEL
    // TODO; jumpif lt/le/eq/ne/ge/gt VALUE LABEL
  }
}

export function parseCode(code: string, state: CodeState) {
  const commands = code.split("\n").map(line => line.trim().split(/\s+/g));
  for (const [idx, args] of commands.entries()) {
    if (args[0] === "label") {
      state.lineIdxOfLabels[args[1]] = idx;
    }
  }
  for (const [idx, args] of commands.entries()) {
    try {
      runCommand(args, state);
      if (!Number.isSafeInteger(state.currentValue)) {
        throw Error(`resulting value is not a safe integer: ${state.currentValue}`);
      }
    } catch (err: unknown) {
      state.error = { lineNumber: idx + 1, msg: String(err) };
      return state;
    }
  }
  return state;
}

export interface CodeState {
  currentValue: number;
  cells: number[];
  lineIdxOfLabels: {[k: string]: number};
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
/*
- print
- load VALUE
- store VALUE
- add VALUE
- sub VALUE
- mul VALUE
- div VALUE
- label LABEL
- jump LABEL (lt/le/eq/ne/ge/gt VALUE)
*/
