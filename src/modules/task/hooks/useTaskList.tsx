import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import db from "../../../lib/db";
import type Task from "../types/Task";
import { getTaskListKey } from "./_keys";

const useTaskList = (options?: UseQueryOptions<Task[]>) => {
  return useQuery({
    ...options,
    queryKey: getTaskListKey(),
    async queryFn() {
      const result = await db.allDocs<Task>({
        include_docs: true,
        descending: true,
        startkey: "task\ufff0",
        endkey: "task",
      });

      return result.rows.map((row) => row.doc).filter((doc) => !!doc);
    },
  });
};

export default useTaskList;
