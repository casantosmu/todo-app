/**
 * Utility for conditionally joining class names.
 */
export default function cn(
  ...args: (string | number | boolean | null | undefined)[]
) {
  const classes = [];

  for (const arg of args) {
    if (!arg) {
      continue;
    }

    classes.push(arg);
  }

  return classes.join(" ");
}
