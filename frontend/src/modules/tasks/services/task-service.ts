import { db, withSync } from "@/lib/db";
import Dexie from "dexie";
import { DELETED_STATUS, TASK_STATUS, type Task } from "../models/task";

export const taskService = {
  async addTask(data: Pick<Task, "title">) {
    const now = new Date();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      isCompleted: TASK_STATUS.PENDING,
      isDeleted: DELETED_STATUS.NOT_DELETED,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    await withSync(db.tasks, newTask);
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

  async toggleTaskStatus(task: Task) {
    const now = new Date();
    const isCompleted = task.isCompleted;

    await withSync(db.tasks, {
      ...task,
      isCompleted: isCompleted ? TASK_STATUS.PENDING : TASK_STATUS.COMPLETED,
      completedAt: isCompleted ? null : now,
      updatedAt: now,
    });
  },

  async deleteTask(task: Task) {
    const now = new Date();

    await withSync(db.tasks, {
      ...task,
      isDeleted: DELETED_STATUS.DELETED,
      deletedAt: now,
      updatedAt: now,
    });
  },

  async updateTask(task: Task) {
    await withSync(db.tasks, {
      ...task,
      updatedAt: new Date(),
    });
  },
};
