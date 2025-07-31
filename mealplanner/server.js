const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./database");
const expressLayouts = require("express-ejs-layouts");
const { mockUser, mockMeals, todaysMeals } = require('./mock/mockData');

const app = express();
const PORT = 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "partials/layout");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "mealplanner-secret",
  resave: false,
  saveUninitialized: true,
}));

// ✅ Middleware: make `user` available in all views
app.use((req, res, next) => {
  if (req.session.userId) {
    db.get("SELECT username FROM users WHERE id = ?", [req.session.userId], (err, user) => {
      res.locals.user = user || null;
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
});

// ✅ Render views
app.get("/", (req, res) => {
  res.render("index", {
    title: "Login",
    error: req.query.error || null,
    query: req.query
  });
});


app.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
    error: req.query.error || null,
    query: req.query
  });
});


app.get("/dashboard", (req, res) => {
  if (!req.session.userId) return res.redirect("/");
  res.render('dashboard', {
    title: "Dashboard",
    user: mockUser,
    meals: mockMeals,
    todaysMeals: todaysMeals,
    query: req.query
  });
});

app.get("/preferences", (req, res) => {
  res.render("preferences", {
    title: "Preferences",
    saved: req.query.saved === "true",
    query: req.query
  });
});

app.get("/suggestions", (req, res) => {
  res.render("suggestions", {
    title: "Suggestions",
    query: req.query
  });
});

app.get("/generate", (req, res) => {
  res.render("generate", {
    title: "Generate",
    success: req.query.success === "true",
    query: req.query
  });
});

app.get("/recipe", (req, res) => {
  res.render("recipe", {
    title: "Recipe",
    query: req.query
  });
});


app.get("/weekly", (req, res) => {
  db.all("SELECT * FROM mealplans WHERE user_id = ?", [req.session.userId], (err, meals) => {
    res.render("weekly", {
      title: "Weekly Plan",
      meals: meals || [],
      query: req.query
    });
  });
});


// ✅ Auth routes
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hash],
    function (err) {
      if (err) return res.redirect("/register?error=exists");
      req.session.userId = this.lastID;
      res.redirect("/dashboard");
    }
  );
});


app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.redirect("/?error=invalid");
  }

  db.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [identifier, identifier],
    async (err, user) => {
      if (err) {
        console.error("Login DB error:", err);
        return res.redirect("/?error=invalid");
      }

      if (!user) {
        console.log("No user found for:", identifier);
        return res.redirect("/?error=invalid");
      }

      const match = await bcrypt.compare(password, user.password);
      console.log("Password match:", match);

      if (!match) {
        return res.redirect("/?error=invalid");
      }

      req.session.userId = user.id;
      return res.redirect("/dashboard?welcome=true");
    }
  );
});


// ✅ Preferences & Favorites
app.post("/api/preferences", (req, res) => {
  const { preference } = req.body;
  db.run("INSERT INTO preferences (user_id, preference) VALUES (?, ?)", [req.session.userId, preference]);
  res.redirect("/dashboard");
});

app.post("/api/favorites", (req, res) => {
  const { meal_name } = req.body;
  db.run("INSERT INTO favorites (user_id, meal_name) VALUES (?, ?)", [req.session.userId, meal_name]);
  res.redirect("/suggestions");
});

app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});


app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
console.log("✅ After app.listen()");
