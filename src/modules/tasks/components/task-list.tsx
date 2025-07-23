import { AnimatePresence, motion, type Variants } from "framer-motion";
import { usePendingTasks } from "../hooks/use-tasks";
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

export const TaskList = () => {
  const { data: tasks = [] } = usePendingTasks();

  if (tasks.length === 0) {
    return null;
  }

  return (
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
  );
};
