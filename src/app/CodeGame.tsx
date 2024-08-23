"use client";

import { FormEvent, useState } from "react";
import ScriptField from "./ScriptField";
import ExeOutput from "./ExeOutput";
import { ExeSettings, ExeState, initExeState, shouldExeContinue } from "./exe/state";
import { runNextStep, runScript } from "./exe/runner";
import ScriptVisualizer from "./ScriptVisualizer";
import ValueVisualizer from "./ValueVisualizer";
import ExeInputVisualizer from "./ExeInputVisualizer";
import ExeInputField from "./ExeInputField";
import { createInputSuccess, ExeInput } from "./exe/input";

export default function CodeGame() {
  const [script, setScript] = useState("");
  const [exeInput, setExeInput] = useState(createInputSuccess([]));
  const [isStepByStep, setIsStepByStep] = useState(false);
  const [exeState, setExeState] = useState<ExeState | null>(null);

  function createSettings(): ExeSettings | null {
    if (exeInput.status === "error") {
      return null;
    }
    return {
      maxInstructionCount: 10000,
      cellCount: 16,
      input: exeInput.value,
    };
  }

  function handleExeInputChange(newInput: ExeInput) {
    setExeInput(newInput);
  }

  function handleScriptChange(e: FormEvent<HTMLTextAreaElement>) {
    setScript(e.currentTarget.value);
    setExeState(null);
  }

  function handleScriptClear() {
    setScript("");
    setExeState(null);
  }

  function handleRun() {
    const settings = createSettings();
    if (settings == null) {
      return;
    }
    const result = runScript(script, settings);
    setExeState(result);
  }

  function handleRunNextStep() {
    if (exeState == null) {
      const settings = createSettings();
      if (settings != null) {
        setExeState(initExeState(script, settings));
      }
      return;
    } else if (!shouldExeContinue(exeState)) {
      return;
    }
    const newExeState = structuredClone(exeState);
    runNextStep(newExeState);
    setExeState(newExeState);
  }

  function handleToggleStepByStep() {
    setIsStepByStep(!isStepByStep);
    setExeState(null);
  }

  function handleResetExeState() {
    setExeState(null);
  }

  return <div>
    <div>
      <input name="stepByStepCheckbox" type="checkbox" onChange={handleToggleStepByStep} />
      <label htmlFor="stepByStepCheckbox">Step-by-step mode</label>
    </div>
    {
      isStepByStep && exeState != null && exeInput.status === "success"
        ? <ExeInputVisualizer
          input={exeInput.value}
          nextInputIdx={exeState?.nextInputIdx ?? 0}
        />
        : <ExeInputField
          input={exeInput}
          onChange={handleExeInputChange}
        />
    }

    {
      isStepByStep && exeState != null
        ? <ScriptVisualizer exeState={exeState} />
        : <ScriptField value={script} onChange={handleScriptChange} />
    }
    <div className="flex flex-row justify-between">
      <button onClick={handleScriptClear}>✕ Clear</button>
      {
        isStepByStep
          ? <>
            <button onClick={handleResetExeState}>⏹ Reset</button>
            {
              exeState == null || shouldExeContinue(exeState)
                ? <button onClick={handleRunNextStep}>⏭ Next step</button>
                : <button disabled>End</button>
            }
          </>
          : <button onClick={handleRun}>▶ Run</button>
      }
    </div>
    <ExeOutput
      output={exeState?.output ?? []}
      error={exeState?.error ?? null}
    />
    {isStepByStep && exeState != null && <ValueVisualizer exeState={exeState} />}
  </div>;
}
