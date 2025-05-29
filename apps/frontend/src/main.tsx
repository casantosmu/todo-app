import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import App from "./App.tsx";
import "./index.css";
import { enableMocking } from "./lib/browserMocks.ts";
import "./lib/i18n";

const root = document.getElementById("root");
if (!root) {
  throw new Error("#root element not found");
}

Modal.setAppElement(root);

await enableMocking();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
