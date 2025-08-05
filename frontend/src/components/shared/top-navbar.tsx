import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SyncStatus } from "@/modules/sync/components/sync-status";
import { useTheme } from "@/providers/theme-provider-context";
import { Moon, MoreHorizontal, Settings, Sun } from "lucide-react";

export const TopNavbar = () => {
  const { setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-xl font-bold">TodoApp</h1>

      <div className="flex items-center gap-1">
        <SyncStatus status="unconfigured" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Application options"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="mr-2 h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute mr-2 h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span>Toggle theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setTheme("light");
                    }}
                  >
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTheme("dark");
                    }}
                  >
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTheme("system");
                    }}
                  >
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
