import { useTranslation } from "react-i18next";
import useTaskList from "../hooks/useTaskList";
import type Task from "../types/Task";
import TaskItem from "./TaskItem";

interface CompletedTaskListProps {
  onEditTask: (task: Task) => void;
}

export default function CompletedTaskList({
  onEditTask,
}: CompletedTaskListProps) {
  const { t } = useTranslation();

  const {
    data: completedTasks,
    isLoading,
    isError,
  } = useTaskList({
    params: {
      status: "completed",
    },
  });

  const headingId = "completed-tasks-heading";
  const isEmpty = !completedTasks || completedTasks.length === 0;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-semibold text-gray-800 mb-4">
        {t("completedTitle")}
      </h2>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {isError && <p className="text-red-500">Error...</p>}

      {!isLoading && !isError && isEmpty && (
        <p className="text-gray-500">Empty completed...</p>
      )}

      {!isLoading && !isError && !isEmpty && (
        <ul className="space-y-3">
          {completedTasks.map((task) => (
            <TaskItem key={task._id} task={task} onEdit={onEditTask} />
          ))}
        </ul>
      )}
    </section>
  );
}
