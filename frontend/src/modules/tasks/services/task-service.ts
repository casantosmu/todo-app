import { addWithSync, db, deleteWithSync, updateWithSync } from "@/lib/db";
import { omit } from "@/lib/utils";
import Dexie from "dexie";
import {
  DELETED_STATUS,
  TASK_DERIVED_FIELDS,
  TASK_STATUS,
  type Task,
} from "../models/task";

export const taskService = {
  async addTask(title: string) {
    const now = new Date();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      isCompleted: TASK_STATUS.PENDING,
      isDeleted: DELETED_STATUS.NOT_DELETED,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const syncData = omit(newTask, TASK_DERIVED_FIELDS);
    await addWithSync(db.tasks, newTask, syncData);
  },

  getPendingTasks() {
    const { PENDING } = TASK_STATUS;
    const { NOT_DELETED } = DELETED_STATUS;
    return db.tasks
      .where("[isDeleted+isCompleted+createdAt]")
      .between(
        [NOT_DELETED, PENDING, Dexie.minKey],
        [NOT_DELETED, PENDING, Dexie.maxKey],
      )
      .reverse()
      .toArray();
  },

  getCompletedTasks() {
    const { COMPLETED } = TASK_STATUS;
    const { NOT_DELETED } = DELETED_STATUS;
    return db.tasks
      .where("[isDeleted+isCompleted+completedAt]")
      .between(
        [NOT_DELETED, COMPLETED, Dexie.minKey],
        [NOT_DELETED, COMPLETED, Dexie.maxKey],
      )
      .reverse()
      .toArray();
  },

  getTasksByStatus() {
    return db.transaction("r", db.tasks, async () => {
      const [pending, completed] = await Promise.all([
        this.getPendingTasks(),
        this.getCompletedTasks(),
      ]);

      return { pending, completed };
    });
  },

  async toggleTaskStatus(taskId: string, isCompleted: boolean) {
    const now = new Date();

    const dbData: Partial<Task> = {
      isCompleted: isCompleted ? TASK_STATUS.PENDING : TASK_STATUS.COMPLETED,
      completedAt: isCompleted ? null : now,
      updatedAt: now,
    };

    const syncData = omit(dbData, TASK_DERIVED_FIELDS);
    await updateWithSync(db.tasks, taskId, dbData, syncData);
  },

  async deleteTask(taskId: string) {
    const now = new Date();

    const dbData: Partial<Task> = {
      isDeleted: DELETED_STATUS.DELETED,
      deletedAt: now,
      updatedAt: now,
    };

    const syncData = omit(dbData, TASK_DERIVED_FIELDS);
    await deleteWithSync(db.tasks, taskId, dbData, syncData);
  },

  async updateTask(taskId: string, title: string) {
    const dbData: Partial<Task> = {
      title,
      updatedAt: new Date(),
    };

    const syncData = omit(dbData, TASK_DERIVED_FIELDS);
    await updateWithSync(db.tasks, taskId, dbData, syncData);
  },
};
