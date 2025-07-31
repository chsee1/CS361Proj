
document.addEventListener("DOMContentLoaded", () => {
  // REGISTER FORM
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
        alert("Account created! Redirecting to login...");
        window.location.href = "/";
      } else {
        alert("Registration failed.");
      }
    });
  }

  // LOGIN FORM
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
        window.location.href = "/dashboard.html";
      } else {
        alert("Invalid login.");
      }
    });
  }

  // PREFERENCES FORM
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

  // GENERATE MEAL PLAN
const generateBtn = document.getElementById("generate-btn");
if (generateBtn) {
  generateBtn.addEventListener("click", async () => {
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
      </tr>
    `).join("");

    resultDiv.innerHTML = `
      <h3>Weekly Plan</h3>
      <table>
        <tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr>
        ${rows}
      </table>
    `;
  });
}
