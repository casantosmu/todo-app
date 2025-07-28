import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a new object by omitting specified keys from a source object.
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
) => {
  const keysToOmit = new Set(keys);

  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.has(key as K)),
  ) as Omit<T, K>;
};
