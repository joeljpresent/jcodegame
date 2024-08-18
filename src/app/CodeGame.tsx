"use client";

import { FormEvent, useState } from "react";
import CodeInput from "./CodeInput";
import { CodeError, CodeState, initCodeState, runNextStep, runScript, shouldCodeContinue } from "./runner";
import CodeOutput from "./CodeOutput";

export default function CodeGame() {
  const [code, setCode] = useState("");
  const [isStepByStep, setIsStepByStep] = useState(false);
  const [output, setOutput] = useState<number[]>([]);
  const [error, setError] = useState<CodeError | null>(null);
  const [isTextMode, setIsTextMode] = useState(false);
  const [codeState, setCodeState] = useState<CodeState | null>(null);

  const settings = {
    maxInstructionCount: 10000,
    cellCount: 16,
  };

  function resetCodeState() {
    setCodeState(null);
    setOutput([]);
    setError(null);
  }

  function handleInput(e: FormEvent<HTMLTextAreaElement>) {
    setCode(e.currentTarget.value);
  }

  function handleClear() {
    setCode("");
    resetCodeState();
  }

  function handleToggleTextMode() {
    setIsTextMode(!isTextMode);
  }

  function handleRun() {
    const result = runScript(code, settings);
    setOutput(result.output);
    setError(result.error);
  }

  function handleRunNextStep() {
    if (codeState != null && !shouldCodeContinue(codeState)) {
      return;
    }
    let newCodeState = structuredClone(codeState);
    if (newCodeState == null) {
      newCodeState = initCodeState(code, settings);
    }
    runNextStep(newCodeState);
    setCodeState(newCodeState);
    setOutput(newCodeState.output);
    setError(newCodeState.error);
  }

  function handleToggleStepByStep() {
    setIsStepByStep(!isStepByStep);
    resetCodeState();
  }

  function handleResetCodeState() {
    resetCodeState();
  }

  return <div>
    <div>
      <input name="stepByStepCheckbox" type="checkbox" onChange={handleToggleStepByStep} />
      <label htmlFor="stepByStepCheckbox">Step by step mode</label>
    </div>
    <CodeInput value={code} onInput={handleInput} />
    <div className="flex flex-row justify-between">
      <button onClick={handleClear}>✕ Clear</button>
      {
        isStepByStep
          ? <>
            <button onClick={handleResetCodeState}>⏹ Reset</button>
            {
              codeState == null || shouldCodeContinue(codeState)
                ? <button onClick={handleRunNextStep}>⏭ Next step</button>
                : <button disabled>End</button>
            }
          </>
          : <button onClick={handleRun}>▶ Run</button>
      }

    </div>
    <CodeOutput
      output={output}
      error={error}
      isTextMode={isTextMode}
      onToggleTextMode={handleToggleTextMode}
    />
  </div>;
}
