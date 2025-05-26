import { Plus } from "lucide-react";
import Container from "./components/Container";
import FloatingButton from "./components/FloatingButton";

export default function App() {
  return (
    <Container>
      <FloatingButton>
        <Plus className="h-6 w-6" />
      </FloatingButton>
    </Container>
  );
}
