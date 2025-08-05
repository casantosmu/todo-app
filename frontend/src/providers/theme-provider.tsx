import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { ThemeContext, themes, type Theme } from "./theme-provider-context";

const STORAGE_KEY = "ui-theme";

const isTheme = (value: unknown): value is Theme => {
  return typeof value === "string" && themes.includes(value as Theme);
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);

    if (isTheme(storedTheme)) {
      return storedTheme;
    }

    return "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(STORAGE_KEY, theme);
        setTheme(theme);
      },
    }),
    [theme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
};
