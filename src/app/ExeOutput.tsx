"use client";

import { FormEvent } from "react";
import { ExeError } from "./execution/error";
import { toUnicode } from "./utils";

export default function ExeOutput({ output, error, isTextMode, onToggleTextMode }: Props) {
  function outputDisplay() {
    if (output.length === 0) {
      return <p><i>Empty output.</i></p>
    } else if (isTextMode) {
      return <p><pre>{toUnicode(output)}</pre></p>
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

interface Props {
  output: number[],
  error: ExeError | null,
  isTextMode: boolean,
  onToggleTextMode: (e: FormEvent<HTMLButtonElement>) => void,
}