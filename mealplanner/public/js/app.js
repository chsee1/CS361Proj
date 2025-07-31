// ========== Helper Functions ==========

// Fetch user info (used on dashboard header)
async function fetchUserData() {
  const res = await fetch("/api/user", { credentials: "include" });
  if (!res.ok) throw new Error("Not authenticated");
  return await res.json();
}

// Handle recipe loading by ID
async function loadRecipe() {
  const recipeId = new URLSearchParams(window.location.search).get("id");
  if (!recipeId) return;

  const res = await fetch(`/api/recipes/${recipeId}`);
  if (!res.ok) return console.error("Failed to load recipe");

  const recipe = await res.json();
  document.getElementById("recipe-name").textContent = recipe.name;
  document.getElementById("recipe-ingredients").innerHTML = recipe.ingredients
    .split(",")
    .map(i => `<li>${i.trim()}</li>`)
    .join("");
  document.getElementById("recipe-instructions").textContent = recipe.instructions;
}

// Render weekly meal plan
async function generateMealPlan() {
  const resultDiv = document.getElementById("result");
  const res = await fetch("/api/weekly", { method: "GET" });
  if (!res.ok) return alert("Failed to load meal plan");

  const meals = await res.json();
  const rows = meals.map(m => `
    <tr>
      <td>${m.day}</td>
      <td>${m.breakfast}</td>
      <td>${m.lunch}</td>
      <td>${m.dinner}</td>
    </tr>`).join("");

  resultDiv.innerHTML = `
    <h3>Weekly Plan</h3>
    <table>
      <tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr>
      ${rows}
    </table>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {

  // ========== Register Form ==========
  const registerForm = document.querySelector("form.register");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Account created! Redirecting...");
        window.location.href = "/";
      } else {
        alert("Registration failed.");
      }
    });
  }

  // ========== Login Form ==========
  const loginForm = document.querySelector("form.login");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        alert("Invalid login.");
      }
    });
  }

  // ========== Dashboard Header Username ==========
  const welcome = document.getElementById("welcome-message");
  const userInfo = document.getElementById("user-info");
  if (welcome && userInfo) {
    try {
      const data = await fetchUserData();
      welcome.textContent = `Hi, ${data.username}!`;
      userInfo.textContent = `👤 ${data.username}`;
    } catch {
      window.location.href = "/";
    }
  }

  // ========== Preferences Form ==========
  const preferencesForm = document.querySelector("form.preferences");
  if (preferencesForm) {
    preferencesForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const textarea = preferencesForm.querySelector("textarea[name='preference']");
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preference: textarea.value })
      });
      alert(res.ok ? "Preferences saved!" : "Failed to save preferences.");
    });
  }

  // ========== Generate Meal Plan ==========
  const generateBtn = document.getElementById("generate-btn");
  if (generateBtn) {
    generateBtn.addEventListener("click", generateMealPlan);
  }

  // ========== Recipe Page ==========
  if (document.getElementById("recipe-name")) {
    await loadRecipe();
  }

});
