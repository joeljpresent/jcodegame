"use client";

import { FormEvent } from "react";

export default function CodeInput({ value, onInput }: CodeInputProps) {
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

interface CodeInputProps {
    value: string,
    onInput: (e: FormEvent<HTMLTextAreaElement>) => void,
}
