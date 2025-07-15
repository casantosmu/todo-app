import { db } from "@/api/pouchdb";
import { generateId } from "@/lib/id";
import type { Todo } from "./types";

export const TodosService = {
  getAllTodos: async (): Promise<Todo[]> => {
    const result = await db.allDocs<Todo>({
      include_docs: true,
      descending: true,
    });
    return result.rows.map((row) => row.doc).filter((doc) => !!doc);
  },
  addTodo: async (title: string): Promise<PouchDB.Core.Response> => {
    const newTodo: Todo = {
      _id: generateId("todo"),
      title,
      completedAt: null,
      createdAt: new Date(),
    };
    return db.put(newTodo);
  },
  updateTodo: async (todo: Todo): Promise<PouchDB.Core.Response> => {
    return db.put(todo);
  },
  deleteTodo: async (
    todo: Required<Pick<Todo, "_id" | "_rev">> & Todo,
  ): Promise<PouchDB.Core.Response> => {
    return db.remove(todo);
  },
};
