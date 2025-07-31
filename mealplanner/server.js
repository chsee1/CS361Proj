const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./database');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'mealplanner-secret',
  resave: false,
  saveUninitialized: true
}));

// Routes for static HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard.html')));
app.get('/preferences.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'preferences.html')));
app.get('/suggestions.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'suggestions.html')));
app.get('/generate.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'generate.html')));
app.get('/weekly.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'weekly.html')));

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], function (err) {
    if (err) return res.status(400).json({ error: "User already exists" });
    req.session.userId = this.lastID;
    res.json({ message: "Registered", userId: this.lastID });
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid login" });
    }
    req.session.userId = user.id;
    res.json({ message: "Logged in", userId: user.id });
  });
});

// Save preferences
app.post('/api/preferences', (req, res) => {
  const { preference } = req.body;
  const userId = req.session.userId;
  if (!userId) return res.status(403).send("Not logged in");
  db.run("INSERT INTO preferences (user_id, preference) VALUES (?, ?)", [userId, preference], (err) => {
    if (err) return res.status(500).send("DB error");
    res.send("Preferences saved");
  });
});

// Save weekly meal plan
app.post('/api/weekly', (req, res) => {
  const userId = req.session.userId;
  const { meals } = req.body;
  if (!userId) return res.status(403).send("Not logged in");

  const stmt = db.prepare("INSERT INTO mealplans (user_id, week_start, day, breakfast, lunch, dinner) VALUES (?, ?, ?, ?, ?, ?)");
  for (const day of meals) {
    stmt.run(userId, day.week_start, day.day, day.breakfast, day.lunch, day.dinner);
  }
  stmt.finalize();
  res.send("Meal plan saved");
});

// Get weekly meals
app.get('/api/weekly', (req, res) => {
  const userId = req.session.userId;
  db.all("SELECT * FROM mealplans WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).send("DB error");
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
