/**
 * Waits for a specified amount of time before resolving.
 */
export default function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
