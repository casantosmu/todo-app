import { useTranslation } from "react-i18next";
import useTaskList from "../hooks/useTaskList";
import type Task from "../types/Task";
import TaskItem from "./TaskItem";

interface PendingTaskListProps {
  onEditTask: (task: Task) => void;
}

export default function PendingTaskList({ onEditTask }: PendingTaskListProps) {
  const { t } = useTranslation();

  const {
    data: pendingTasks,
    isLoading,
    isError,
  } = useTaskList({
    params: {
      status: "pending",
    },
  });

  const headingId = "pending-tasks-heading";
  const isEmpty = !pendingTasks || pendingTasks.length === 0;

  return (
    // La lógica de <section> ahora vive directamente aquí
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-semibold text-gray-800 mb-4">
        {t("tasksTitle")}
      </h2>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {isError && <p className="text-red-500">Error...</p>}

      {!isLoading && !isError && isEmpty && (
        <p className="text-gray-500">Empty pending...</p>
      )}

      {!isLoading && !isError && !isEmpty && (
        <ul className="space-y-3">
          {pendingTasks.map((task) => (
            <TaskItem key={task._id} task={task} onEdit={onEditTask} />
          ))}
        </ul>
      )}
    </section>
  );
}
