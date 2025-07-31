const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mealplanner.db');

db.serialize(() => {
  const fs = require('fs');
  const schema = fs.readFileSync('./schema.sql', 'utf8');
  db.exec(schema, (err) => {
    if (err) console.error("Schema error:", err);
  });
});

module.exports = db;
