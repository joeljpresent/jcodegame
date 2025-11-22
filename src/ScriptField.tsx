"use client";

import { FormEvent } from "react";

export default function ScriptField({ value, onChange }: Props) {
  return (
    <div>
      <textarea
        value={value}
        onInput={onChange}
        cols={40} rows={10}
        style={{
          color: "black",
          fontFamily: "monospace",
        }}
      />
    </div>
  );
}

interface Props {
  value: string,
  onChange: (e: FormEvent<HTMLTextAreaElement>) => void,
}
