<script lang="ts">
  let {
    isTextMode,
    onToggleTextMode,
  }: {
    isTextMode: boolean;
    onToggleTextMode: () => void;
  } = $props();

  const uid = $props.id();
  const buttonName = `toggle-text-mode-${uid}`;
</script>

<div class="toggle-container">
  <label for={buttonName}>
    {isTextMode ? "Text mode" : "Numeric mode"}
  </label>
  <button name={buttonName} onclick={onToggleTextMode}>
    {isTextMode ? "To numeric" : "To text"}
  </button>
</div>

<style>
  .toggle-container {
    display: flex;
    flex-direction: row;
  }

  button {
    font-size: small;
    margin-left: 1rem;
  }
</style>
