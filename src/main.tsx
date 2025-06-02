import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import App from "./App.tsx";
import "./index.css";
import db from "./lib/db.ts";
import "./lib/i18n";

const root = document.getElementById("root");
if (!root) {
  throw new Error("#root element not found");
}

db.info().then(console.log).catch(console.error);

Modal.setAppElement(root);
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
