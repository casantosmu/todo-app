import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";

export default function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center space-y-3">
      <Button>Click me</Button>
      <ModeToggle />
    </div>
  );
}
