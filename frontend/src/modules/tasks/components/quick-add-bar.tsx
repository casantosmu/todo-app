import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { useAddTask } from "../hooks/use-tasks";

export const QuickAddBar = ({
  className,
  ...props
}: React.ComponentProps<typeof Input>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useAddTask();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = inputRef.current?.value.trim();

    if (!title) {
      return;
    }

    mutate(title, {
      onSuccess: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.focus();
        }
      },
    });
  };

  return (
    <form
      className={cn("relative flex items-center", className)}
      onSubmit={handleSubmit}
    >
      <Plus
        className="text-muted-foreground absolute left-3 h-4 w-4"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        placeholder="Add a new task..."
        className="pl-9"
        {...props}
      />
    </form>
  );
};
