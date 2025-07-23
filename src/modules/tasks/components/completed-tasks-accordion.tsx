import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useCompletedTasks } from "../hooks/use-tasks";
import { TaskItem } from "./task-item";

const taskItemFramerVariants: Variants = {
  initial: {
    opacity: 0,
    y: -20,
    height: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -10,
    transition: {
      type: "tween",
      ease: "easeIn",
      duration: 0.2,
    },
  },
};

export const CompletedTasksAccordion = () => {
  const { data: tasks = [] } = useCompletedTasks();

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
            <AnimatePresence initial={false}>
              {tasks.map((todo) => (
                <motion.li
                  key={todo.id}
                  variants={taskItemFramerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                >
                  <TaskItem task={todo} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
