import type { Task } from "@/modules/tasks/models/task";
import Dexie, { type EntityTable } from "dexie";

export const db = new Dexie("todoapp_db") as Dexie & {
  tasks: EntityTable<Task, "id">;
};

db.version(1).stores({
  tasks: "id, isCompleted",
});
