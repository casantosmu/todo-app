import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Trash2 } from "lucide-react";
import type { Todo } from "../types";

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
  todo: Todo;
  isEditing: boolean;
}

export const TaskItem = ({
  ref,
  todo,
  isEditing,
  className,
  ...props
}: TaskItemProps) => {
  return (
    <li
      ref={ref}
      className={cn(
        taskItemVariants({ completed: !!todo.completedAt }),
        isEditing && "bg-muted",
        className,
      )}
      {...props}
    >
      <Checkbox
        checked={!!todo.completedAt}
        aria-label={`Mark task "${todo.title}" as ${
          todo.completedAt ? "incomplete" : "complete"
        }`}
        className="h-5 w-5"
      />

      {isEditing ? (
        <input
          type="text"
          className="selection:bg-primary selection:text-primary-foreground w-full focus-visible:outline-none"
          defaultValue={todo.title}
          autoFocus
          autoComplete="off"
        />
      ) : (
        <>
          <span className="grow truncate">{todo.title}</span>
          <div className="flex items-center">
            <button
              type="button"
              aria-label={`Delete task "${todo.title}"`}
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
