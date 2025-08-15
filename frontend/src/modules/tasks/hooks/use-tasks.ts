import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../models/task";
import { taskService } from "../services/task-service";

export const TASK_QUERY_KEY = ["tasks"] as const;

export const useTasksByStatus = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEY,
    queryFn: () => taskService.getTasksByStatus(),
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Pick<Task, "title">) => taskService.addTask(data),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
    onError: (error: unknown, data: Pick<Task, "title">) => {
      console.error("Error adding task:", error, "Data:", data);
    },
  });
};

export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) => taskService.toggleTaskStatus(task),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
    onError: (error: unknown, task: Task) => {
      console.error(`Error toggling task status for ${task.id}:`, error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) => taskService.deleteTask(task),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
    onError: (error: unknown, task: Task) => {
      console.error(`Error deleting task ${task.id}:`, error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) => taskService.updateTask(task),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
    onError: (error: unknown, task: Task) => {
      console.error(`Error updating task ${task.id}:`, error);
    },
  });
};
