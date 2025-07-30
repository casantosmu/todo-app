import type { Database, Statement } from "better-sqlite3";
import type { SyncChange } from "../schemas/sync.js";

// issue: https://github.com/sindresorhus/camelcase-keys/issues/114
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type SyncLogRow = {
  id: number;
  operation: "INSERT" | "UPDATE" | "DELETE";
  table_name: string;
  record_id: string;
  data: string;
  timestamp: string;
};

export default class SyncLogRepository {
  private readonly insertStmt: Statement<Omit<SyncLogRow, "id">>;

  constructor(private readonly db: Database) {
    this.insertStmt = this.db.prepare(`
      INSERT INTO sync_logs (operation, table_name, record_id, data, timestamp)
      VALUES (:operation, :table_name, :record_id, :data, :timestamp);
    `);
  }

  insert(change: SyncChange) {
    const result = this.insertStmt.run({
      operation: change.operation,
      table_name: change.tableName,
      record_id: change.recordId,
      data: JSON.stringify(change.data),
      timestamp: change.timestamp,
    });

    return result.lastInsertRowid;
  }
}
