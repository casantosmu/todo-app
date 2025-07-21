import { db } from "@/lib/db";
import Dexie from "dexie";
import { TASK_STATUS } from "../models/task";

export const taskService = {
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
