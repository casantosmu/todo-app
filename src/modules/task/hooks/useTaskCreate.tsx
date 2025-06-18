import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import db from "../../../lib/db";
import shortId from "../../../lib/shortId";
import type Task from "./../types/Task";
import type TaskCreate from "./../types/TaskCreate";
import { getTaskListKey } from "./_keys";

export default function useTaskCreate(
  options?: UseMutationOptions<void, Error, TaskCreate>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    async mutationFn(body) {
      const task: Task = {
        _id: shortId("task"),
        type: "task",
        title: body.title,
        createdAt: new Date(),
        completedAt: null,
      };

      await db.put(task);
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: getTaskListKey() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
