<script lang="ts">
  let { value = $bindable() }: { value: string } = $props();
</script>

<textarea bind:value cols="40" rows="10"></textarea>

<style>
  textarea {
    font-family: monospace;
  }
</style>
