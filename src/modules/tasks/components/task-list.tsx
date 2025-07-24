import type { Task } from "../models/task";
import { TaskItem } from "./task-item";

interface TaskListProps {
  tasks: Task[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
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
