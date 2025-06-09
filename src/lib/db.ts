import PouchDB from "pouchdb";
import FindPouchDB from "pouchdb-find";

const db = new PouchDB("mycentral-db");
PouchDB.plugin(FindPouchDB);

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

await db.createIndex({
  index: { fields: ["createdAt", "type"] },
});

export default db;
