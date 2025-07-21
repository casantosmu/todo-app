import { TASK_STATUS, type Task } from "@/modules/tasks/models/task";
import { faker } from "@faker-js/faker";
import Dexie, { type EntityTable } from "dexie";
import { generateId } from "./id";

export const db = new Dexie("todoapp_db") as Dexie & {
  tasks: EntityTable<Task, "id">;
};

db.version(1).stores({
  tasks: "id, isCompleted",
});

export const seedDatabase = async () => {
  const count = await db.tasks.count();
  if (count > 0) {
    return;
  }

  const todos: Task[] = Array.from({ length: 15 }, () => {
    const isCompleted = faker.datatype.boolean();
    return {
      id: generateId(),
      title: faker.lorem.sentence({ min: 5, max: 10 }),
      completedAt: isCompleted ? faker.date.recent() : null,
      isCompleted: isCompleted ? TASK_STATUS.COMPLETED : TASK_STATUS.PENDING,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  });

  await db.tasks.bulkAdd(todos);
  console.log("Database seeded with mock data.");
};
