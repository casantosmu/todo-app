import Database from "better-sqlite3";
import fastifyPlugin from "fastify-plugin";
import fs from "node:fs";
import path from "node:path";

declare module "fastify" {
  export interface FastifyInstance {
    db: Database.Database;
  }
}

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

  // Set WAL mode for better concurrency
  db.pragma("journal_mode = WAL");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sync_logs (
      id INTEGER PRIMARY KEY NOT NULL,
      payload JSON NOT NULL
    );
  `;
  db.exec(createTableQuery);
  server.log.info("Database schema initialized.");

  server.decorate("db", db);

  server.addHook("onClose", (instance, done) => {
    db.close();
    instance.log.info("Database connection closed.");
    done();
  });

  done();
});
