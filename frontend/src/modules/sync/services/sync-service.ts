import { db } from "@/lib/db";
import { sleep } from "@/lib/utils";
import type { SyncChange } from "../models/sync-change";

export const syncService = {
  async sync() {
    try {
      await this._syncWithLock(async () => {
        const metadata = await this._getMetadata();
        const changes = await db.syncLogs
          .where("id")
          .above(metadata.lastSyncToken)
          .toArray();

        if (!changes.length) {
          return;
        }

        const success = await this._sendToBackend(changes);

        if (success) {
          await db.syncMetadata.put({
            ...metadata,
            lastSyncToken: changes[changes.length - 1].id,
          });
        }
      });
    } catch (error) {
      console.error("Sync failed:", error);
    }
  },

  async _syncWithLock(fn: () => Promise<void>) {
    await navigator.locks.request("SYNC_LOCK", { ifAvailable: false }, fn);
  },

  async _sendToBackend(changes: SyncChange[]) {
    try {
      await sleep(1_000);
      console.log("Simulating server sync...", changes);
      return true;
    } catch (error) {
      console.error("Failed to send changes to backend:", error);
      return false;
    }
  },

  async _getMetadata() {
    let metadata = await db.syncMetadata.get("sync_metadata");

    if (!metadata) {
      metadata = {
        id: "sync_metadata",
        lastSyncToken: 0,
      };
      await db.syncMetadata.put(metadata);
    }

    return metadata;
  },
};
