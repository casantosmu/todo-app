import { Check } from "lucide-react";
import cn from "../lib/cn";

interface CheckboxButtonProps {
  isChecked: boolean;
}

export default function CheckboxButton({ isChecked }: CheckboxButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all",
        isChecked
          ? "border-gray-800 bg-gray-800 hover:bg-gray-700"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      )}
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
