export const getTaskListKey = (params?: unknown) => {
  const keys: unknown[] = ["task", "list"];
  if (params) {
    keys.push(params);
  }
  return keys;
};
