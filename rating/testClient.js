const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function submitRating(drivewayId, userId, stars) {
  const res = await fetch("http://localhost:4000/api/ratings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drivewayId, userId, stars })
  });

  const text = await res.text();
  console.log(`Rating user ${userId} → driveway ${drivewayId} (${stars}★): ${text}`);
}

async function getSummary(drivewayId) {
  const res = await fetch(`http://localhost:4000/api/ratings/${drivewayId}`);
  const data = await res.json();
  console.log(`📊 Driveway ${drivewayId} summary:`, data);
}

async function test() {
  const ratings = [
    { drivewayId: 101, userId: 1, stars: 5 },
    { drivewayId: 101, userId: 2, stars: 4 },
    { drivewayId: 101, userId: 3, stars: 3 },
    { drivewayId: 102, userId: 1, stars: 4 },
    { drivewayId: 102, userId: 4, stars: 5 },
    { drivewayId: 103, userId: 5, stars: 2 },
    { drivewayId: 103, userId: 11, stars: 3}
  ];

  for (const rating of ratings) {
    await submitRating(rating.drivewayId, rating.userId, rating.stars);
  }

  await getSummary(101);
  await getSummary(102);
  await getSummary(103);
}

test();
