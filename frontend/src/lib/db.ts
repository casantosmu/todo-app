import { type SyncChange } from "@/modules/sync/models/sync-change";
import type { SyncMetadata } from "@/modules/sync/models/sync-metadata";
import { type Task } from "@/modules/tasks/models/task";
import Dexie, { type EntityTable, type Table } from "dexie";

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

export const withAllTables = () => [db.tasks, db.syncLogs, db.syncMetadata];
export const withSyncTables = (...tables: Table[]) => [...tables, db.syncLogs];

// await db.delete();
