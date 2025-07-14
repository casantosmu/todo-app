import { createContext } from "react";
import type { Theme } from "./Theme";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeProviderState | null>(null);
