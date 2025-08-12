const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 8083;

app.use(cors());
app.use(express.json());

// ✅ Load meals from meals.json
const MEALS_PATH = path.join(__dirname, "meals.json");
let mockMeals = [];

try {
  const data = fs.readFileSync(MEALS_PATH, "utf8");
  mockMeals = JSON.parse(data);
} catch (err) {
  console.error("❌ Failed to load meals.json:", err.message);
  mockMeals = [];
}

// ✅ Route goes HERE
app.post("/api/suggestions", (req, res) => {
  const prefs = req.body;

  const meals = mockMeals.filter(meal => {
    const matchDiet = !prefs.diet?.length || prefs.diet.includes(meal.diet);
    const matchAllergy = !prefs.allergy?.length || !prefs.allergy.some(a => a === meal.allergy);
    const matchCalories = !prefs.calories || meal.calories <= prefs.calories;
    return matchDiet && matchAllergy && matchCalories;
  });

  res.json(meals);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Suggestions Microservice running at http://localhost:${PORT}`);
});
