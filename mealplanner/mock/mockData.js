// mockData.js

const mockUser = {
  id: 1,
  username: "lily",
  email: "lily@example.com",
  preferences: {
    diet: ["Vegetarian"],
    allergies: ["Nuts", "Shellfish"],
    caloriesPerDay: 2000,
    mealFrequency: "3 meals + 1 snack"
  },
  stats: {
    calories: { current: 1850, target: 2000 },
    protein: { current: 92, target: 120 },
    carbs: { current: 210, target: 250 },
    fat: { current: 58, target: 65 },
    adherence: 78,
    nutrition: 65
  },
  favorites: [
    { name: "Grilled Salmon", calories: 420 },
    { name: "Quinoa Bowl", calories: 350 },
    { name: "Chicken Stir Fry", calories: 390 }
  ]
};

const mockMeals = [
  {
    day: "Monday",
    breakfast: "Greek Yogurt Parfait",
    lunch: "Quinoa Veggie Bowl",
    dinner: "Baked Salmon"
  },
  {
    day: "Tuesday",
    breakfast: "Avocado Toast",
    lunch: "Mediterranean Wrap",
    dinner: "Chicken Stir Fry"
  },
  // Add the rest of the week as needed
];

const todaysMeals = [
    {
      mealType: "Breakfast",
      title: "Greek Yogurt Parfait",
      calories: 320,
      protein: "14g",
      image: "/images/parfait.jpg"
    },
    {
      mealType: "Lunch",
      title: "Quinoa Veggie Bowl",
      calories: 520,
      protein: "14g",
      image: "/images/veggie-bowl.jpg"
    },
    {
      mealType: "Dinner",
      title: "Baked Salmon",
      calories: 630,
      protein: "42g",
      image: "/images/salmon.jpg"
    }
  ];

module.exports = { mockUser, mockMeals, todaysMeals  };
