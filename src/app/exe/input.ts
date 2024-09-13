import { parseInt32 } from "../utils/int32";
import { parseCharLiteral } from "../utils/unicode";

interface ExeInputSuccess {
  text: string,
  status: "success",
  value: number[],
}

interface ExeInputError {
  text: string,
  status: "error",
  error: string,
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
      const codePoints = Array.from(text).map(c => c.codePointAt(0)!);
      return createInputSuccess(text, codePoints);
    }
    const numbers = text
      .trim()
      .split(/\s*,\s*/g)
      .filter(s => s !== "")
      .map(s => (
        s.charAt(0) === "'"
          ? parseCharLiteral(s)
          : parseInt32(s)
      ));
    return createInputSuccess(text, numbers);
  }
  catch (err: unknown) {
    return createInputError(text, String(err));
  }
}
