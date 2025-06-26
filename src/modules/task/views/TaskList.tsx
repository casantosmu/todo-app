import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../../components/Container";
import FloatingButton from "../../../components/FloatingButton";
import Modal from "../../../components/Modal";
import CompletedTaskList from "../components/CompletedTaskList";
import PendingTaskList from "../components/PendingTaskList";
import TaskCreate from "../components/TaskCreate";
import TaskEditModal from "../components/TaskEditModal";
import type Task from "../types/Task";

export default function TaskList() {
  const { t } = useTranslation();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <PendingTaskList onEditTask={handleOpenEditModal} />
        <CompletedTaskList onEditTask={handleOpenEditModal} />
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
