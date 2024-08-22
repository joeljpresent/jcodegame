"use client";

import { FormEvent, useState } from "react";
import CodeInput from "./CodeInput";
import CodeOutput from "./CodeOutput";
import { CodeState, initCodeState, shouldCodeContinue } from "./execution/state";
import { runNextStep, runScript } from "./execution/runner";

export default function CodeGame() {
  const [code, setCode] = useState("");
  const [isStepByStep, setIsStepByStep] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [codeState, setCodeState] = useState<CodeState | null>(null);

  const settings = {
    maxInstructionCount: 10000,
    cellCount: 16,
  };

  function handleInput(e: FormEvent<HTMLTextAreaElement>) {
    setCode(e.currentTarget.value);
  }

  function handleClear() {
    setCode("");
    setCodeState(null);
  }

  function handleToggleTextMode() {
    setIsTextMode(!isTextMode);
  }

  function handleRun() {
    const result = runScript(code, settings);
    setCodeState(result);
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
  }

  function handleToggleStepByStep() {
    setIsStepByStep(!isStepByStep);
    setCodeState(null);
  }

  function handleResetCodeState() {
    setCodeState(null);
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
      output={codeState?.output ?? []}
      error={codeState?.error ?? null}
      isTextMode={isTextMode}
      onToggleTextMode={handleToggleTextMode}
    />
  </div>;
}
