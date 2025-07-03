import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import db from "../../../lib/db";
import type Task from "../types/Task";
import { getTaskListKey } from "./_keys";

export default function useTaskDelete(
  options?: UseMutationOptions<void, Error, Task>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    async mutationFn(task) {
      await db.remove(task);
    },
    async onSuccess(data, variables, context) {
      // Invalidar todas las queries de listas de tareas para que se refresquen
      await queryClient.invalidateQueries({ queryKey: getTaskListKey() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
