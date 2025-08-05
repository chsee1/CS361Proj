const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testGetRequest(drivewayId, i) {
  const start = Date.now();
  try {
    const res = await fetch(`http://localhost:4000/api/ratings/${drivewayId}`);
    const data = await res.json();
    const time = Date.now() - start;
    return { ok: true, time };
  } catch (err) {
    const time = Date.now() - start;
    return { ok: false, time };
  }
}

async function runScalabilityTest() {
  const drivewayId = 101;
  const NUM_REQUESTS = 100;
  const requests = [];

  for (let i = 0; i < NUM_REQUESTS; i++) {
    requests.push(testGetRequest(drivewayId, i));
  }

  const results = await Promise.all(requests);
  const successCount = results.filter(r => r.ok).length;
  const failureCount = results.filter(r => !r.ok).length;
  const avgTime = (results.reduce((sum, r) => sum + r.time, 0) / NUM_REQUESTS).toFixed(2);

  console.log("=== Scalability Test Results ===");
  console.log(`Total Requests: ${NUM_REQUESTS}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  console.log(`Failure Rate: ${(failureCount / NUM_REQUESTS * 100).toFixed(2)}%`);
  console.log(`Average Response Time: ${avgTime} ms`);
}

runScalabilityTest();
