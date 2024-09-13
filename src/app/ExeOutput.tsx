"use client";

import { useState } from "react";
import { ExeError } from "./exe/error";
import TextModeToggle from "./TextModeToggle";
import { toUnicode } from "./utils/unicode";

export default function ExeOutput({ output, error }: Props) {
  const [isTextMode, setIsTextMode] = useState(false);

  function handleToggleTextMode() {
    setIsTextMode(!isTextMode);
  }

  function outputDisplay() {
    if (output.length === 0) {
      return <p><i>Empty output.</i></p>
    } else if (isTextMode) {
      return <pre>{toUnicode(output)}</pre>
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
    <h2>Output</h2>
    <TextModeToggle isTextMode={isTextMode} onToggleTextMode={handleToggleTextMode} />
    <div>
      {outputDisplay()}
      {errorDisplay()}
    </div>
  </>;
}

interface Props {
  output: number[],
  error: ExeError | null,
}
