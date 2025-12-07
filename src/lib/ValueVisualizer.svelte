<script lang="ts">
  import { type ExeState } from "./exe/state";
  import { toUnicodeChar } from "./utils/unicode";

  let { exeState }: { exeState: ExeState } = $props();
</script>

{#snippet row(name: string, val: number)}
  <tr>
    <td>{name}</td>
    <td>{val}</td>
    <td>{toUnicodeChar(val)}</td>
  </tr>
{/snippet}

<table>
  <tbody>
    {@render row("cur", exeState.currentValue)}
    {#each exeState.cells as val, idx}
      {@render row(`@${idx}`, val)}
    {/each}
  </tbody>
</table>

<style>
  td:not(:last-child) {
    padding-right: 1em;
  }
</style>
