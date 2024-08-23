"use client";

import { useState } from "react";
import TextModeToggle from "./TextModeToggle";
import { toUnicodeChar } from "./utils";

export default function ExeInputVisualizer({ input, nextInputIdx }: Props) {
  const [isTextMode, setIsTextMode] = useState(false);

  function getValueStyle(idx: number) {
    if (idx === nextInputIdx) {
      return {
        fontWeight: "bold",
        color: "cyan",
      };
    } else if (idx === nextInputIdx - 1) {
      return {
        color: "lime",
      };
    }
  }

  function handleToggleTextMode() {
    setIsTextMode(!isTextMode);
  }

  function endDisplay() {
    return (
      <span style={{
        ...getValueStyle(input.length),
        fontSize: "0.6em",
      }}>
        END
      </span>
    );
  }

  function inputDisplay() {
    if (isTextMode) {
      return (
        <p><pre>
          {
            input.map((v, idx) => (
              <span style={getValueStyle(idx)}>
                {toUnicodeChar(v)}
              </span>
            ))
          }
          {endDisplay()}
        </pre></p>
      );
    }
    return <p>
      {
        input.map((v, idx) => (
          <span style={getValueStyle(idx)}>{v}, </span>
        ))
      }
      {endDisplay()}
    </p>;
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
