<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";
  import { type ExeInput, parseInputField } from "./exe/input";
  import ExeInputVisualizer from "./ExeInputVisualizer.svelte";

  let {
    input,
    onChange,
    isTextMode,
  }: {
    input: ExeInput;
    onChange: (input: ExeInput) => void;
    isTextMode: boolean;
  } = $props();

  let handleTextChange: FormEventHandler<HTMLTextAreaElement> = (e) => {
    const newText = e.currentTarget.value;
    const nextInput = parseInputField(newText, isTextMode);
    onChange(nextInput);
  };
</script>

<div>
  <textarea value={input.text} oninput={handleTextChange} cols="40" rows="5"></textarea>
</div>
<div>
  {#if input.status === "success"}
    <ExeInputVisualizer input={input.value} nextInputIdx={null} {isTextMode} />
  {:else}
    <p class="error">{input.error}</p>
  {/if}
</div>

<style>
  textarea {
    font-family: monospace;
  }

  .error {
    color: red;
  }
</style>
