import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CodeGame from "./CodeGame";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="min-h-screen flex-col pt-10">
      <CodeGame />
    </main>
  </StrictMode>,
)
