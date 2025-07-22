import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCompletedTasks } from "../hooks/use-tasks";
import { TaskItem } from "./task-item";

export const CompletedTasksAccordion = () => {
  const { data: tasks = [], isLoading } = useCompletedTasks();

  if (tasks.length === 0 || isLoading) {
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
