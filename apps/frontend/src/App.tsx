import { Plus } from "lucide-react";
import { useState } from "react";
import Container from "./components/Container";
import FloatingButton from "./components/FloatingButton";
import Modal from "./components/Modal";
import TodoAddInput from "./modules/todo/TodoAddInput";

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
      <FloatingButton onClick={handleOpenModal}>
        <Plus className="h-6 w-6" />
      </FloatingButton>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TodoAddInput />
      </Modal>
    </Container>
  );
}
