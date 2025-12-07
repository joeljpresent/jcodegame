import { parseInt32 } from "../utils/int32";
import { parseCharLiteral, parseStringLiteral } from "../utils/unicode";

interface ExeInputSuccess {
  text: string;
  status: "success";
  value: number[];
}

interface ExeInputError {
  text: string;
  status: "error";
  error: string;
}

export type ExeInput = ExeInputSuccess | ExeInputError;

export function createInputSuccess(text: string, value: number[]): ExeInput {
  return {
    text,
    status: "success",
    value,
  };
}

export function createInputError(text: string, errorMessage: string): ExeInput {
  return {
    text,
    status: "error",
    error: errorMessage,
  };
}

export function parseInputField(text: string, isTextMode: boolean): ExeInput {
  try {
    if (isTextMode) {
      const codePoints = Array.from(text).map((c) => c.codePointAt(0)!);
      return createInputSuccess(text, codePoints);
    }
    const numbers = parseNumericInputField(text);
    return createInputSuccess(text, numbers);
  } catch (err: unknown) {
    return createInputError(text, String(err));
  }
}

function isWhiteSpaceOrComma(char: string) {
  return [" ", "\t", "\r", "\n", ","].includes(char);
}

function parseNumericInputField(text: string): number[] {
  const numbers: number[] = [];
  let idx = 0;
  while (idx < text.length) {
    if (isWhiteSpaceOrComma(text[idx])) {
      // ignore white space
    } else if (text[idx] === '"') {
      const startIdx = idx;
      idx += 1;
      while (text[idx] != null && text[idx] !== '"') {
        if (text[idx] === "\\") {
          idx += 1;
        }
        idx += 1;
      }
      const token = text.slice(startIdx, idx + 1);
      if (text[idx] != '"') {
        throw Error(`invalid string literal: “${token}”`);
      } else if (text[idx + 1] != null && !isWhiteSpaceOrComma(text[idx + 1])) {
        throw Error("string literal must be followed with whitespace or comma");
      }
      numbers.push(...parseStringLiteral(token));
    } else if (text[idx] === "'") {
      const startIdx = idx;
      idx += 1;
      while (text[idx] != null && text[idx] !== "'") {
        if (text[idx] === "\\") {
          idx += 1;
        }
        idx += 1;
      }
      const token = text.slice(startIdx, idx + 1);
      if (text[idx] != "'") {
        throw Error(`invalid character literal: “${token}”`);
      } else if (text[idx + 1] != null && !isWhiteSpaceOrComma(text[idx + 1])) {
        throw Error(
          "character literal must be followed with whitespace or comma"
        );
      }
      numbers.push(parseCharLiteral(token));
    } else {
      const startIndex = idx;
      while (text[idx] != null && !isWhiteSpaceOrComma(text[idx])) {
        idx += 1;
      }
      const token = text.slice(startIndex, idx);
      numbers.push(parseInt32(token));
    }
    idx += 1;
  }
  return numbers;
}
