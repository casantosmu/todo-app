/**
 * Debounces a function.
 * @param callback The function to debounce.
 * @param delay The debounce delay in ms.
 * @returns The debounced function.
 */
export default function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) {
  let timeoutTimer: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeoutTimer);

    timeoutTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
