const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 8084;

app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, "favorites.json");

// Load or initialize favorites
let favorites = {};
if (fs.existsSync(DATA_PATH)) {
  try {
    favorites = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  } catch {
    favorites = {};
  }
}

// GET favorites for a user
app.get("/api/favorites/:userId", (req, res) => {
  const { userId } = req.params;
  const userFavs = favorites[userId] || [];
  res.json(userFavs);
});

// POST a favorite meal for a user
app.post("/api/favorites/:userId", (req, res) => {
  const { userId } = req.params;
  const meal = req.body;

  if (!meal || !meal.id) {
    return res.status(400).json({ error: "Invalid meal format" });
  }

  favorites[userId] = favorites[userId] || [];
  const exists = favorites[userId].some(f => f.id === meal.id);

  if (!exists) {
    favorites[userId].push(meal);
    fs.writeFileSync(DATA_PATH, JSON.stringify(favorites, null, 2));
  }

  res.json({ success: true });
});

// DELETE a favorite meal for a user
app.delete("/api/favorites/:userId/:mealId", (req, res) => {
  const { userId, mealId } = req.params;
  const id = parseInt(mealId);

  if (!favorites[userId]) {
    return res.status(404).json({ error: "User not found" });
  }

  favorites[userId] = favorites[userId].filter(fav => fav.id !== id);

  fs.writeFileSync(DATA_PATH, JSON.stringify(favorites, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Favorites Microservice running at http://localhost:${PORT}`);
});
