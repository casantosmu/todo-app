import type { Database, Statement } from "better-sqlite3";
import camelcaseKeys from "camelcase-keys";
import decamelizeKeys from "decamelize-keys";

interface Task {
  id: string;
  title: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default class TaskRepository {
  private readonly getStmt: Statement;
  private readonly insertStmt: Statement;
  private readonly softDeleteStmt: Statement;

  constructor(private readonly db: Database) {
    this.getStmt = this.db.prepare("SELECT * FROM tasks WHERE id = ?;");

    this.insertStmt = this.db.prepare(`
      INSERT INTO tasks (id, title, completed_at, created_at, updated_at, deleted_at)
      VALUES (?, ?, ?, ?, ?, ?);
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
    return camelcaseKeys(result as Record<string, unknown>) as unknown as Task;
  }

  insert(data: Task) {
    this.insertStmt.run([
      data.id,
      data.title,
      data.completedAt,
      data.createdAt,
      data.updatedAt,
      data.deletedAt,
    ]);
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
