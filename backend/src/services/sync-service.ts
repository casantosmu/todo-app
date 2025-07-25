import type { Database } from "better-sqlite3";

export default class SyncService {
  constructor(private readonly db: Database) {}

  helloWorld() {
    const query = this.db.prepare("SELECT 'Hello world!' as message");
    return query.get();
  }
}
