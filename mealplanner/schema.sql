DROP TABLE users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
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

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  ingredients TEXT,
  instructions TEXT
);

INSERT OR IGNORE INTO recipes (name, ingredients, instructions) VALUES
  ('Quinoa Bowl', 'Quinoa, roasted vegetables', 'Cook quinoa and top with vegetables.'),
  ('Tofu Curry', 'Tofu, curry sauce, veggies', 'Simmer tofu in curry sauce with veggies.'),
  ('Avocado Toast', 'Bread, avocado, seasoning', 'Toast bread and spread mashed avocado.');