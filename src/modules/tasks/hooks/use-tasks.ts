import { useQuery } from "@tanstack/react-query";
import { taskService } from "../services/task-service";

export const tasksQueryKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksQueryKeys.all, "list"] as const,
  pending: () => [...tasksQueryKeys.lists(), "pending"] as const,
  completed: () => [...tasksQueryKeys.lists(), "completed"] as const,
} as const;

export function usePendingTasks() {
  return useQuery({
    queryKey: tasksQueryKeys.pending(),
    queryFn: () => taskService.getPendingTasks(),
  });
}

export function useCompletedTasks() {
  return useQuery({
    queryKey: tasksQueryKeys.completed(),
    queryFn: () => taskService.getCompletedTasks(),
  });
}
