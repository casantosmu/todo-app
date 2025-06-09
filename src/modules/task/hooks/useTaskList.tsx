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
  return useQuery({
    ...options,
    queryKey: getTaskListKey(params),
    async queryFn() {
      const result = (await db.find({
        selector: {
          type: "task",
          createdAt: { $gt: null },
        },
        sort: [{ createdAt: "desc" }],
      })) as PouchDB.Find.FindResponse<Task>;

      return result.docs.map((doc) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        completedAt: doc.completedAt ? new Date(doc.completedAt) : null,
      }));
    },
  });
};

export default useTaskList;
