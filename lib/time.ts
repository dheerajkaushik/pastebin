export function nowMs(headers: Headers) {
  if (process.env.TEST_MODE === "1") {
    const testNow = headers.get("x-test-now-ms");
    if (testNow) return parseInt(testNow, 10);
  }
  return Date.now();
}
