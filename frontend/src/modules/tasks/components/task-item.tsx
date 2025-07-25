import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import {
  useDeleteTask,
  useToggleTaskStatus,
  useUpdateTask,
} from "../hooks/use-tasks";
import type { Task } from "../models/task";

const taskItemVariants = cva(
  "group flex items-center gap-3 rounded-md p-2 transition-colors duration-150",
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

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: toggleStatus } = useToggleTaskStatus();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutateAsync: updateTask } = useUpdateTask();

  const handleSave = async () => {
    const title = inputRef.current?.value.trim();
    if (title && title !== task.title) {
      await updateTask({ taskId: task.id, title });
    }
    setIsEditing(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSave();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      formRef.current?.reset();
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        taskItemVariants({ completed: !!task.completedAt }),
        isEditing ? "bg-muted" : "hover:bg-muted",
      )}
    >
      <Checkbox
        checked={!!task.completedAt}
        onCheckedChange={() => {
          toggleStatus(task);
        }}
        aria-label={`Mark task "${task.title}" as ${
          task.completedAt ? "incomplete" : "complete"
        }`}
        className="h-5 w-5"
      />

      {isEditing ? (
        <form
          ref={formRef}
          className="grow"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <input
            ref={inputRef}
            defaultValue={task.title}
            onKeyDown={handleKeyDown}
            type="text"
            className="selection:bg-primary selection:text-primary-foreground w-full bg-transparent focus-visible:outline-none"
            onBlur={() => {
              void handleSave();
            }}
            autoFocus
            autoComplete="off"
          />
        </form>
      ) : (
        <>
          <button
            type="button"
            aria-label={`Edit task "${task.title}"`}
            className="grow truncate text-left"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            {task.title}
          </button>
          <div className="flex items-center">
            <button
              type="button"
              aria-label={`Delete task "${task.title}"`}
              className="text-muted-foreground hover:text-destructive opacity-0 transition-all duration-150 group-hover:opacity-100"
              onClick={() => {
                deleteTask(task.id);
              }}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
