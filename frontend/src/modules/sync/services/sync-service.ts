import { getConfig } from "@/lib/config";
import { db, dbAllTables } from "@/lib/db";
import { eventEmitter } from "@/lib/event-emitter";

type SyncChanges = Record<string, Record<string, unknown>[]>;

interface SyncResponseBody {
  nextTimestamp: string;
  changes: SyncChanges;
}

export const syncService = {
  async sync() {
    try {
      await this._syncWithLock(async () => {
        const metadata = await this._getMetadata();
        const syncLogs = await db.syncLogs
          .where("timestamp")
          .above(metadata.lastTimestamp)
          .toArray();

        const changes: SyncChanges = {};
        for (const syncLog of syncLogs) {
          changes[syncLog.tableName] ??= [];
          changes[syncLog.tableName].push(syncLog.data);
        }

        const baseUrl = (await getConfig()).syncServiceUrl;
        const response = await fetch(`${baseUrl}/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastTimestamp: metadata.lastTimestamp,
            changes,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.statusText}`);
        }

        const body = (await response.json()) as SyncResponseBody;

        await db.transaction("rw", dbAllTables, async () => {
          for (const [tableName, data] of Object.entries(body.changes)) {
            if (data.length > 0) {
              await eventEmitter.emit("sync:pull", { tableName, data });
            }
          }

          await db.syncMetadata.put({
            ...metadata,
            lastTimestamp: body.nextTimestamp,
          });
        });
      });
    } catch (error) {
      console.error("Sync failed:", error);
    }
  },

  async _syncWithLock(fn: () => Promise<void>) {
    await navigator.locks.request("SYNC_LOCK", { ifAvailable: false }, fn);
  },

  async _getMetadata() {
    let metadata = await db.syncMetadata.get("sync_metadata");

    if (!metadata) {
      metadata = {
        id: "sync_metadata",
        lastTimestamp: new Date(0).toISOString(),
      };
      await db.syncMetadata.put(metadata);
    }

    return metadata;
  },
};
