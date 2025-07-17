import { CheckCircle2 } from "lucide-react";
import type { Todo } from "../types";
import { TaskItem } from "./task-item";

interface TaskListProps {
  todos: Todo[];
}

export const TaskList = ({ todos }: TaskListProps) => {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <CheckCircle2 className="text-muted-foreground h-12 w-12" />
        <div>
          <h2 className="text-lg font-semibold">All clear</h2>
          <p className="text-muted-foreground">
            Everything is taken care of. Great job!
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TaskItem key={todo._id} todo={todo} />
      ))}
    </ul>
  );
};
