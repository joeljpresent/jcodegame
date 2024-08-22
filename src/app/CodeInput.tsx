"use client";

import { FormEvent } from "react";

export default function CodeInput({ value, onInput }: Props) {
  return (
    <textarea
      value={value}
      onInput={onInput}
      cols={40} rows={10}
      style={{
        color: "black",
        fontFamily: "monospace",
      }}
    />
  );
}

interface Props {
  value: string,
  onInput: (e: FormEvent<HTMLTextAreaElement>) => void,
}
