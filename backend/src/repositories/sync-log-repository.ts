import type { Database, Statement } from "better-sqlite3";
import type { SyncChange } from "../schemas/sync.js";

export default class SyncLogRepository {
  private readonly insertStmt: Statement;

  constructor(private readonly db: Database) {
    this.insertStmt = this.db.prepare(`
      INSERT INTO sync_logs (operation, table_name, record_id, data, timestamp)
      VALUES (?, ?, ?, ?, ?);
    `);
  }

  insert(change: SyncChange) {
    const result = this.insertStmt.run([
      change.operation,
      change.tableName,
      change.recordId,
      JSON.stringify(change.data),
      change.timestamp,
    ]);

    return result.lastInsertRowid as number;
  }
}
