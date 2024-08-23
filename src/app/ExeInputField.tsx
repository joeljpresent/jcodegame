"use client";

import { FormEvent, useState } from "react";
import TextModeToggle from "./TextModeToggle";
import { createInputError, createInputSuccess, ExeInput } from "./exe/input";
import { parseInt32 } from "./utils/int32";
import ExeInputDisplay from "./ExeInputDisplay";

export default function ExeInputField({ input, onChange }: Props) {
  const [text, setText] = useState("");
  const [isTextMode, setIsTextMode] = useState(false);

  function handleToggleTextMode() {
    setIsTextMode(!isTextMode);
    const newInput = parse(text, !isTextMode);
    onChange(newInput);
  }

  function handleTextChange(e: FormEvent<HTMLTextAreaElement>) {
    const newText = e.currentTarget.value;
    setText(newText);
    const newInput = parse(newText, isTextMode);
    onChange(newInput);
  }

  function parse(text: string, isTextMode: boolean): ExeInput {
    try {
      if (isTextMode) {
        const codePoints = Array.from(text).map(c => c.codePointAt(0)!);
        return createInputSuccess(codePoints);
      }
      const numbers = text
        .trim()
        .split(/\s*,\s*/g)
        .filter(s => s !== "")
        .map(s => parseInt32(s));
      return createInputSuccess(numbers);
    }
    catch (err: unknown) {
      return createInputError(String(err));
    }
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
