import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Task } from "../models/task";
import { TaskItem } from "./task-item";

interface CompletedTasksAccordionProps {
  tasks: Task[];
}

export const CompletedTasksAccordion = ({
  tasks,
}: CompletedTasksAccordionProps) => {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="completed-tasks">
        <AccordionTrigger className="text-muted-foreground hover:no-underline">
          {`View ${tasks.length.toString()} completed tasks`}
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-2">
            {tasks.map((todo) => (
              <TaskItem key={todo.id} task={todo} />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
