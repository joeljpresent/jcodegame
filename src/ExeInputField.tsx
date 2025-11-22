"use client";

import { FormEvent } from "react";
import { ExeInput, parseInputField } from "./exe/input";
import ExeInputVisualizer from "./ExeInputVisualizer";

export default function ExeInputField({ input, onChange, isTextMode }: Props) {

  function handleTextChange(e: FormEvent<HTMLTextAreaElement>) {
    const newText = e.currentTarget.value;
    const nextInput = parseInputField(newText, isTextMode);
    onChange(nextInput);
  }

  return <>
    <div>
      <textarea
        value={input.text}
        onInput={handleTextChange}
        cols={40} rows={5}
        style={{
          color: "black",
          fontFamily: "monospace",
        }}
      />
    </div>
    <div>
      {
        input.status === "success"
          ? <ExeInputVisualizer
            input={input.value}
            nextInputIdx={null}
            isTextMode={isTextMode}
          />
          : <p style={{ color: "red" }}>{input.error}</p>
      }
    </div>
  </>;
}

interface Props {
  input: ExeInput;
  onChange: (input: ExeInput) => void,
  isTextMode: boolean,
}
