<script lang="ts">
  import { type ExeError } from "./exe/error";
  import { toUnicode } from "./utils/unicode";

  let {
    output,
    error,
    isTextMode,
  }: {
    output: number[];
    error: ExeError | null;
    isTextMode: boolean;
  } = $props();
</script>

<div>
  {#if output.length === 0}
    <p><i>Empty output.</i></p>
  {:else if isTextMode}
    <pre>{toUnicode(output)}</pre>
  {:else}
    <p>{output.join(", ")}</p>
  {/if}

  {#if error != null}
    <p class="error">
      {error.msg} on line {error.lineNumber}
    </p>
  {/if}
</div>

<style>
  .error {
    color: red;
  }
</style>
