import {
  DELETED_STATUS,
  TASK_STATUS,
  type Task,
} from "@/modules/tasks/models/task";
import { faker } from "@faker-js/faker";
import Dexie, { type EntityTable } from "dexie";

export const db = new Dexie("todoapp_db") as Dexie & {
  tasks: EntityTable<Task, "id">;
};

db.version(1).stores({
  tasks:
    "id, [isDeleted+isCompleted+createdAt], [isDeleted+isCompleted+completedAt]",
});

// await db.delete();

export const seedDatabase = async () => {
  const count = await db.tasks.count();
  if (count > 0) {
    return;
  }

  const todos: Task[] = Array.from({ length: 30 }, () => {
    const isCompleted = faker.datatype.boolean();
    const isDeleted = faker.datatype.boolean();
    return {
      id: crypto.randomUUID(),
      title: faker.lorem.sentence({ min: 5, max: 10 }),
      completedAt: isCompleted ? faker.date.recent() : null,
      isCompleted: isCompleted ? TASK_STATUS.COMPLETED : TASK_STATUS.PENDING,
      isDeleted: isDeleted
        ? DELETED_STATUS.DELETED
        : DELETED_STATUS.NOT_DELETED,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: isDeleted ? faker.date.recent() : null,
    };
  });

  await db.tasks.bulkAdd(todos);
  console.log("Database seeded with mock data.");
};
