import type { Database, Statement } from "better-sqlite3";
import camelcaseKeys from "camelcase-keys";
import decamelizeKeys from "decamelize-keys";
import type { Task } from "../schemas/task.js";

// issue: https://github.com/sindresorhus/camelcase-keys/issues/114
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type TaskRow = {
  id: string;
  title: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export default class TaskRepository {
  private readonly getStmt: Statement<[string], TaskRow>;
  private readonly insertStmt: Statement<TaskRow>;
  private readonly softDeleteStmt: Statement<[string, string, string]>;

  constructor(private readonly db: Database) {
    this.getStmt = this.db.prepare("SELECT * FROM tasks WHERE id = ?;");

    this.insertStmt = this.db.prepare(`
      INSERT INTO tasks (id, title, completed_at, created_at, updated_at, deleted_at)
      VALUES (:id, :title, :completed_at, :created_at, :updated_at, :deleted_at);
    `);

    this.softDeleteStmt = this.db.prepare(`
      UPDATE tasks
      SET deleted_at = ?, updated_at = ?
      WHERE id = ?;
    `);
  }

  getById(id: string) {
    const result = this.getStmt.get(id);
    if (!result) {
      return null;
    }
    return camelcaseKeys(result);
  }

  insert(data: Task) {
    this.insertStmt.run({
      id: data.id,
      title: data.title,
      completed_at: data.completedAt,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
      deleted_at: data.deletedAt,
    });
  }

  update(id: string, data: Partial<Omit<Task, "id">>) {
    const fields = decamelizeKeys(data);
    const columns = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    const updateStmt = this.db.prepare(`
      UPDATE tasks
      SET ${columns}
      WHERE id = ?;
    `);

    updateStmt.run([...values, id]);
  }

  softDelete(id: string, deletedAt: string, updatedAt: string) {
    this.softDeleteStmt.run(deletedAt, updatedAt, id);
  }
}
