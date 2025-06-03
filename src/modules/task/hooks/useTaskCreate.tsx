import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { v7 as uuid } from "uuid";
import db from "../../../lib/db";
import type Task from "./../types/Task";
import type TaskCreate from "./../types/TaskCreate";
import { getTaskListKey } from "./_keys";

export default function useTaskCreate(
  options?: UseMutationOptions<Task, Error, TaskCreate>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    async mutationFn(body) {
      const task = {
        ...body,
        _id: uuid(),
        type: "task",
      };
      await db.put(task);
      return task;
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: getTaskListKey() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
