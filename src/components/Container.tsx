import type { ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode | undefined;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">{children}</div>
  );
}
