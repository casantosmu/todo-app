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
      className="fixed right-6 bottom-6 cursor-pointer rounded-full bg-gray-800 p-4 text-white transition-colors hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
