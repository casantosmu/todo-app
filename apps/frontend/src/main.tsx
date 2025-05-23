import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";

const root = document.getElementById("root");
if (!root) {
  throw new Error("#root element not found");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
