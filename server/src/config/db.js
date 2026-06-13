import sqlite3 from "sqlite3";

const sql3 = sqlite3.verbose();
const db = new sql3.Database("db/db.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

export default db;
