import { db } from "@/lib/db";
import { eventEmitter } from "@/lib/event-emitter";

export const syncPushHandler = {
  init() {
    eventEmitter.on("sync:push", async ({ tableName, data }) => {
      if (data.length === 0) {
        return;
      }

      const timestamp = new Date().toISOString();
      const syncLogs = data.map((data) => ({ tableName, data, timestamp }));

      await db.syncLogs.bulkAdd(syncLogs);
    });
  },
};
