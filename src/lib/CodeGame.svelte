<script lang="ts">
  import ScriptField from "./ScriptField.svelte";
  import ExeOutput from "./ExeOutput.svelte";
  import { type ExeSettings, type ExeState, initExeState, shouldExeContinue } from "./exe/state";
  import { runNextStep, runScript } from "./exe/runner";
  import ScriptVisualizer from "./ScriptVisualizer.svelte";
  import ValueVisualizer from "./ValueVisualizer.svelte";
  import ExeInputField from "./ExeInputField.svelte";
  import { createInputSuccess, type ExeInput, parseInputField } from "./exe/input";
  import ExeInputVisualizer from "./ExeInputVisualizer.svelte";
  import TextModeToggle from "./TextModeToggle.svelte";
  import HelpDialog from "./HelpDialog.svelte";

  let script = $state("");
  let exeInput = $state(createInputSuccess("", []));
  let isStepByStep = $state(false);
  let isExeInputTextMode = $state(false);
  let isExeOutputTextMode = $state(false);
  let exeState: ExeState | null = $state(null);

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
    isExeInputTextMode = nextIsTextMode;
    const nextInput = parseInputField(exeInput.text, nextIsTextMode);
    exeInput = nextInput;
    exeState = null;
  }

  function handleToggleExeOutputTextMode() {
    isExeOutputTextMode = !isExeOutputTextMode;
  }

  function handleExeInputChange(nextInput: ExeInput) {
    exeInput = nextInput;
  }

  function handleScriptChange(newScript: string) {
    script = newScript;
    exeState = null;
  }

  function handleScriptClear() {
    script = "";
    exeState = null;
  }

  function handleRun() {
    const settings = createSettings();
    if (settings == null) {
      return;
    }
    const result = runScript(script, settings);
    exeState = result;
  }

  function handleRunNextStep() {
    if (exeState == null) {
      const settings = createSettings();
      if (settings != null) {
        exeState = initExeState(script, settings);
      }
      return;
    } else if (!shouldExeContinue(exeState)) {
      return;
    }
    runNextStep(exeState);
  }

  function handleToggleStepByStep() {
    isStepByStep = !isStepByStep;
    exeState = null;
  }

  function handleResetExeState() {
    exeState = null;
  }
</script>

<section class="main-section">
  <div class="big-column">
    <h2>JCodeGame</h2>
    <HelpDialog />
    <div>
      <input id="step-by-step-checkbox" type="checkbox" onchange={handleToggleStepByStep} />
      <label class="checkbox-label" for="step-by-step-checkbox"> Step-by-step mode </label>
    </div>

    <h2>Input</h2>
    {#if isStepByStep && exeState != null && exeInput.status === "success"}
      <ExeInputVisualizer
        input={exeInput.value}
        nextInputIdx={exeState?.nextInputIdx ?? 0}
        isTextMode={isExeInputTextMode}
      />
    {:else}
      <TextModeToggle isTextMode={isExeInputTextMode} onToggleTextMode={handleToggleExeInputTextMode} />
      <ExeInputField input={exeInput} isTextMode={isExeInputTextMode} onChange={handleExeInputChange} />
    {/if}

    <h2>Script</h2>
    {#if isStepByStep && exeState != null}
      <ScriptVisualizer {exeState} />
    {:else}
      <ScriptField bind:value={() => script, handleScriptChange} />
    {/if}
    <div class="script-controls">
      <button onclick={handleScriptClear}>✕ Clear</button>
      {#if isStepByStep}
        <button onclick={handleResetExeState}>⏹︎ Reset</button>
        {#if exeState == null || shouldExeContinue(exeState)}
          <button onclick={handleRunNextStep}>⏭︎ Next step</button>
        {:else}
          <button disabled>End</button>
        {/if}
      {:else}
        <button onclick={handleRun}>▶︎ Run</button>
      {/if}
    </div>
  </div>

  <div class="big-column">
    <h2>Output</h2>
    <TextModeToggle isTextMode={isExeOutputTextMode} onToggleTextMode={handleToggleExeOutputTextMode} />
    <ExeOutput output={exeState?.output ?? []} error={exeState?.error ?? null} isTextMode={isExeOutputTextMode} />
    {#if isStepByStep && exeState != null}
      <ValueVisualizer {exeState} />
    {/if}
  </div>
</section>

<style>
  .main-section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }

  .big-column {
    padding-right: 1rem;
    min-width: 310px;
  }

  .checkbox-label {
    padding-left: 5px;
  }

  .script-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 1.75em;
    width: 90%;
  }
</style>
