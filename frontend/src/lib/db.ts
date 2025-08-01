import { type SyncChange } from "@/modules/sync/models/sync-change";
import type { SyncMetadata } from "@/modules/sync/models/sync-metadata";
import { type Task } from "@/modules/tasks/models/task";
import Dexie, { type EntityTable } from "dexie";

export const db = new Dexie("todoapp_db") as Dexie & {
  tasks: EntityTable<Task, "id">;
  syncLogs: EntityTable<SyncChange, "id">;
  syncMetadata: EntityTable<SyncMetadata, "id">;
};

db.version(1).stores({
  tasks:
    "id, [isDeleted+isCompleted+createdAt], [isDeleted+isCompleted+completedAt]",
  syncLogs: "++id, timestamp",
  syncMetadata: "id",
});

export const dbAllTables = [db.tasks, db.syncLogs, db.syncMetadata];

// await db.delete();

/**
 * Creates/updates an entity and logs the operation in a single transaction.
 */
export const withSync = <T extends { id: string }, TKey extends keyof T>(
  table: EntityTable<T, TKey>,
  data: T,
) => {
  return db.transaction("rw", [table, db.syncLogs], async () => {
    const result = await table.put(data);

    await db.syncLogs.add({
      tableName: table.name,
      data,
      timestamp: new Date().toISOString(),
    });

    return result;
  });
};
