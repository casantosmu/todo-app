import { getConfig } from "@/lib/config";
import { db, withAllTables } from "@/lib/db";
import { eventEmitter } from "@/lib/event-emitter";
import type { SyncRequest } from "../models/sync-request";
import type { SyncResponse } from "../models/sync-response";
import { syncMetadataService } from "./sync-metadata-service";

export const syncService = {
  async sync() {
    try {
      await this._syncWithLock(async () => {
        const metadata = syncMetadataService.get();
        const syncLogs = await db.syncLogs
          .where("timestamp")
          .above(metadata.lastTimestamp)
          .toArray();

        const reqBody: SyncRequest = {
          lastTimestamp: metadata.lastTimestamp,
          changes: {},
        };

        for (const syncLog of syncLogs) {
          reqBody.changes[syncLog.tableName] ??= [];
          reqBody.changes[syncLog.tableName].push(syncLog.data);
        }

        const baseUrl = (await getConfig()).syncServiceUrl;
        const response = await fetch(`${baseUrl}/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.statusText}`);
        }

        const resBody = (await response.json()) as SyncResponse;

        await db.transaction("rw", withAllTables(), async () => {
          for (const [tableName, data] of Object.entries(resBody.changes)) {
            if (data.length > 0) {
              await eventEmitter.emit("sync:pull", { tableName, data });
            }
          }
        });

        syncMetadataService.set({
          ...metadata,
          lastTimestamp: resBody.nextTimestamp,
        });
      });
    } catch (error) {
      console.error("Sync failed:", error);
    }
  },

  async _syncWithLock(fn: () => Promise<void>) {
    await navigator.locks.request("SYNC_LOCK", { ifAvailable: false }, fn);
  },
};
