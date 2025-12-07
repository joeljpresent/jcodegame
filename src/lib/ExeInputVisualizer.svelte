<script lang="ts">
  import { toUnicodeChar } from "./utils/unicode";

  let {
    input,
    nextInputIdx,
    isTextMode,
  }: {
    input: number[];
    nextInputIdx: number | null;
    isTextMode: boolean;
  } = $props();

  function valueClass(idx: number) {
    if (nextInputIdx == null) {
      return "";
    } else if (idx === nextInputIdx) {
      return "current-line";
    } else if (idx === nextInputIdx - 1) {
      return "previous-line";
    }
  }
</script>

{#snippet endDisplay()}
  <span class="end-display {valueClass(input.length)}"> END </span>
{/snippet}

{#if isTextMode}
  <p class="text-mode">
    {#each input as val, idx}
      <span class={valueClass(idx)}>{toUnicodeChar(val)}</span>
    {/each}
    {@render endDisplay()}
  </p>
{:else}
  <p>
    {#each input as val, idx}
      <span class={valueClass(idx)}>
        {val}
      </span>{", "}
    {/each}
    {@render endDisplay()}
  </p>
{/if}

<style>
  p.text-mode {
    font-family: monospace;
    font-size: large;
  }

  p.text-mode span {
    white-space: pre;
  }

  .end-display {
    font-size: small;
  }
</style>
