import { getConfig } from "@/lib/config";
import { db, withAllTables } from "@/lib/db";
import { eventEmitter } from "@/lib/event-emitter";
import type { SyncRequest } from "../models/sync-request";
import type { SyncResponse } from "../models/sync-response";
import { authService } from "./auth-service";
import { syncMetadataService } from "./sync-metadata-service";

export const syncService = {
  async sync() {
    try {
      // TODO: Sync with lock
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

      const config = await getConfig();

      const session = authService.getSession();
      if (!session?.token) {
        throw new Error("User not authenticated, cannot sync.");
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      };

      const response = await fetch(`${config.syncServiceUrl}/sync`, {
        method: "POST",
        headers,
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

      const newTimestamp = resBody.nextTimestamp;

      syncMetadataService.set({
        lastTimestamp: newTimestamp,
      });
      await eventEmitter.emit("sync:status-change", {
        status: "synced",
        lastTimestamp: newTimestamp,
      });
    } catch (error) {
      console.error("Sync failed:", error);
      await eventEmitter.emit("sync:status-change", { status: "error" });
    }
  },
};
