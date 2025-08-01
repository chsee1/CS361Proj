const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const { mockUser, mockMeals, recentFavorites } = require("./mock/mockData");

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

app.get("/", (req, res) => {
  res.render("index", {
    title: "Login",
    error: req.query.error || null 
  });
});
app.get("/register", (req, res) => res.render("register", { title: "Register", error: req.query.error || null  }));
app.get("/dashboard", (req, res) => res.render("dashboard", { title: "Dashboard", meals: mockMeals, recentFavorites: recentFavorites }));
app.get("/preferences", (req, res) => {
  res.render("preferences", {
    title: "Prefences",
    saved: req.query.saved === "true",
    meals: mockMeals,
    user: mockUser,
  });
});
app.get("/suggestions", (req, res) => res.render("suggestions", { title: "Suggestions", meals: mockMeals, recentFavorites: recentFavorites }));
app.get("/generate", (req, res) => res.render("generate", { title: "Generate", meals: mockMeals, recentFavorites: recentFavorites }));
app.get("/recipe", (req, res) => {
  const id = parseInt(req.query.id);
  const meal = mockMeals.find(m => m.id === id);
  if (!meal) return res.status(404).send("Meal not found");
  res.render("recipe", {
    title: meal.name,
    meal
  });
});

// Simulate weekly plan
app.get("/weekly", (req, res) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const types = { Breakfast: [], Lunch: [], Dinner: [] };
  mockMeals.forEach(m => types[m.type]?.push(m.name));

  const meals = days.map((day, i) => ({
    day,
    breakfast: types.Breakfast[i % types.Breakfast.length],
    lunch: types.Lunch[i % types.Lunch.length],
    dinner: types.Dinner[i % types.Dinner.length]
  }));




  res.render("weekly", { title: "Weekly Plan", meals });
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



app.listen(PORT, () => console.log(`✅ App running at http://localhost:${PORT}`));
