import { faker } from "@faker-js/faker";
import { MainLayout } from "./components/shared/main-layout";
import { TopNavbar } from "./components/shared/top-navbar";
import { generateId } from "./lib/id";
import { CompletedTasksAccordion } from "./modules/todos/components/completed-tasks-accordion";
import { QuickAddBar } from "./modules/todos/components/quick-add-bar";
import { TaskList } from "./modules/todos/components/task-list";
import type { Todo } from "./modules/todos/types";

const todos: Todo[] = Array.from({ length: 30 }, () => {
  return {
    _id: generateId("todo"),
    title: faker.lorem.sentence({ min: 5, max: 10 }),
    completedAt: faker.datatype.boolean() ? faker.date.recent() : null,
    createdAt: faker.date.past(),
  };
});

export default function App() {
  const pendingTodos = todos.filter((item) => !item.completedAt);
  const completedTodos = todos.filter((item) => item.completedAt);

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
          <TaskList todos={pendingTodos} />
        </section>
        <section className="mt-4">
          <CompletedTasksAccordion todos={completedTodos} />
        </section>
      </main>
    </MainLayout>
  );
}
