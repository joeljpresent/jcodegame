"use client";

import { FormEvent, useState } from "react";
import CodeInput from "./CodeInput";
import { parseCode } from "./parser";

export default function CodeGame() {
    const [code, setCode] = useState("");

    function handleInput(e: FormEvent<HTMLTextAreaElement>) {
        setCode(e.currentTarget.value);
    }

    function handleClear() {
        setCode("");
    }

    function handleRun() {
        const result = parseCode(code, {
            currentValue: 0,
            cells: [0, 0, 0],
            lineIdxOfLabels: {},
            output: {
                kind: "numbers",
                value: [],
            },
            error: null,
        });
        alert(result.error == null ? result.output.value : `${result.error.msg} on line ${result.error.lineNumber}`);
        alert(JSON.stringify(result.lineIdxOfLabels, null, 4));
    }

    return <div>
        <CodeInput value={code} onInput={handleInput} />
        <div className="flex flex-row justify-between">
            <button onClick={handleClear}>✕ Clear</button>
            <button onClick={handleRun}>▶ Run</button>
        </div>
    </div>;
}
