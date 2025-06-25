import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../../components/Container";
import FloatingButton from "../../../components/FloatingButton";
import Modal from "../../../components/Modal";
import TaskCreate from "../components/TaskCreate";
import TaskEditModal from "../components/TaskEditModal";
import TaskItem from "../components/TaskItem";
import useTaskList from "../hooks/useTaskList";
import type Task from "../types/Task";

export default function TaskList() {
  const { t } = useTranslation();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: completedTasks,
    isLoading: completedIsLoading,
    isError: completedIsError,
  } = useTaskList({
    params: {
      status: "completed",
    },
  });

  const {
    data: pendingTasks,
    isLoading: pendingIsLoading,
    isError: pendingIsError,
  } = useTaskList({
    params: {
      status: "pending",
    },
  });

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
  };
  const handleCloseEditModal = () => {
    setEditingTask(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setEditingTask(updatedTask);
  };

  return (
    <Container>
      <div className="space-y-8">
        <section aria-labelledby="pending-tasks-heading">
          <h2
            id="pending-tasks-heading"
            className="text-xl font-semibold text-gray-800 mb-4"
          >
            {t("tasksTitle")}
          </h2>
          {pendingIsLoading && <p className="text-gray-500">Loading...</p>}
          {pendingIsError && <p className="text-red-500">Error...</p>}
          {!pendingTasks || pendingTasks.length === 0 ? (
            <p className="text-gray-500">Empty...</p>
          ) : (
            <ul className="space-y-3">
              {pendingTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEditModal}
                />
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="completed-tasks-heading">
          <h2
            id="completed-tasks-heading"
            className="text-xl font-semibold text-gray-800 mb-4"
          >
            {t("completedTitle")}
          </h2>
          {completedIsLoading && <p className="text-gray-500">Loading...</p>}
          {completedIsError && <p className="text-red-500">Error...</p>}
          {!completedTasks || completedTasks.length === 0 ? (
            <p className="text-gray-500">Empty...</p>
          ) : (
            <ul className="space-y-3">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEditModal}
                />
              ))}
            </ul>
          )}
        </section>
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

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={handleCloseEditModal}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </Container>
  );
}
