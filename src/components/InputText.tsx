import type { HTMLInputAutoCompleteAttribute } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputTextProps {
  id: string | undefined;
  label: string;
  labelVisible?: boolean;
  placeholder?: string | undefined;
  autoFocus?: boolean | undefined;
  autoComplete?: HTMLInputAutoCompleteAttribute | undefined;
}

export default function InputText({
  id,
  label,
  labelVisible = true,
  placeholder,
  autoFocus,
  autoComplete,
  ...rest
}: InputTextProps & UseFormRegisterReturn) {
  return (
    <>
      <label
        htmlFor={id}
        className={
          labelVisible
            ? "block text-sm font-medium text-gray-600 mb-1"
            : "sr-only"
        }
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        className="block w-full px-3 py-2 text-base text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800 transition-colors"
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        {...rest}
      />
    </>
  );
}
