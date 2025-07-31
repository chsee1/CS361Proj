CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  preference TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  meal_name TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS mealplans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  week_start DATE,
  day TEXT,
  breakfast TEXT,
  lunch TEXT,
  dinner TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
