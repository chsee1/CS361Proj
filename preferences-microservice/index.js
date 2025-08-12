// preferences-service/index.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 8082;
const DATA_PATH = path.join(__dirname, "preferences.json");

app.use(cors());
app.use(express.json());

// Load existing preferences or initialize empty
let preferences = {};
if (fs.existsSync(DATA_PATH)) {
  preferences = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

// GET preferences for a user
app.get("/api/preferences/:userId", (req, res) => {
  const { userId } = req.params;
  const userPrefs = preferences[userId];
  if (userPrefs) {
    res.json(userPrefs);
  } else {
    res.status(404).json({ error: "Preferences not found" });
  }
});

// POST/PUT preferences for a user
app.post("/api/preferences/:userId", (req, res) => {
  const { userId } = req.params;
  const newPrefs = req.body;

  preferences[userId] = newPrefs;

  fs.writeFileSync(DATA_PATH, JSON.stringify(preferences, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Preferences Microservice running on http://localhost:${PORT}`);
});
