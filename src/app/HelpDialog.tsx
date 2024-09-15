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
        maxWidth: "20rem",
        padding: "2rem",
        borderWidth: "2px",
        borderRadius: "0.5rem",
      }}
    >
      <article>
        <p>TODO: write Help</p>
      </article>
      <button onClick={hideDialog}>
        ✕ Close
      </button>
    </dialog>
  </>;
};
