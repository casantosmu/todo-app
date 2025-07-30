import type { FastifyBaseLogger } from "fastify";
import type TaskRepository from "../repositories/task-repository.js";
import type {
  SyncTaskDelete,
  SyncTaskInsert,
  SyncTaskUpdate,
} from "../schemas/sync-task.js";
import type { SyncChange } from "../schemas/sync.js";

export default class SyncTaskHandler {
  constructor(
    private readonly log: FastifyBaseLogger,
    private readonly taskRepo: TaskRepository,
  ) {}

  handleChange(change: SyncChange) {
    const { operation, recordId, data } = change;

    switch (operation) {
      case "INSERT":
        this.handleInsert(recordId, data);
        break;
      case "UPDATE":
        this.handleUpdate(recordId, data);
        break;
      case "DELETE":
        this.handleDelete(recordId, data);
        break;
    }
  }

  private handleInsert(recordId: string, data: SyncTaskInsert["data"]) {
    if (this.taskRepo.getById(recordId)) {
      this.log.warn({ recordId }, "INSERT ignored: Task already exists");
      return;
    }

    this.taskRepo.insert(data);
  }

  private handleUpdate(recordId: string, data: SyncTaskUpdate["data"]) {
    const existing = this.taskRepo.getById(recordId);
    if (!existing) {
      this.log.warn({ recordId }, "UPDATE ignored: Task not found");
      return;
    }

    if (this.shouldIgnoreChange(existing.updatedAt, data.updatedAt)) {
      this.log.warn({ recordId }, "UPDATE ignored: Incoming task is older");
      return;
    }

    this.taskRepo.update(recordId, data);
  }

  private handleDelete(recordId: string, data: SyncTaskDelete["data"]) {
    const existing = this.taskRepo.getById(recordId);
    if (!existing) {
      this.log.warn({ recordId }, "DELETE ignored: Task not found");
      return;
    }

    if (this.shouldIgnoreChange(existing.updatedAt, data.updatedAt)) {
      this.log.warn({ recordId }, "DELETE ignored: Incoming task is older");
      return;
    }

    this.taskRepo.softDelete(recordId, data.deletedAt, data.updatedAt);
  }

  private shouldIgnoreChange(
    existingTimestamp: string,
    incomingTimestamp: string,
  ) {
    const existingTime = new Date(existingTimestamp).getTime();
    const incomingTime = new Date(incomingTimestamp).getTime();

    return incomingTime < existingTime;
  }
}
