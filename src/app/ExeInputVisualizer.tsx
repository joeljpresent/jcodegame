"use client";

import { useState } from "react";
import TextModeToggle from "./TextModeToggle";
import { toUnicode } from "./utils";

export default function ExeInputVisualizer({ input, nextInputIdx }: Props) {
  const [isTextMode, setIsTextMode] = useState(false);

  function handleToggleTextMode() {
    setIsTextMode(!isTextMode);
  }

  function inputDisplay() {
    if (input.length === 0) {
      return <p><i>Empty input.</i></p>
    } else if (isTextMode) {
      return <p><pre>{toUnicode(input)}</pre></p>
    }
    return <p>{input.join(", ")}</p>
  }

  return <>
    <h2>Input</h2>
    <TextModeToggle isTextMode={isTextMode} onToggleTextMode={handleToggleTextMode} />
    <div>
      {inputDisplay()}
    </div>
  </>;
}

interface Props {
  input: number[],
  nextInputIdx: number,
}
