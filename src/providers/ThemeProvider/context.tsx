import { createContext, use } from "react";

export type Theme = "dark" | "light" | "system";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeProviderState | null>(null);

export const useTheme = () => {
  const context = use(ThemeContext);

  if (context === null)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
