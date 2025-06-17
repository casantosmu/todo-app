import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";

const queryClient = new QueryClient();

const root = document.getElementById("root");
if (!root) {
  throw new Error("#root element not found");
}

Modal.setAppElement(root);
createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
