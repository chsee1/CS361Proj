const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const { mockUser, mockMeals, recentFavorites } = require("./mock/mockData");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const app = express();
const PORT = 3000;

const session = require("express-session");

app.use(session({
  secret: "mealplanner-secret",
  resave: false,
  saveUninitialized: true
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "partials/layout.ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.locals.user = mockUser;
  next();
});

// ----------------- PROXY ROUTE TO QUOTES MICROSERVICE -----------------
app.get("/api/quote", async (req, res) => {
  try {
    const response = await fetch("http://localhost:8081/api/quote");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching from microservice:", err);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

// ----------------------------------------------------------------------

// ----------------- PROXY ROUTES TO PREFERENCES MICROSERVICE -----------------

app.get("/api/preferences/:userId", async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8082/api/preferences/${req.params.userId}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching preferences:", err);
    res.status(500).json({ error: "Failed to load preferences" });
  }
});

app.post("/api/preferences/:userId", async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8082/api/preferences/${req.params.userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error saving preferences:", err);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

app.get("/", (req, res) => {
  res.render("index", {
    title: "Login",
    error: req.query.error || null 
  });
});
app.get("/register", (req, res) => res.render("register", { title: "Register", error: req.query.error || null  }));
app.get("/dashboard", async (req, res) => {
  const userId = 1;

  let userFavorites = [];
  try {
    const response = await fetch(`http://localhost:8084/api/favorites/${userId}`);
    userFavorites = await response.json();
  } catch (err) {
    console.warn("⚠️ Could not fetch favorites, using mock");
  }

  res.render("dashboard", {
    title: "Dashboard",
    meals: mockMeals,
    recentFavorites: userFavorites
  });
});

app.get("/preferences", (req, res) => {
  res.render("preferences", {
    title: "Prefences",
    saved: req.query.saved === "true",
    meals: mockMeals,
    user: mockUser,
  });
});
app.get("/suggestions", async (req, res) => {
  const userId = 1; // Replace with req.session.userId later

  let preferences = {};
  try {
    const prefRes = await fetch(`http://localhost:8082/api/preferences/${userId}`);
    preferences = await prefRes.json();
  } catch (err) {
    console.error("Could not load preferences:", err.message);
  }

  let meals = [];
  try {
    const suggRes = await fetch("http://localhost:8083/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });
    meals = await suggRes.json();
  } catch (err) {
    console.error("Could not get suggestions:", err.message);
  }

  res.render("suggestions", {
    title: "Suggestions",
    meals,
    recentFavorites,
  });
});


app.get("/recipe", (req, res) => {
  const id = parseInt(req.query.id);
  const meal = mockMeals.find(m => m.id === id);
  if (!meal) return res.status(404).send("Meal not found");
  res.render("recipe", {
    title: meal.name,
    meal
  });
});


app.get("/weekly", async (req, res) => {
  const userId = 1;
  let weeklyPlan = [];

  try {
    const response = await fetch(`http://localhost:8085/api/weekly/${userId}`);
    const data = await response.json();

    if (Array.isArray(data)) {
      weeklyPlan = data;
    } else {
      console.warn("⚠️ Weekly response was not an array:", data);
    }

  } catch (err) {
    console.error("Failed to load weekly plan:", err.message);
  }

  res.render("weekly", {
    title: "Weekly Plan",
    meals: weeklyPlan
  });
});



app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Logout error:", err);
        return res.redirect("/dashboard");
      }
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});
// ----------------- PROXY ROUTES TO FAVORITES MICROSERVICE -----------------

// Get favorites for a user
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8084/api/favorites/${req.params.userId}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// Add a new favorite meal
app.post("/api/favorites/:userId", async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8084/api/favorites/${req.params.userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error saving favorite:", err);
    res.status(500).json({ error: "Failed to save favorite" });
  }
});
// Remove favorite
app.delete("/api/favorites/:userId/:mealId", async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8084/api/favorites/${req.params.userId}/${req.params.mealId}`, {
      method: "DELETE"
    });

    const data = await response.json(); // <== fails if microservice returns HTML instead of JSON
    res.json(data);
  } catch (err) {
    console.error("Error deleting favorite:", err);
    res.status(500).json({ error: "Failed to delete favorite" });
  }
});


app.get("/generate", async (req, res) => {
  const userId = 1;

  let preferences = {};
  try {
    const prefRes = await fetch(`http://localhost:8082/api/preferences/${userId}`);
    preferences = await prefRes.json();
  } catch (err) {
    console.error("⚠️ Failed to fetch preferences:", err.message);
  }

  let weeklyPlan = [];
  try {
    const planRes = await fetch("http://localhost:8085/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meals: mockMeals,
        preferences,
        userId: userId 
      })
    });

    weeklyPlan = await planRes.json();
    console.log("✅ Generated plan saved for user", userId);
  } catch (err) {
    console.error("⚠️ Failed to generate plan:", err.message);
  }

  res.render("generate", {
    title: "Generate",
    meals: weeklyPlan,
    recentFavorites
  });
});




app.listen(PORT, () => console.log(`✅ App running at http://localhost:${PORT}`));
