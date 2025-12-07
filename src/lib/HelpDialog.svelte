<script lang="ts">
  let isVisible = $state(false);
  let toggleVisibility = () => {
    isVisible = !isVisible;
  };
</script>

<button onclick={toggleVisibility}> 🛈 Help </button>

<dialog open={isVisible}>
  <article>
    <h1>JCodeGame</h1>
    <p>
      This website is a toy project by Joël J. Présent. It is a coding environment for a custom, minimal language called
      &quot;JCGL&quot; (JCodeGame Language).
    </p>
    <p>You can write a script, optionally read some input, and write to output.</p>
    <a href="https://github.com/joeljpresent/jcodegame/blob/main/README.md"> 👉︎ More info 👈︎ </a>
  </article>
  <button onclick={toggleVisibility}> ✕ Close </button>
</dialog>

<style>
  dialog {
    max-width: 30rem;
    padding: 2rem;
    border-width: 2px;
    border-radius: 0.5rem;
  }

  a {
    font-weight: bold;
  }

  button {
    margin-top: 0.5rem;
  }
</style>
