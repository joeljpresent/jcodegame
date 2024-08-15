"use client";

export function parseCode(code: string, state: CodeState) {
  const commands = code.split("\n").map(line => line.trim().split(/\s+/g));
  for (const [idx, args] of commands.entries()) {
    const err = (msg: string): Error => {
      return { lineNumber: idx + 1, msg };
    }
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
            state.error = err(`invalid Unicode code point: 0x${state.currentValue.toString(16)}`);
            return state;
          }
        } else {
          state.output.value.push(state.currentValue);
        }
        break;
      }
      case "load": {
        state.currentValue = parseValue(args[1]);
        break;
      }
      case "store": {
        state.cells[parseCellId(args[1])] = state.currentValue;
        break;
      }
      case "add": {
        state.currentValue += parseValue(args[1]);
        break;
      }
      case "sub": {
        state.currentValue -= parseValue(args[1]);
        break;
      }
      case "mul": {
        state.currentValue *= parseValue(args[1]);
        break;
      }
      case "div": {
        state.currentValue = Math.floor(state.currentValue / parseValue(args[1]));
        break;
      }
      // TODO: label LABEL
      // TODO: jump LABEL
      // TODO; jumpif lt/le/eq/ne/ge/gt VALUE LABEL
    }
  }
  return state;
}

export interface CodeState {
  currentValue: number;
  cells: number[];
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
