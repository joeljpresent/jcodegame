"use client";

import { FormEvent } from "react";

export default function TextModeToggle({ isTextMode, onToggleTextMode }: Props) {
  return <>
    <div className="flex flex-row justify-between">
      <label htmlFor="toggleTextModeButton">
        {isTextMode ? "Text mode" : "Numeric mode"}
      </label>
      <button name="toggleTextModeButton" onClick={onToggleTextMode}>
        {isTextMode ? "To numeric" : "To text"}
      </button>
    </div>
  </>;
}

interface Props {
  isTextMode: boolean,
  onToggleTextMode: (e: FormEvent<HTMLButtonElement>) => void,
}
