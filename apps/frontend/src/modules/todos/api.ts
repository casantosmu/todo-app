import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import ApiClient, { HttpError } from "../../lib/ApiClient";
import type { Todo, TodoCreate } from "./types";

export const useTodoCreate = (
  options?: UseMutationOptions<Todo, HttpError, TodoCreate>,
) => {
  return useMutation({
    ...options,
    mutationFn(body: TodoCreate) {
      return ApiClient.post("/v1/todos", body);
    },
  });
};
