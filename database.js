const Database = require("better-sqlite3");
const path = require("path");

const databasePath = process.env.DB_PATH || path.join(__dirname, "students.db");
const db = new Database(databasePath);

// Enable SQLite foreign-key support.
db.pragma("foreign_keys = ON");

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      course TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

module.exports = { db, initializeDatabase };