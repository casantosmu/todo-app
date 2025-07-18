import { faker } from "@faker-js/faker";
import { TopNavbar } from "./components/shared/top-navbar";
import { generateId } from "./lib/id";
import { CompletedTasksAccordion } from "./modules/tasks/components/completed-tasks-accordion";
import { QuickAddBar } from "./modules/tasks/components/quick-add-bar";
import { TaskList } from "./modules/tasks/components/task-list";
import { TASK_STATUS, type Task } from "./modules/tasks/models/task";

const todos: Task[] = Array.from({ length: 30 }, () => {
  const isCompleted = faker.datatype.boolean();
  return {
    id: generateId(),
    title: faker.lorem.sentence({ min: 5, max: 10 }),
    completedAt: isCompleted ? faker.date.recent() : null,
    isCompleted: isCompleted ? TASK_STATUS.COMPLETED : TASK_STATUS.PENDING,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(), // IMPROVE
  };
});

export default function App() {
  const pendingTodos = todos.filter((item) => !item.completedAt);
  const completedTodos = todos.filter((item) => item.completedAt);

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <header className="bg-background sticky top-0 z-10 py-4">
        <TopNavbar />
        <div className="mt-4">
          <QuickAddBar />
        </div>
      </header>

      <main>
        <section className="mt-4">
          <TaskList tasks={pendingTodos} />
        </section>
        <section className="mt-4">
          <CompletedTasksAccordion tasks={completedTodos} />
        </section>
      </main>
    </div>
  );
}
