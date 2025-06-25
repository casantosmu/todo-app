import type { UseMutationOptions } from "@tanstack/react-query";
import type Task from "../types/Task";
import useTaskUpdate from "./useTaskUpdate";

export default function useTaskToggleCompletion(
  options?: UseMutationOptions<Task, Error, Task>
) {
  const taskUpdateMutation = useTaskUpdate(options);

  const toggleCompletion = (task: Task) => {
    const toggledTask: Task = {
      ...task,
      completedAt: task.completedAt ? null : new Date(),
    };

    taskUpdateMutation.mutate(toggledTask);
  };

  return { toggleCompletion };
}
