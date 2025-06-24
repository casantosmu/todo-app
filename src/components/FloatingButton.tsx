import type { MouseEventHandler, ReactNode } from "react";

interface FloatingButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  children?: ReactNode | undefined;
  "aria-label"?: string | undefined;
}

export default function FloatingButton({
  onClick,
  children,
  "aria-label": ariaLabel,
}: FloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 p-4 rounded-full bg-gray-800 text-white cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
