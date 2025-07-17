import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="mx-auto max-w-lg px-4 py-8 md:py-12">{children}</div>;
};
