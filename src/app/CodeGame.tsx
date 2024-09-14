"use client";

import { FormEvent, useState } from "react";
import ScriptField from "./ScriptField";
import ExeOutput from "./ExeOutput";
import { ExeSettings, ExeState, initExeState, shouldExeContinue } from "./exe/state";
import { runNextStep, runScript } from "./exe/runner";
import ScriptVisualizer from "./ScriptVisualizer";
import ValueVisualizer from "./ValueVisualizer";
import ExeInputField from "./ExeInputField";
import { createInputSuccess, ExeInput, parseInputField } from "./exe/input";
import ExeInputVisualizer from "./ExeInputVisualizer";
import TextModeToggle from "./TextModeToggle";

export default function CodeGame() {
  const [script, setScript] = useState("");
  const [exeInput, setExeInput] = useState(createInputSuccess("", []));
  const [isStepByStep, setIsStepByStep] = useState(false);
  const [isExeInputTextMode, setIsExeInputTextMode] = useState(false);
  const [isExeOutputTextMode, setIsExeOutputTextMode] = useState(false);
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

  function handleToggleExeInputTextMode() {
    const nextIsTextMode = !isExeInputTextMode;
    setIsExeInputTextMode(nextIsTextMode);
    const nextInput = parseInputField(exeInput.text, nextIsTextMode);
    setExeInput(nextInput);
    setExeState(null);
  }

  function handleToggleExeOutputTextMode() {
    setIsExeOutputTextMode(!isExeOutputTextMode);
  }

  function handleExeInputChange(nextInput: ExeInput) {
    setExeInput(nextInput);
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

  return (
    <div className="flex flex-row">
      <div>
        <div>
          <input name="stepByStepCheckbox" type="checkbox" onChange={handleToggleStepByStep} />
          <label htmlFor="stepByStepCheckbox">Step-by-step mode</label>
        </div>
        <h2>Input</h2>
        {
          isStepByStep && exeState != null && exeInput.status === "success"
            ? <ExeInputVisualizer
              input={exeInput.value}
              nextInputIdx={exeState?.nextInputIdx ?? 0}
              isTextMode={isExeInputTextMode}
            />
            : <>
              <TextModeToggle
                isTextMode={isExeInputTextMode}
                onToggleTextMode={handleToggleExeInputTextMode}
              />
              <ExeInputField
                input={exeInput}
                isTextMode={isExeInputTextMode}
                onChange={handleExeInputChange}
              />
            </>
        }
        <h2>Script</h2>
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
      </div>
      <div>
        <h2>Output</h2>
        <TextModeToggle
          isTextMode={isExeOutputTextMode}
          onToggleTextMode={handleToggleExeOutputTextMode}
        />
        <ExeOutput
          output={exeState?.output ?? []}
          error={exeState?.error ?? null}
          isTextMode={isExeOutputTextMode}
        />
        {isStepByStep && exeState != null && <ValueVisualizer exeState={exeState} />}
      </div>
    </div>
  );
}
