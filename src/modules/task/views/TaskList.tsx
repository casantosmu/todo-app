import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../../components/Container";
import FloatingButton from "../../../components/FloatingButton";
import Modal from "../../../components/Modal";
import TaskCreate from "../components/TaskCreate";
import TaskSection from "../components/TaskSection";
import useTaskList from "../hooks/useTaskList";
import useTaskUpdate from "../hooks/useTaskUpdate";

export default function TaskList() {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const taskUpdateMutation = useTaskUpdate({
    onError: console.error,
  });

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
    <Container>
      <div className="space-y-8">
        <TaskSection
          title={t("tasksTitle")}
          tasks={pendingTasks}
          onUpdateTask={taskUpdateMutation.mutate}
          isLoading={isLoadingPending}
          isError={isErrorPending}
        />

        <TaskSection
          title={t("completedTitle")}
          tasks={completedTasks}
          onUpdateTask={taskUpdateMutation.mutate}
          isLoading={isLoadingCompleted}
          isError={isErrorCompleted}
          isCompletedList={true}
        />
      </div>

      <FloatingButton onClick={handleOpenModal} aria-label={t("addNewTask")}>
        <Plus className="h-6 w-6" strokeWidth={1.5} />
      </FloatingButton>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="addNewTaskTitle"
      >
        <h2 id="addNewTaskTitle" className="sr-only">
          {t("addNewTask")}
        </h2>
        <TaskCreate />
      </Modal>
    </Container>
  );
}
