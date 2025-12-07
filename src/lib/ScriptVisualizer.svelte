<script lang="ts">
  import { type ExeState } from "./exe/state";

  const { exeState }: { exeState: ExeState } = $props();

  function lineClass(idx: number) {
    if (idx === exeState.lineIdx) {
      return "current-line";
    } else if (idx === exeState.previousLineIdx) {
      return "previous-line";
    }
    return "";
  }
</script>

<div>
  {#each exeState.commands as args, idx}
    <p class={lineClass(idx)}>
      [{idx + 1}] {args.join(" ")}
    </p>
  {/each}
</div>

<style>
  p {
    margin: 0;
  }
</style>
