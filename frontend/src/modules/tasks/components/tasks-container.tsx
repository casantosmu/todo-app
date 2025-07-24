import { useTasksByStatus } from "../hooks/use-tasks";
import { CompletedTasksAccordion } from "./completed-tasks-accordion";
import { TaskList } from "./task-list";

export const TasksContainer = () => {
  const { data } = useTasksByStatus();

  const pendingTasks = data?.pending ?? [];
  const completedTasks = data?.completed ?? [];

  return (
    <>
      <section>
        <TaskList tasks={pendingTasks} />
      </section>
      <section className="mt-4">
        <CompletedTasksAccordion tasks={completedTasks} />
      </section>
    </>
  );
};
