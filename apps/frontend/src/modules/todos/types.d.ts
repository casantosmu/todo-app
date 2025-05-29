export interface Todo {
  id: string;
  name: string;
}

export type TodoCreate = Omit<Todo, "id">;
