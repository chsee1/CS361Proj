const Database = require("better-sqlite3");
const db = new Database("ratings.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drivewayId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
    UNIQUE(drivewayId, userId)
  );
`);

module.exports = db;
