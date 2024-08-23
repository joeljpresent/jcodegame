"use client";

import { FormEvent } from "react";

export default function ScriptField({ value, onChange }: Props) {
  return (
    <textarea
      value={value}
      onInput={onChange}
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
  onChange: (e: FormEvent<HTMLTextAreaElement>) => void,
}
