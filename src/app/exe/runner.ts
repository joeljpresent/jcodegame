"use client";

import { isInt32, parseInt32 } from "../utils/int32";
import { parseCharLiteral } from "../utils/unicode";
import { ExeSettings, ExeState, initExeState, setLineIdx, shouldExeContinue } from "./state";

function runCommand(args: string[], state: ExeState): void {
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
    } else if (val.charAt(0) === "*") {
      return getCell(getCell(parseInt32(val.slice(1))));
    } else if (val.charAt(0) === "'") {
      return parseCharLiteral(val);
    }
    return parseInt32(val);
  };
  const parseCellId = (val: string): number => {
    if (val.charAt(0) === "@") {
      return checkCellIdx(parseInt32(val.slice(1)));
    } else if (val.charAt(0) === "*") {
      return checkCellIdx(getCell(parseInt32(val.slice(1))));
    }
    throw Error("cell ID must start with @ or *");
  };
  const assertArgCount = (count: number) => {
    if (args.length - 1 !== count) {
      throw Error(`expected ${count} args for command ${args[0]}, got ${args.length - 1}`);
    }
  }

  switch (args[0]) {
    case ("jump"): {
      assertArgCount(1);
      const nextLineIdx = state.lineIdxOfLabels[args[1]];
      if (nextLineIdx == null) {
        throw Error(`could not find label ${args[1]}`);
      }
      setLineIdx(state, nextLineIdx);
      return;
    }
    case ("jumpif"): {
      assertArgCount(3);
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
        throw Error(`invalid comparison operator: ${args[1]}`);
      }
      const cmp = CMPS[args[1]];
      const value = parseValue(args[2]);
      if (cmp(state.currentValue, value)) {
        setLineIdx(state, nextLineIdx);
      } else {
        setLineIdx(state, state.lineIdx + 1);
      }
      return;
    }
    case "read": {
      assertArgCount(0);
      if (state.nextInputIdx < state.input.length) {
        state.currentValue = state.input[state.nextInputIdx];
        setLineIdx(state, state.lineIdx + 1);
      } else {
        state.previousLineIdx = state.lineIdx;
      }
      state.nextInputIdx += 1;
      return;
    }
    case "write": {
      assertArgCount(0);
      state.output.push(state.currentValue);
      setLineIdx(state, state.lineIdx + 1);
      return;
    }
    case "load": {
      assertArgCount(1);
      state.currentValue = parseValue(args[1]);
      setLineIdx(state, state.lineIdx + 1);
      return;
    }
    case "store": {
      assertArgCount(1);
      const cellId = parseCellId(args[1]);
      state.cells[cellId] = state.currentValue;
      setLineIdx(state, state.lineIdx + 1);
      return;
    }
    case "add": {
      assertArgCount(1);
      state.currentValue += parseValue(args[1]);
      setLineIdx(state, state.lineIdx + 1);
      return;
    }
    case "sub": {
      assertArgCount(1);
      state.currentValue -= parseValue(args[1]);
      setLineIdx(state, state.lineIdx + 1);
      return;
    }
    case "label":
    case undefined: {
      setLineIdx(state, state.lineIdx + 1);
      return;
    }
    default: {
      throw Error(`unknown command: ${args[0]}`);
    }
  }
}

export function runScript(script: string, settings: ExeSettings) {
  const state = initExeState(script, settings);
  while (shouldExeContinue(state)) {
    runNextStep(state);
  }
  return state;
}

export function runNextStep(state: ExeState) {
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
