import Database from "better-sqlite3";
import fastifyPlugin from "fastify-plugin";
import fs from "node:fs";
import path from "node:path";

declare module "fastify" {
  export interface FastifyInstance {
    db: Database.Database;
  }
}

const initSchemas = (db: Database.Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sync_logs (
      id INTEGER PRIMARY KEY NOT NULL,
      operation TEXT NOT NULL,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      data JSON NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    );
  `);
};

/**
 * Connects to the database and decorates the Fastify instance with it.
 */
export default fastifyPlugin((server, options, done) => {
  const dbPath = server.config.DB_PATH;
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);
  server.log.info(`Database connected at ${dbPath}`);

  // PRAGMA settings for performance and consistency
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("foreign_keys = ON");

  initSchemas(db);
  server.log.info("Database schema initialized.");

  server.decorate("db", db);

  server.addHook("onClose", (instance, done) => {
    db.close();
    instance.log.info("Database connection closed.");
    done();
  });

  done();
});
