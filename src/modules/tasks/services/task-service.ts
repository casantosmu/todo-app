import { db } from "@/lib/db";
import Dexie from "dexie";
import { TASK_STATUS, type Task } from "../models/task";

export const taskService = {
  createTask(title: string) {
    const now = new Date();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      isCompleted: TASK_STATUS.PENDING,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    return db.tasks.add(newTask);
  },

  getPendingTasks() {
    const { PENDING } = TASK_STATUS;
    return db.tasks
      .where("[isCompleted+createdAt]")
      .between([PENDING, Dexie.minKey], [PENDING, Dexie.maxKey])
      .reverse()
      .toArray();
  },

  getCompletedTasks() {
    const { COMPLETED } = TASK_STATUS;
    return db.tasks
      .where("[isCompleted+completedAt]")
      .between([COMPLETED, Dexie.minKey], [COMPLETED, Dexie.maxKey])
      .reverse()
      .toArray();
  },
};
