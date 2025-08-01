import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { useAddTask } from "../hooks/use-tasks";

export const QuickAddBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useAddTask();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = inputRef.current?.value.trim();

    if (!title) {
      return;
    }

    const data = { title };

    mutate(data, {
      onSuccess: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.focus();
        }
      },
    });
  };

  return (
    <form className="relative flex items-center" onSubmit={handleSubmit}>
      <Plus
        className="text-muted-foreground absolute left-3 h-4 w-4"
        aria-hidden="true"
      />
      <Input ref={inputRef} placeholder="Add a new task..." className="pl-9" />
    </form>
  );
};
