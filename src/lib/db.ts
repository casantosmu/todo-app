import PouchDB from "pouchdb";
import FindPouchDB from "pouchdb-find";
import type Task from "../modules/task/types/Task";
import config from "./config";

const db = new PouchDB<Task>("mycentral-db");
PouchDB.plugin(FindPouchDB);

if (!config.env.isTest) {
  db.sync(new PouchDB("http://admin:password@localhost:5984/mycentral-db"), {
    live: true,
    retry: true,
  })
    .on("change", (change) => {
      console.log("DB SYNC CHANGE", change);
    })
    .on("paused", (info) => {
      console.log("DB SYNC PAUSED", info);
    })
    .on("denied", (info) => {
      console.log("DB SYNC DENIED", info);
    })
    .on("complete", (info) => {
      console.log("DB SYNC COMPLETE", info);
    })
    .on("error", (error) => {
      console.log("DB SYNC ERROR", error);
    })
    .catch(console.error);
}

if (config.env.isDev || config.env.isTest) {
  const { indexes } = await db.getIndexes();

  await Promise.all(
    indexes
      .filter((index): index is PouchDB.Find.Index & { ddoc: string } => {
        return typeof index.ddoc === "string";
      })
      .map((index) => {
        return db.deleteIndex(index);
      })
  );
}

await Promise.all([
  db.createIndex({
    index: { fields: ["createdAt", "type"] },
  }),
  db.createIndex({
    index: { fields: ["completedAt", "type"] },
  }),
]);

export default db;
