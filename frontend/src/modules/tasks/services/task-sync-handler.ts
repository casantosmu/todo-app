import { db } from "@/lib/db";
import { eventEmitter } from "@/lib/event-emitter";
import { queryClient } from "@/lib/react-query";
import { TASK_QUERY_KEY } from "../hooks/use-tasks";
import { DELETED_STATUS, TASK_STATUS, type Task } from "../models/task";

interface ApiTask {
  id: string;
  title: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const toTask = (apiTask: ApiTask): Task => {
  return {
    ...apiTask,
    completedAt: apiTask.completedAt ? new Date(apiTask.completedAt) : null,
    createdAt: new Date(apiTask.createdAt),
    updatedAt: new Date(apiTask.updatedAt),
    deletedAt: apiTask.deletedAt ? new Date(apiTask.deletedAt) : null,

    isCompleted: apiTask.completedAt
      ? TASK_STATUS.COMPLETED
      : TASK_STATUS.PENDING,
    isDeleted: apiTask.deletedAt
      ? DELETED_STATUS.DELETED
      : DELETED_STATUS.NOT_DELETED,
  };
};

export const taskSyncHandler = {
  init() {
    eventEmitter.on("sync:pull", async ({ tableName, data }) => {
      if (tableName !== db.tasks.name) {
        return;
      }

      const apiTasks = data as ApiTask[];
      if (apiTasks.length === 0) {
        return;
      }

      const tasks = apiTasks.map(toTask);

      await db.tasks.bulkPut(tasks);
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    });
  },
};
