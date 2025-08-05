import { eventEmitter } from "@/lib/event-emitter";
import type { SyncStatus } from "../models/sync-status";
import { authService } from "./auth-service";
import { syncService } from "./sync-service";

const POLLING_MS = 5_000;

let pollingInterval: NodeJS.Timeout | undefined;

export const syncPollingService = {
  init() {
    if (pollingInterval) {
      console.warn("Sync polling already initialized");
      return;
    }

    pollingInterval = setInterval(this._doSync.bind(this), POLLING_MS);
    this._doSync();
  },

  stop(status: SyncStatus) {
    if (!pollingInterval) {
      console.warn("Sync polling isn't initialized");
      return;
    }

    clearInterval(pollingInterval);
    pollingInterval = undefined;
    void eventEmitter.emit("sync:status-change", { status });
  },

  _doSync() {
    if (!navigator.onLine) {
      this.stop("offline");
      return;
    }

    const authSession = authService.getSession();
    if (!authSession) {
      this.stop("unconfigured");
      return;
    }

    void syncService.sync();
  },
};
