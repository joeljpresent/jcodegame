"use client";

import { FormEvent, useState } from "react";
import ScriptField from "./ScriptField";
import ExeOutput from "./ExeOutput";
import { ExeSettings, ExeState, initExeState, shouldExeContinue } from "./exe/state";
import { runNextStep, runScript } from "./exe/runner";
import ScriptVisualizer from "./ScriptVisualizer";
import ValueVisualizer from "./ValueVisualizer";
import ExeInputVisualizer from "./ExeInputVisualizer";

export default function CodeGame() {
  const [script, setScript] = useState("");
  const [exeInput, setExeInput] = useState<number[]>([]);
  const [isStepByStep, setIsStepByStep] = useState(false);
  const [exeState, setExeState] = useState<ExeState | null>(null);

  function createSettings(): ExeSettings {
    return {
      maxInstructionCount: 10000,
      cellCount: 16,
      input: exeInput,
    };
  }

  function handleScriptChange(e: FormEvent<HTMLTextAreaElement>) {
    // <TODO: create input field for exe input>
    setExeInput([0x45, 0x71, 0x38, 0x54, 0x66]);
    // </TODO>
    setScript(e.currentTarget.value);
    setExeState(null);
  }

  function handleScriptClear() {
    setScript("");
    setExeState(null);
  }

  function handleRun() {
    const result = runScript(script, createSettings());
    setExeState(result);
  }

  function handleRunNextStep() {
    if (exeState == null) {
      setExeState(initExeState(script, createSettings()));
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
    <ExeInputVisualizer
      input={exeInput}
      nextInputIdx={exeState?.nextInputIdx ?? 0}
    />
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
