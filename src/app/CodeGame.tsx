"use client";

import { FormEvent, MouseEvent, useState } from "react";
import CodeInput from "./CodeInput";

export default function CodeGame() {
    const [code, setCode] = useState("");

    function handleInput(e: FormEvent<HTMLTextAreaElement>) {
        setCode(e.currentTarget.value);
    }

    function handleClear(e: MouseEvent<HTMLButtonElement>) {
        setCode("");
    }

    function handleRun(e: MouseEvent<HTMLButtonElement>) {
        alert(code);
    }

    return <div>
        <CodeInput value={code} onInput={handleInput} />
        <div className="flex flex-row justify-between">
            <button onClick={handleClear}>✕ Clear</button>
            <button onClick={handleRun}>▶ Run</button>
        </div>
    </div>;
}
