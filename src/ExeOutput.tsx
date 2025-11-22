"use client";

import { ExeError } from "./exe/error";
import { toUnicode } from "./utils/unicode";

export default function ExeOutput({ output, error, isTextMode }: Props) {
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
}
