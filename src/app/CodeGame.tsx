"use client";

import { FormEvent, useState } from "react";
import CodeInput from "./CodeInput";

export default function CodeGame() {
    const [code, setCode] = useState("");

    function handleInput(e: FormEvent<HTMLTextAreaElement>) {
        setCode(e.currentTarget.value);
    }

    return <>
        <CodeInput value={code} onInput={handleInput} />
    </>;
}
