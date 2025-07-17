import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Todo } from "../types";
import { TaskItem } from "./task-item";

interface CompletedTasksAccordionProps {
  todos: Todo[];
}

export const CompletedTasksAccordion = ({
  todos,
}: CompletedTasksAccordionProps) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="completed-tasks">
        <AccordionTrigger className="text-muted-foreground hover:no-underline">
          {`View ${todos.length.toString()} completed tasks`}
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <TaskItem key={todo._id} todo={todo} />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
