import PouchDB from "pouchdb";

const db = new PouchDB("mycentral-db");

db.sync(new PouchDB("http://localhost:5984/mycentral-db"), {
  live: true,
  retry: true,
})
  .on("change", function (change) {
    console.log("DB SYNC CHANGE", change);
  })
  .on("paused", function (info) {
    console.log("DB SYNC PAUSED", info);
  })
  //   .on("active", function (info) {
  //     // replication was resumed
  //   })
  .on("error", function (error) {
    console.log("DB SYNC ERROR", error);
  })
  .catch(console.error);

export default db;
