import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../models/task";
import { taskService } from "../services/task-service";

const TASK_QUERY_KEY = ["tasks"] as const;

export const useTasksByStatus = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEY,
    queryFn: () => taskService.getTasksByStatus(),
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => taskService.addTask(title),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
  });
};

export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) =>
      taskService.toggleTaskStatus(task.id, !!task.completedAt),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      taskService.updateTask(taskId, title),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
  });
};
