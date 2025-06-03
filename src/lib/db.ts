import PouchDB from "pouchdb";

const db = new PouchDB("mycentral-db");

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

export default db;
