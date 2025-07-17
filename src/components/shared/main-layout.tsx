import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="mx-auto max-w-xl px-4 py-8">{children}</div>;
};
