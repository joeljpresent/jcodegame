"use client";

import { FormEvent } from "react";

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
      {error != null && <p style={{ color: "red" }}>{error}</p>}
    </div>
  </>;
}

interface CodeOutputProps {
  output: number[],
  error: string | null,
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
