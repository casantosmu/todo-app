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
 * Creates an entity and logs a specific sync payload in a single transaction.
 */
export const addWithSync = <T extends { id: string }, TKey extends keyof T>(
  table: EntityTable<T, TKey>,
  dbData: T,
  syncData: Record<string, unknown>,
) => {
  return db.transaction("rw", [table, db.syncLogs], async () => {
    const result = await table.add(dbData);

    await db.syncLogs.add({
      operation: SYNC_OPERATION.INSERT,
      tableName: table.name,
      recordId: dbData.id,
      data: syncData,
      timestamp: new Date(),
    });
    return result;
  });
};

/**
 * Updates an entity and logs a specific sync payload in a single transaction.
 */
export const updateWithSync = <T, TKey extends string, TInsertType>(
  table: Table<T, TKey, TInsertType>,
  key: TKey,
  dbData: UpdateSpec<TInsertType>,
  syncData: UpdateSpec<TInsertType>,
) => {
  return db.transaction("rw", [table, db.syncLogs], async () => {
    const result = await table.update(key, dbData);

    await db.syncLogs.add({
      operation: SYNC_OPERATION.UPDATE,
      tableName: table.name,
      recordId: key,
      data: syncData,
      timestamp: new Date(),
    });
    return result;
  });
};

/**
 * Soft-deletes an entity and logs a specific sync payload in a single transaction.
 */
export const deleteWithSync = <T, TKey extends string, TInsertType>(
  table: Table<T, TKey, TInsertType>,
  key: TKey,
  dbData: UpdateSpec<TInsertType>,
  syncData: UpdateSpec<TInsertType>,
) => {
  return db.transaction("rw", [table, db.syncLogs], async () => {
    const result = await table.update(key, dbData);

    await db.syncLogs.add({
      operation: SYNC_OPERATION.DELETE,
      tableName: table.name,
      recordId: key,
      data: syncData,
      timestamp: new Date(),
    });
    return result;
  });
};
