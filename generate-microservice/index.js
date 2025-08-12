const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8085;

app.use(cors());
app.use(express.json());

const userPlans = {}; // In-memory meal plan store by user

// POST: Generate and save plan
app.post("/api/generate", (req, res) => {
  const { meals, preferences, userId } = req.body;

  console.log("🟢 Received generate request for userId:", userId);

  if (!meals || !Array.isArray(meals)) {
    return res.status(400).json({ error: "Meals list required" });
  }

  // Filter meals by preferences
  const filtered = meals.filter(meal => {
    const matchDiet = !preferences?.diet?.length || preferences.diet.includes(meal.diet);
    const matchAllergy = !preferences?.allergy?.length || !preferences.allergy.some(a => a === meal.allergy);
    const matchCalories = !preferences?.calories || meal.calories <= preferences.calories;
    return matchDiet && matchAllergy && matchCalories;
  });

  const grouped = {
    Breakfast: filtered.filter(m => m.type === "Breakfast"),
    Lunch: filtered.filter(m => m.type === "Lunch"),
    Dinner: filtered.filter(m => m.type === "Dinner")
  };

  console.log("Filtered meal counts:", {
    breakfast: grouped.Breakfast.length,
    lunch: grouped.Lunch.length,
    dinner: grouped.Dinner.length
  });

  // Random selection WITH repeats
  const randomWithRepeats = (arr) =>
    Array.from({ length: 7 }, () => arr[Math.floor(Math.random() * arr.length)] || { name: "N/A" });

  const breakfasts = randomWithRepeats(grouped.Breakfast);
  const lunches = randomWithRepeats(grouped.Lunch);
  const dinners = randomWithRepeats(grouped.Dinner);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const plan = days.map((day, i) => ({
    day,
    breakfast: breakfasts[i].name,
    lunch: lunches[i].name,
    dinner: dinners[i].name
  }));

  if (userId) {
    userPlans[userId] = plan;
    console.log("✅ Saved plan for userId:", userId);
  } else {
    console.warn("❌ Missing userId in request body. Plan not saved.");
  }

  res.json(plan);
});


// GET: Return saved weekly plan
app.get("/api/weekly/:userId", (req, res) => {
  const plan = userPlans[req.params.userId];
  if (!plan) return res.status(404).json({ error: "No plan found" });
  res.json(plan);
});

app.listen(PORT, () => {
  console.log(`✅ Generate Microservice running at http://localhost:${PORT}`);
});
