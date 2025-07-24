import { db } from "@/lib/db";
import Dexie from "dexie";
import { DELETED_STATUS, TASK_STATUS, type Task } from "../models/task";

export const taskService = {
  createTask(title: string) {
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
    return db.tasks.add(newTask);
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

  async toggleTaskStatus(taskId: string) {
    await db.transaction("rw", db.tasks, async () => {
      const task = await db.tasks.get(taskId);
      if (!task) {
        return;
      }

      const now = new Date();
      const isCompleted = task.isCompleted === TASK_STATUS.COMPLETED;
      await db.tasks.update(taskId, {
        isCompleted: isCompleted ? TASK_STATUS.PENDING : TASK_STATUS.COMPLETED,
        completedAt: isCompleted ? null : now,
        updatedAt: now,
      });
    });
  },

  async deleteTask(taskId: string) {
    await db.tasks.update(taskId, {
      isDeleted: DELETED_STATUS.DELETED,
      deletedAt: new Date(),
    });
  },
};
