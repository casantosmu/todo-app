import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/task-service";

export const tasksQueryKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksQueryKeys.all, "list"] as const,
  pending: () => [...tasksQueryKeys.lists(), "pending"] as const,
  completed: () => [...tasksQueryKeys.lists(), "completed"] as const,
} as const;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => taskService.createTask(title),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.pending(),
      });
    },
  });
};

export const usePendingTasks = () => {
  return useQuery({
    queryKey: tasksQueryKeys.pending(),
    queryFn: () => taskService.getPendingTasks(),
  });
};

export const useCompletedTasks = () => {
  return useQuery({
    queryKey: tasksQueryKeys.completed(),
    queryFn: () => taskService.getCompletedTasks(),
  });
};
