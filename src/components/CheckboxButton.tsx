import { Check } from "lucide-react";
import type { MouseEventHandler } from "react";
import cn from "../lib/cn";

interface CheckboxButtonProps {
  isChecked: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function CheckboxButton({
  isChecked,
  onClick,
}: CheckboxButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all",
        isChecked
          ? "border-gray-800 bg-gray-800 hover:bg-gray-700"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      <Check
        className={cn(
          "h-5 w-5 text-white transition-opacity",
          isChecked ? "opacity-100" : "opacity-0"
        )}
        strokeWidth={3}
      />
    </button>
  );
}
