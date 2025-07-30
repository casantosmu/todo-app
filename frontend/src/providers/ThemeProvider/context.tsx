import { createContext, use } from "react";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export type Theme = (typeof themes)[number];

export const themes = ["light", "dark", "system"] as const;

export const ThemeContext = createContext<ThemeProviderState | null>(null);

export const useTheme = () => {
  const context = use(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
