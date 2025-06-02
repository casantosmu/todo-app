import type { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode | undefined;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean | undefined;
}

export default function Button({ children, disabled, type }: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
    >
      {children}
    </button>
  );
}
