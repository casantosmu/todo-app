import { usePendingTasks } from "../hooks/use-tasks";
import { TaskItem } from "./task-item";

export const TaskList = () => {
  const { data: tasks = [] } = usePendingTasks();

  if (tasks.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((todo) => (
        <li key={todo.id}>
          <TaskItem task={todo} />
        </li>
      ))}
    </ul>
  );
};
