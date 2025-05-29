import { http, HttpResponse } from "msw";

export const todoHandlers = [
  http.post("http://localhost:3000/v1/todos", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];
