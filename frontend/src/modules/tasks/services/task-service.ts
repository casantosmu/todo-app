import { addWithSync, db, deleteWithSync, updateWithSync } from "@/lib/db";
import Dexie from "dexie";
import { DELETED_STATUS, TASK_STATUS, type Task } from "../models/task";

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

    await addWithSync(db.tasks, newTask);
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

    await updateWithSync(db.tasks, taskId, {
      isCompleted: isCompleted ? TASK_STATUS.PENDING : TASK_STATUS.COMPLETED,
      completedAt: isCompleted ? null : now,
      updatedAt: now,
    });
  },

  async deleteTask(taskId: string) {
    const now = new Date();

    await deleteWithSync(db.tasks, taskId, {
      isDeleted: DELETED_STATUS.DELETED,
      deletedAt: now,
      updatedAt: now,
    });
  },

  async updateTask(taskId: string, title: string) {
    await updateWithSync(db.tasks, taskId, {
      title,
      updatedAt: new Date(),
    });
  },
};
