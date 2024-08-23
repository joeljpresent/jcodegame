"use client";

import { FormEvent, useState } from "react";
import TextModeToggle from "./TextModeToggle";
import { ExeInput, parseInputField } from "./exe/input";
import ExeInputDisplay from "./ExeInputDisplay";

export default function ExeInputField({ input, onChange }: Props) {
  const [text, setText] = useState("");
  const [isTextMode, setIsTextMode] = useState(false);

  function handleToggleTextMode() {
    setIsTextMode(!isTextMode);
    const newInput = parseInputField(text, !isTextMode);
    onChange(newInput);
  }

  function handleTextChange(e: FormEvent<HTMLTextAreaElement>) {
    const newText = e.currentTarget.value;
    setText(newText);
    const newInput = parseInputField(newText, isTextMode);
    onChange(newInput);
  }

  return <>
    <div>
      <textarea
        value={text}
        onInput={handleTextChange}
        cols={40} rows={5}
        style={{
          color: "black",
          fontFamily: "monospace",
        }}
      />
      <TextModeToggle isTextMode={isTextMode} onToggleTextMode={handleToggleTextMode} />
    </div>
    <div>
      {
        input.status === "success"
          ? <ExeInputDisplay
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
}
