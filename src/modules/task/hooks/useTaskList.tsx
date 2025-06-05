import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import db from "../../../lib/db";
import type Task from "../types/Task";
import { getTaskListKey } from "./_keys";

interface UseTaskListParams {
  descending?: boolean;
}

interface UseTaskListProps {
  params?: UseTaskListParams;
  options?: UseQueryOptions<Task[]>;
}

const useTaskList = ({ params, options }: UseTaskListProps = {}) => {
  const isDescending = params?.descending ?? true;

  return useQuery({
    ...options,
    queryKey: getTaskListKey(params),
    async queryFn() {
      const result = await db.allDocs<Task>({
        include_docs: true,
        descending: isDescending,
        startkey: isDescending ? "task\ufff0" : "task",
        endkey: isDescending ? "task" : "task\ufff0",
      });

      return result.rows.map((row) => row.doc).filter((doc) => !!doc);
    },
  });
};

export default useTaskList;
