import { http, HttpResponse } from "msw";
import type { TodoCreate } from "./types";

export const todoHandlers = [
  http.post<never, TodoCreate>(
    "http://localhost:3000/v1/todos",
    async ({ request }) => {
      const data = await request.json();

      return HttpResponse.json({
        id: crypto.randomUUID(),
        name: data.name,
      });
    },
  ),
];
