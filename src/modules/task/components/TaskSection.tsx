import { useTranslation } from "react-i18next";
import useTaskList from "../hooks/useTaskList";
import TaskItem from "./TaskItem";

interface TaskSectionProps {
  isCompleted?: boolean;
}

export default function TaskSection({ isCompleted = false }: TaskSectionProps) {
  const { t } = useTranslation();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useTaskList({
    params: {
      status: isCompleted ? "completed" : "pending",
    },
  });

  const heading = isCompleted ? t("completedTitle") : t("tasksTitle");

  const headingId = isCompleted
    ? "completed-tasks-heading"
    : "pending-tasks-heading";

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-gray-500">Loading...</p>;
    }
    if (isError) {
      return <p className="text-red-500">Error...</p>;
    }
    if (!tasks || tasks.length === 0) {
      return <p className="text-gray-500">Empty...</p>;
    }
    return (
      <ul className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-semibold text-gray-800 mb-4">
        {heading}
      </h2>
      {renderContent()}
    </section>
  );
}
