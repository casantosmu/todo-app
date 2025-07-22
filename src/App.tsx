import { TopNavbar } from "./components/shared/top-navbar";
import { CompletedTasksAccordion } from "./modules/tasks/components/completed-tasks-accordion";
import { QuickAddBar } from "./modules/tasks/components/quick-add-bar";
import { TaskList } from "./modules/tasks/components/task-list";

export default function App() {
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
          <TaskList />
        </section>
        <section className="mt-4">
          <CompletedTasksAccordion />
        </section>
      </main>
    </div>
  );
}
