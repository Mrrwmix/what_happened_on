import { describe, expect, it } from "vitest";

import { fetchArticles } from "./nytimes";

describe("NYTimes Service", () => {
  it("successfully fetches articles from NYTimes API", async () => {
    const date = "2024-03-20";
    const articles = await fetchArticles(date);

    expect(Array.isArray(articles)).toBe(true);
    if (articles.length > 0) {
      expect(articles[0]).toMatchObject({
        headline: expect.objectContaining({
          main: expect.any(String),
        }),
        web_url: expect.any(String),
        abstract: expect.any(String),
      });
    }
  });

  it("handles API errors appropriately", async () => {
    const invalidDate = "2024/03/20"; // Wrong format
    await expect(fetchArticles(invalidDate)).rejects.toThrow(
      "Invalid date format"
    );
  });

  it("handles invalid dates", async () => {
    const invalidDate = "2024-13-45"; // Invalid month and day
    await expect(fetchArticles(invalidDate)).rejects.toThrow(
      "Invalid date format"
    );
  });
});
