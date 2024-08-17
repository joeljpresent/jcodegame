"use client";

import { FormEvent, useState } from "react";
import CodeInput from "./CodeInput";
import { parseCode } from "./parser";
import CodeOutput from "./CodeOutput";

export default function CodeGame() {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isTextMode, setIsTextMode] = useState(false);

    function handleInput(e: FormEvent<HTMLTextAreaElement>) {
        setCode(e.currentTarget.value);
    }

    function handleClear() {
        setCode("");
    }

    function handleToggleTextMode() {
        setIsTextMode(!isTextMode);
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
            output: [],
            error: null,
        });
        setOutput(result.output);
        if (result.error != null) {
            setError(`${result.error.msg} on line ${result.error.lineNumber}`);
        } else {
            setError(null);
        }
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
