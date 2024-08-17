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
            lineIdx: 0,
            instructionCount: 0,
            maxInstructionCount: 1000,
            currentValue: 0,
            cellCount: 3,
            cells: new Int32Array(3),
            lineIdxOfLabels: {},
            output: {
                kind: "numbers",
                value: [],
            },
            error: null,
        });
        alert(result.error == null ? result.output.value : `${result.error.msg} on line ${result.error.lineNumber}`);
    }

    return <div>
        <CodeInput value={code} onInput={handleInput} />
        <div className="flex flex-row justify-between">
            <button onClick={handleClear}>✕ Clear</button>
            <button onClick={handleRun}>▶ Run</button>
        </div>
    </div>;
}
