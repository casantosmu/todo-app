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
            ? "mb-1 block text-sm font-medium text-gray-600"
            : "sr-only"
        }
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-800 placeholder-gray-400 shadow-sm transition-colors focus:border-gray-800 focus:ring-1 focus:ring-gray-800 focus:outline-none"
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        {...rest}
      />
    </>
  );
}
