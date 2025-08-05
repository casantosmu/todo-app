import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { queryClient } from "./lib/react-query";
import { AuthProvider } from "./modules/sync/providers/auth-provider";
import { syncPushHandler } from "./modules/sync/services/sync-push-handler";
import { taskPullHandler } from "./modules/tasks/services/task-pull-handler";
import { ThemeProvider } from "./providers/theme-provider";

import "@fontsource/inter/400.css";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

syncPushHandler.init();
taskPullHandler.init();

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
