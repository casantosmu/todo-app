import { TopNavbar } from "./components/shared/top-navbar";
import { QuickAddBar } from "./modules/tasks/components/quick-add-bar";
import { TasksContainer } from "./modules/tasks/components/tasks-container";

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
        <TasksContainer />
      </main>
    </div>
  );
}
