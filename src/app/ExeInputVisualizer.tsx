"use client";

import { useState } from "react";
import TextModeToggle from "./TextModeToggle";
import ExeInputDisplay from "./ExeInputDisplay";

export default function ExeInputVisualizer({ input, nextInputIdx }: Props) {
  const [isTextMode, setIsTextMode] = useState(false);

  function handleToggleTextMode() {
    setIsTextMode(!isTextMode);
  }

  return <>
    <h2>Input</h2>
    <TextModeToggle isTextMode={isTextMode} onToggleTextMode={handleToggleTextMode} />
    <div>
      <ExeInputDisplay
        input={input}
        nextInputIdx={nextInputIdx}
        isTextMode={isTextMode}
      />
    </div>
  </>;
}

interface Props {
  input: number[],
  nextInputIdx: number,
}
