// src/quotes.js
// Dummy in-memory database of motivational quotes

const CATEGORIES = ["general", "nutrition", "habits", "selfcare"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildQuote(category) {
  const openers = [
    "Nice work",
    "Well done",
    "Great job",
    "You are on a roll",
    "Proud of you"
  ];

  const verbs = [
    "sticking with it",
    "showing up",
    "making smart choices",
    "fueling your body",
    "keeping promises to yourself",
    "building momentum",
    "taking the next small step"
  ];

  const closers = [
    "Keep going",
    "Your consistency is paying off",
    "Small wins add up",
    "You have got this",
    "Today counts"
  ];

  const catBits = {
    general: [
      "Every choice moves you forward",
      "Progress over perfection",
      "Strength grows with practice",
      "Your future self says thank you",
      "Discipline is a form of self respect"
    ],
    nutrition: [
      "Colorful plates mean powerful nutrients",
      "Protein and fiber are your teammates",
      "Hydration boosts energy and focus",
      "Balanced meals make goals realistic",
      "Your body notices every good bite"
    ],
    habits: [
      "Routines reduce decision fatigue",
      "Five minutes now beats an hour later",
      "Stack tiny actions for big change",
      "Plan once and follow the plan",
      "Your habit streak is getting stronger"
    ],
    selfcare: [
      "Be kind to yourself as you grow",
      "Rest and recovery support results",
      "Celebrate the effort, not just outcomes",
      "You deserve to feel good in your body",
      "Grace today makes progress possible tomorrow"
    ]
  };

  const compliments = [
    "Your effort is inspiring",
    "Your focus is sharp",
    "Your discipline shows",
    "Your choices reflect your goals",
    "Your mindset is powerful"
  ];

  const parts = [
    pick(openers) + ",",
    pick(verbs) + ".",
    pick(compliments) + ".",
    pick(catBits[category]),
    pick(closers) + "."
  ];

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function generateFive(category) {
  const set = new Set();
  let guard = 0;
  while (set.size < 5 && guard < 200) {
    set.add(buildQuote(category));
    guard++;
  }
  return Array.from(set);
}

function seedQuotes() {
  const map = {};
  for (const cat of CATEGORIES) {
    map[cat] = generateFive(cat);
  }
  return map;
}

const QUOTES = seedQuotes();

module.exports = { CATEGORIES, QUOTES };
