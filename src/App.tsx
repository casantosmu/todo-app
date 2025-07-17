import { faker } from "@faker-js/faker";
import { MainLayout } from "./components/shared/main-layout";
import { TopNavbar } from "./components/shared/top-navbar";
import { generateId } from "./lib/id";
import { QuickAddBar } from "./modules/todos/components/quick-add-bar";
import { TaskItem } from "./modules/todos/components/task-item";
import type { Todo } from "./modules/todos/types";

const editingIndex = faker.number.int({ min: 0, max: 29 });

const todos: { todo: Todo; isEditing: boolean }[] = Array.from(
  { length: 30 },
  (_, index) => {
    const isCompleted = faker.datatype.boolean();
    return {
      todo: {
        _id: generateId("todo"),
        title: faker.lorem.sentence({ min: 5, max: 10 }),
        completedAt: isCompleted ? faker.date.recent() : null,
        createdAt: faker.date.past(),
      },
      isEditing: index === editingIndex,
    };
  },
);

export default function App() {
  return (
    <MainLayout>
      <header className="bg-background sticky top-0 z-10 py-4">
        <TopNavbar />
        <div className="mt-4">
          <QuickAddBar />
        </div>
      </header>

      <main>
        <section className="mt-4">
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
