import { parseInt32 } from "../utils/int32";
import { parseCharLiteral } from "../utils/unicode";

interface ExeInputSuccess {
  status: "success",
  value: number[],
}

interface ExeInputError {
  status: "error",
  error: string,
}

export type ExeInput = ExeInputSuccess | ExeInputError;

export function createInputSuccess(value: number[]): ExeInput {
  return {
    status: "success",
    value,
  };
}

export function createInputError(errorMessage: string): ExeInput {
  return {
    status: "error",
    error: errorMessage,
  };
}

export function parseInputField(text: string, isTextMode: boolean): ExeInput {
  try {
    if (isTextMode) {
      const codePoints = Array.from(text).map(c => c.codePointAt(0)!);
      return createInputSuccess(codePoints);
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
    return createInputSuccess(numbers);
  }
  catch (err: unknown) {
    return createInputError(String(err));
  }
}
