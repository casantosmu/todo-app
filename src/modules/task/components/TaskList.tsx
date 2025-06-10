import { useTranslation } from "react-i18next";
import useTaskList from "../hooks/useTaskList";
import TaskSection from "./TaskSection";

export default function TaskList() {
  const { t } = useTranslation();

  const {
    data: pendingTasks,
    isLoading: isLoadingPending,
    isError: isErrorPending,
  } = useTaskList({ params: { status: "pending" } });

  const {
    data: completedTasks,
    isLoading: isLoadingCompleted,
    isError: isErrorCompleted,
  } = useTaskList({ params: { status: "completed" } });

  return (
    <div className="space-y-8">
      <TaskSection
        title={t("tasksTitle")}
        tasks={pendingTasks}
        isLoading={isLoadingPending}
        isError={isErrorPending}
      />

      <TaskSection
        title={t("completedTitle")}
        tasks={completedTasks}
        isLoading={isLoadingCompleted}
        isError={isErrorCompleted}
        isCompletedList={true}
      />
    </div>
  );
}
