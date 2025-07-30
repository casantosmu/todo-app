import type { Database } from "better-sqlite3";
import type { FastifyBaseLogger } from "fastify";
import type SyncTaskHandler from "../handlers/sync-task-handler.js";
import type SyncLogRepository from "../repositories/sync-log-repository.js";
import type { SyncChange, SyncRequest } from "../schemas/sync.js";

export default class SyncService {
  constructor(
    private readonly log: FastifyBaseLogger,
    private readonly db: Database,
    private readonly syncLogRepo: SyncLogRepository,
    private readonly taskHandler: SyncTaskHandler,
  ) {}

  sync(request: SyncRequest) {
    this.log.info(
      {
        lastSyncToken: request.lastSyncToken,
        changesCount: request.changes.length,
      },
      "Processing sync request",
    );

    const transaction = this.db.transaction(() => {
      let newSyncToken: number | bigint = 0;

      for (const change of request.changes) {
        this.log.debug(
          {
            operation: change.operation,
            tableName: change.tableName,
            recordId: change.recordId,
          },
          "Processing change",
        );

        newSyncToken = this.syncLogRepo.insert(change);
        this.handleChange(change);
      }

      this.log.info(
        {
          newSyncToken,
          processedChanges: request.changes.length,
        },
        "Sync completed successfully",
      );

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
        this.log.warn(
          {
            tableName: change.tableName,
          },
          "Unknown table in sync change",
        );
        break;
    }
  }
}
