import { db } from "@/lib/db";
import { TASK_STATUS } from "../models/task";

export const taskService = {
  getPendingTasks() {
    return db.tasks
      .where("isCompleted")
      .equals(TASK_STATUS.PENDING)
      .reverse()
      .sortBy("createdAt");
  },
  getCompletedTasks() {
    return db.tasks
      .where("isCompleted")
      .equals(TASK_STATUS.COMPLETED)
      .reverse()
      .sortBy("completedAt");
  },
};
