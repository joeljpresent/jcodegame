import { useState } from "react";

export default function HelpDialog() {
  const [isShown, setIsShown] = useState(false);

  function showDialog() {
    setIsShown(true);
  }

  function hideDialog() {
    setIsShown(false);
  }

  return <>
    <button onClick={showDialog}>
      🛈 Help
    </button>

    <dialog
      open={isShown}
      style={{
        maxWidth: "30rem",
        padding: "2rem",
        borderWidth: "2px",
        borderRadius: "0.5rem",
      }}
    >
      <article>
        <h1>JCodeGame</h1>
        <p>
          This website is a toy project by Joël J. Présent.
          It is a coding environment for a custom, minimal language called &quot;JCGL&quot; (JCodeGame Language).
        </p>
        <p>
          You can write a script, optionally read some input, and write to output.
        </p>
      </article>
      <button className="mt-2" onClick={hideDialog}>
        ✕ Close
      </button>
    </dialog>
  </>;
};
