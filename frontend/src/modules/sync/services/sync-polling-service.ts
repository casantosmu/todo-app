import { syncService } from "./sync-service";

const POLLING_MS = 5_000;

let pollingInterval: NodeJS.Timeout | undefined;

export const syncPollingService = {
  init() {
    if (pollingInterval) {
      console.warn("Sync polling already initialized");
      return;
    }

    pollingInterval = setInterval(() => {
      syncService.sync().catch(console.error);
    }, POLLING_MS);
  },

  stop() {
    if (!pollingInterval) {
      console.warn("Sync polling isn't initialized");
      return;
    }

    clearInterval(pollingInterval);
    pollingInterval = undefined;
  },
};
