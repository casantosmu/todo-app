import type { MouseEventHandler, ReactNode } from "react";

interface FloatingButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  children?: ReactNode | undefined;
}

export default function FloatingButton({
  onClick,
  children,
}: FloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
    >
      {children}
    </button>
  );
}
