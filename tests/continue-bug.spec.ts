import { test, expect } from "./forward-fixture";

test("The bug exists!", async ({ page, sseHandle }) => {
  await page.route("/api/foo/sse",
    async (route) => {
      sseHandle.attach(route);
    }
  );

  // Fails with the query parameter. If you keep the URL as 'http://localhost:3000', the test will pass in Chrome
  await page.goto("http://localhost:3000?foo=bar");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("playwright-continue");

  sseHandle.get().send({ foo: "bar" });

  await expect(page.locator("#sse-id")).toHaveText(/bar/);
});

