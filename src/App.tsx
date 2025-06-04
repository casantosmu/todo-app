import { Plus } from "lucide-react";
import { useState } from "react";
import Container from "./components/Container";
import FloatingButton from "./components/FloatingButton";
import Modal from "./components/Modal";
import TaskCreate from "./modules/task/components/TaskCreate";
import TaskList from "./modules/task/components/TaskList";

export default function App() {
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

      <FloatingButton onClick={handleOpenModal}>
        <Plus className="h-6 w-6" strokeWidth={1.5} />
      </FloatingButton>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TaskCreate onCreate={console.log} />
      </Modal>
    </Container>
  );
}
