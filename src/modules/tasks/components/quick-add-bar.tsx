import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const QuickAddBar = ({
  className,
  ...props
}: React.ComponentProps<typeof Input>) => {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Plus
        className="text-muted-foreground absolute left-3 h-4 w-4"
        aria-hidden="true"
      />
      <Input placeholder="Add a new task..." className="pl-9" {...props} />
    </div>
  );
};
