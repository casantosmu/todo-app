import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Trash2 } from "lucide-react";
import type { Task } from "../models/task";

const taskItemVariants = cva(
  "group flex items-center gap-3 rounded-md p-2 transition-colors duration-150 hover:bg-muted",
  {
    variants: {
      completed: {
        true: "text-muted-foreground line-through",
        false: "text-foreground",
      },
    },
    defaultVariants: {
      completed: false,
    },
  },
);

interface TaskItemProps
  extends React.LiHTMLAttributes<HTMLLIElement>,
    React.RefAttributes<HTMLLIElement> {
  task: Task;
  isEditing?: boolean;
}

export const TaskItem = ({
  ref,
  task,
  isEditing = false,
  className,
  ...props
}: TaskItemProps) => {
  return (
    <li
      ref={ref}
      className={cn(
        taskItemVariants({ completed: !!task.completedAt }),
        isEditing && "bg-muted",
        className,
      )}
      {...props}
    >
      <Checkbox
        checked={!!task.completedAt}
        aria-label={`Mark task "${task.title}" as ${
          task.completedAt ? "incomplete" : "complete"
        }`}
        className="h-5 w-5"
      />

      {isEditing ? (
        <input
          type="text"
          className="selection:bg-primary selection:text-primary-foreground w-full focus-visible:outline-none"
          defaultValue={task.title}
          autoFocus
          autoComplete="off"
        />
      ) : (
        <>
          <span className="grow truncate">{task.title}</span>
          <div className="flex items-center">
            <button
              type="button"
              aria-label={`Delete task "${task.title}"`}
              className="text-muted-foreground hover:text-destructive opacity-0 transition-all duration-150 group-hover:opacity-100"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </li>
  );
};
