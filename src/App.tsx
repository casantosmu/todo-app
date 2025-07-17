import { MainLayout } from "./components/shared/main-layout";
import { TopNavbar } from "./components/shared/top-navbar";
import { generateId } from "./lib/id";
import { QuickAddBar } from "./modules/todos/components/quick-add-bar";
import { TaskItem } from "./modules/todos/components/task-item";
import type { Todo } from "./modules/todos/types";

const todos: { todo: Todo; isEditing: boolean }[] = [
  {
    todo: {
      _id: generateId("todo"),
      title: "Preparar la presentación para el lunes",
      completedAt: null,
      createdAt: new Date(),
    },
    isEditing: false,
  },
  {
    todo: {
      _id: generateId("todo"),
      title: "Revisar el pull request de la nueva feature",
      completedAt: null,
      createdAt: new Date(),
    },
    isEditing: false,
  },
  {
    todo: {
      _id: generateId("todo"),
      title: "Corregir bug en el login",
      completedAt: null,
      createdAt: new Date(),
    },
    isEditing: true,
  },
  {
    todo: {
      _id: generateId("todo"),
      title: "Hacer la compra semanal",
      completedAt: new Date(),
      createdAt: new Date(),
    },
    isEditing: false,
  },
];

export default function App() {
  return (
    <MainLayout>
      <TopNavbar />

      <main className="mt-8">
        <QuickAddBar />

        <section className="mt-5">
          <ul className="space-y-2">
            {todos.map(({ todo, isEditing }) => (
              <TaskItem key={todo._id} todo={todo} isEditing={isEditing} />
            ))}
          </ul>
        </section>
      </main>
    </MainLayout>
  );
}
