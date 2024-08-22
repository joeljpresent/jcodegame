"use client";

import { FormEvent, useState } from "react";
import CodeInput from "./CodeInput";
import CodeOutput from "./CodeOutput";
import { CodeState, initCodeState, shouldCodeContinue } from "./execution/state";
import { runNextStep, runScript } from "./execution/runner";
import StepByStepCode from "./StepByStepCode";
import StepByStepValues from "./StepByStepValues";

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
    setCodeState(null);
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
    if (codeState == null) {
      setCodeState(initCodeState(code, settings));
      return;
    } else if (!shouldCodeContinue(codeState)) {
      return;
    }
    const newCodeState = structuredClone(codeState);
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
      <label htmlFor="stepByStepCheckbox">Step-by-step mode</label>
    </div>
    {
      isStepByStep && codeState != null
        ? <StepByStepCode codeState={codeState} />
        : <CodeInput value={code} onInput={handleInput} />
    }
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
    {isStepByStep && codeState != null && <StepByStepValues codeState={codeState} />}
  </div>;
}
