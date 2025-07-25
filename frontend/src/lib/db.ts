import {
  SYNC_OPERATION,
  type SyncChange,
} from "@/modules/sync/models/sync-change";
import type { SyncMetadata } from "@/modules/sync/models/sync-metadata";
import { type Task } from "@/modules/tasks/models/task";
import Dexie, { type EntityTable, type Table, type UpdateSpec } from "dexie";

export const db = new Dexie("todoapp_db") as Dexie & {
  tasks: EntityTable<Task, "id">;
  syncLogs: EntityTable<SyncChange, "id">;
  syncMetadata: EntityTable<SyncMetadata, "id">;
};

db.version(1).stores({
  tasks:
    "id, [isDeleted+isCompleted+createdAt], [isDeleted+isCompleted+completedAt]",
  syncLogs: "++id",
  syncMetadata: "id",
});

// await db.delete();

/**
 * Creates an entity and logs the operation in a single transaction.
 */
export const addWithSync = <T extends { id: string }, TKey extends keyof T>(
  table: EntityTable<T, TKey>,
  value: T,
) => {
  return db.transaction("rw", [table, db.syncLogs], async () => {
    const result = await table.add(value);

    await db.syncLogs.add({
      operation: SYNC_OPERATION.CREATE,
      entityName: table.name,
      entityId: value.id,
      value,
      timestamp: new Date(),
    });
    return result;
  });
};

/**
 * Updates an entity and logs the operation in a single transaction.
 */
export const updateWithSync = <T, TKey extends string, TInsertType>(
  table: Table<T, TKey, TInsertType>,
  key: TKey,
  value: UpdateSpec<TInsertType>,
) => {
  return db.transaction("rw", [table, db.syncLogs], async () => {
    const result = await table.update(key, value);

    await db.syncLogs.add({
      operation: SYNC_OPERATION.UPDATE,
      entityName: table.name,
      entityId: key,
      value,
      timestamp: new Date(),
    });
    return result;
  });
};

/**
 * Soft-deletes an entity by updating it and logs the operation in a single transaction.
 */
export const deleteWithSync = <T, TKey extends string, TInsertType>(
  table: Table<T, TKey, TInsertType>,
  key: TKey,
  value: UpdateSpec<TInsertType>,
) => {
  return db.transaction("rw", [table, db.syncLogs], async () => {
    const result = await table.update(key, value);

    await db.syncLogs.add({
      operation: SYNC_OPERATION.DELETE,
      entityName: table.name,
      entityId: key,
      value,
      timestamp: new Date(),
    });
    return result;
  });
};
