import type { Database } from "better-sqlite3";
import type SyncTaskHandler from "../handlers/sync-task-handler.js";
import type SyncLogRepository from "../repositories/sync-log-repository.js";
import type { SyncChange, SyncRequest } from "../schemas/sync.js";

export default class SyncService {
  constructor(
    private readonly db: Database,
    private readonly syncLogRepo: SyncLogRepository,
    private readonly taskHandler: SyncTaskHandler,
  ) {}

  sync(request: SyncRequest) {
    const transaction = this.db.transaction(() => {
      let newSyncToken = 0;

      for (const change of request.changes) {
        newSyncToken = this.syncLogRepo.insert(change);
        this.handleChange(change);
      }

      return { newSyncToken };
    });

    return transaction();
  }

  private handleChange(change: SyncChange) {
    switch (change.tableName) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      case "tasks":
        this.taskHandler.handleChange(change);
        break;
      default:
        break;
    }
  }
}
