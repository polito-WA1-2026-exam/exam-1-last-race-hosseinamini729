import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";

const sql3 = sqlite3.verbose();
const db = new sql3.Database("./db/db.sqlite");

async function initializeDatabase() {
  console.log("Creating tables and seeding data...");

  // All users have same password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash("123456", saltRounds);

  db.serialize(() => {
    // Drop old tables
    db.run("DROP TABLE IF EXISTS events");
    db.run("DROP TABLE IF EXISTS segments");
    db.run("DROP TABLE IF EXISTS lines");
    db.run("DROP TABLE IF EXISTS stations");
    db.run("DROP TABLE IF EXISTS games");
    db.run("DROP TABLE IF EXISTS users");

    // Create tables
    db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`);

    db.run(`CREATE TABLE games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            score INTEGER,
            date TEXT
        )`);

    db.run(`CREATE TABLE stations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
        )`);

    db.run(`CREATE TABLE lines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
        )`);

    db.run(`CREATE TABLE segments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            station_a_id INTEGER,
            station_b_id INTEGER,
            line_id INTEGER
        )`);

    db.run(`CREATE TABLE events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            effect INTEGER
        )`);

    // Add 3 test users
    const insertUser = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)",
    );
    insertUser.run("player1", passwordHash);
    insertUser.run("player2", passwordHash);
    insertUser.run("player3", passwordHash);
    insertUser.finalize();

    // Add game histories for 2 user
    const insertGame = db.prepare(
      "INSERT INTO games (user_id, score, date) VALUES (?, ?, ?)",
    );
    insertGame.run(1, 15, "2026-06-10");
    insertGame.run(2, 22, "2026-06-12");
    insertGame.finalize();

    // Add 4 line metro
    const lines = ["Red Line", "Blue Line", "Green Line", "Yellow Line"];
    const insertLine = db.prepare("INSERT INTO lines (name) VALUES (?)");
    lines.forEach((line) => insertLine.run(line));
    insertLine.finalize();

    // Add 12 stations
    const stations = [
      "Centrale",
      "Porta Velaria",
      "Crocevia",
      "Piazza",
      "Fontana Oscura",
      "Borgo",
      "Viale",
      "Torre",
      "Campo",
      "Stazione Nord",
      "Ponte Antico",
      "Mercato",
    ];
    const insertStation = db.prepare("INSERT INTO stations (name) VALUES (?)");
    stations.forEach((station) => insertStation.run(station));
    insertStation.finalize();

    // Add segments (connection between stations)
    const segments = [
      // Red line
      [1, 2, 1],
      [2, 3, 1],
      [3, 4, 1],
      // Blue line
      [1, 5, 2],
      [5, 6, 2],
      [6, 7, 2],
      // Green line
      [2, 5, 3],
      [5, 8, 3],
      [8, 9, 3],
      // Yellow line
      [10, 11, 4],
      [11, 12, 4],
      [12, 1, 4],
    ];
    const insertSegment = db.prepare(
      "INSERT INTO segments (station_a_id, station_b_id, line_id) VALUES (?, ?, ?)",
    );
    segments.forEach((seg) => insertSegment.run(seg[0], seg[1], seg[2]));
    insertSegment.finalize();

    // Add 8 random events
    const events = [
      ["Kind passenger", 1],
      ["Quiet journey", 0],
      ["Train delayed", -1],
      ["Found a coin", 2],
      ["Lost ticket", -2],
      ["Pickpocket", -4],
      ["Express train", 3],
      ["Wrong platform", -3],
    ];
    const insertEvent = db.prepare(
      "INSERT INTO events (description, effect) VALUES (?, ?)",
    );
    events.forEach((event) => insertEvent.run(event[0], event[1]));
    insertEvent.finalize();

    console.log(
      "Database seeded successfully! You can now use database.sqlite",
    );
  });
}

initializeDatabase();
