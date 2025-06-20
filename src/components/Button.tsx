import type { MouseEventHandler, ReactNode } from "react";
import cn from "../lib/cn";

const baseClasses =
  "inline-flex items-center justify-center px-4 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";

const variantClasses = {
  solid: {
    primary:
      "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400 disabled:hover:bg-gray-400",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-400 disabled:hover:bg-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 disabled:hover:bg-red-300",
  },
  outline: {
    primary:
      "border border-gray-800 text-gray-800 bg-transparent hover:bg-gray-100 focus:ring-gray-500 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent",
    secondary:
      "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 focus:ring-gray-500 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent",
    danger:
      "border border-red-600 text-red-600 bg-transparent hover:bg-red-50 focus:ring-red-500 disabled:border-red-300 disabled:text-red-400 disabled:hover:bg-transparent",
  },
};

interface ButtonProps {
  children?: ReactNode | undefined;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean | undefined;
  variant?: "solid" | "outline";
  color?: "primary" | "secondary" | "danger";
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string | undefined;
}

export default function Button({
  children,
  disabled,
  type,
  variant = "solid",
  color = "primary",
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant][color], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
