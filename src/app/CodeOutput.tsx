"use client";

import { FormEvent } from "react";
import { CodeError } from "./parser";

export default function CodeOutput({
  output, error, isTextMode, onToggleTextMode
}: CodeOutputProps) {
  function outputDisplay() {
    if (output.length === 0) {
      return <p><i>Empty output.</i></p>
    } else if (isTextMode) {
      return <p>{toUnicode(output)}</p>
    }
    return <p>{output.join(", ")}</p>
  }

  function errorDisplay() {
    if (error == null) {
      return <></>;
    }
    return (
      <p style={{ color: "red" }}>
        {error.msg} on line {error.lineNumber}
      </p>
    )
  }

  return <>
    <div className="flex flex-row justify-between">
      <label htmlFor="toggleTextModeButton">
        {isTextMode ? "Text mode" : "Numeric mode"}
      </label>
      <button name="toggleTextModeButton" onClick={onToggleTextMode}>
        {isTextMode ? "To numeric" : "To text"}
      </button>
    </div>
    <div>
      {outputDisplay()}
      {errorDisplay()}
    </div>
  </>;
}

interface CodeOutputProps {
  output: number[],
  error: CodeError | null,
  isTextMode: boolean,
  onToggleTextMode: (e: FormEvent<HTMLButtonElement>) => void,
}

function isUnicodeCodePoint(n: number) {
  return n >= 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff);
}

/**
 * Convert an array of Unicode code points to a Unicode string.
 *
 * Any invalid code point is replaced with a REPLACEMENT CHARACTER (U+FFFD).
 */
function toUnicode(arr: number[]) {
  return String.fromCodePoint(...arr.map(n => isUnicodeCodePoint(n) ? n : 0xfffd));
}
