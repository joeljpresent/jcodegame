"use client";

import { FormEvent, useState } from "react";
import CodeInput from "./CodeInput";
import { CodeError, parseCode as parseAndRun } from "./parser";
import CodeOutput from "./CodeOutput";

export default function CodeGame() {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState<number[]>([]);
    const [error, setError] = useState<CodeError | null>(null);
    const [isTextMode, setIsTextMode] = useState(false);

    function handleInput(e: FormEvent<HTMLTextAreaElement>) {
        setCode(e.currentTarget.value);
    }

    function handleClear() {
        setCode("");
        setOutput([]);
        setError(null);
    }

    function handleToggleTextMode() {
        setIsTextMode(!isTextMode);
    }

    function handleRun() {
        const result = parseAndRun(code, {
            lineIdx: 0,
            instructionCount: 0,
            maxInstructionCount: 10000,
            currentValue: 0,
            cellCount: 3,
            cells: new Int32Array(3),
            lineIdxOfLabels: {},
            output: [],
            error: null,
        });
        setOutput(result.output);
        setError(result.error);
    }

    return <div>
        <CodeInput value={code} onInput={handleInput} />
        <div className="flex flex-row justify-between">
            <button onClick={handleClear}>✕ Clear</button>
            <button onClick={handleRun}>▶ Run</button>
        </div>
        <CodeOutput
            output={output}
            error={error}
            isTextMode={isTextMode}
            onToggleTextMode={handleToggleTextMode}
        />
    </div>;
}
