import { TopNavbar } from "./components/shared/top-navbar";
import { CompletedTasksAccordion } from "./modules/tasks/components/completed-tasks-accordion";
import { QuickAddBar } from "./modules/tasks/components/quick-add-bar";
import { TaskList } from "./modules/tasks/components/task-list";
import {
  useCompletedTasks,
  usePendingTasks,
} from "./modules/tasks/hooks/use-tasks";

export default function App() {
  const { data: pendingTasks = [], isLoading: isLoadingPending } =
    usePendingTasks();
  const { data: completedTasks = [], isLoading: isLoadingCompleted } =
    useCompletedTasks();

  if (isLoadingPending || isLoadingCompleted) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading tasks...
      </div>
    );
  }

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
          <TaskList tasks={pendingTasks} />
        </section>
        <section className="mt-4">
          <CompletedTasksAccordion tasks={completedTasks} />
        </section>
      </main>
    </div>
  );
}
