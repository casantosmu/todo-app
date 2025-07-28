import { getConfig } from "@/config";
import { db } from "@/lib/db";
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

        const success = await this._sendToBackend(
          metadata.lastSyncToken,
          changes,
        );

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

  async _sendToBackend(lastSyncToken: number, changes: SyncChange[]) {
    try {
      const baseUrl = (await getConfig()).syncServiceUrl;
      const response = await fetch(`${baseUrl}/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lastSyncToken, changes }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.statusText}`);
      }

      console.log("_sendToBackend", {
        body: { changes },
        response: (await response.json()) as unknown,
      });

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
