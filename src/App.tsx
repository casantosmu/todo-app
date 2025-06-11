import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "./components/Container";
import FloatingButton from "./components/FloatingButton";
import Modal from "./components/Modal";
import TaskCreate from "./modules/task/components/TaskCreate";
import TaskList from "./modules/task/components/TaskList";

export default function App() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <TaskList />

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
        <TaskCreate onCreate={console.log} />
      </Modal>
    </Container>
  );
}
