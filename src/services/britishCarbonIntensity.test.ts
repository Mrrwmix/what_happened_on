import { describe, expect, it } from "vitest";

import { fetchCarbonIntensity } from "./britishCarbonIntensity";

describe("British Carbon Intensity Service", () => {
  it("successfully fetches carbon intensity data", async () => {
    const date = "2024-03-20";
    const data = await fetchCarbonIntensity(date);

    // Log the first few entries to check sorting
    console.log(
      "First 5 entries 'from' times:",
      data.slice(0, 5).map((d) => d.from)
    );

    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      const firstDataPoint = data[0];

      // Check basic structure
      expect(firstDataPoint).toHaveProperty("from");
      expect(firstDataPoint).toHaveProperty("to");
      expect(firstDataPoint).toHaveProperty("intensity");

      // Check intensity structure
      expect(firstDataPoint.intensity).toHaveProperty("forecast");
      expect(typeof firstDataPoint.intensity.forecast).toBe("number");
      expect(firstDataPoint.intensity).toHaveProperty("index");
      expect(firstDataPoint.intensity.index).toMatch(
        /^(very low|low|moderate|high|very high)$/
      );

      // Check generation mix if available
      if ("generationmix" in firstDataPoint) {
        expect(Array.isArray(firstDataPoint.generationmix)).toBe(true);
        if (firstDataPoint.generationmix.length > 0) {
          const firstMix = firstDataPoint.generationmix[0];
          expect(firstMix).toHaveProperty("fuel");
          expect(firstMix).toHaveProperty("perc");
          expect(typeof firstMix.perc).toBe("number");
        }
      }
    }
  });

  it("sorts data chronologically by 'from' timestamp", async () => {
    const date = "2024-03-20";
    const data = await fetchCarbonIntensity(date);

    console.log(
      "All 'from' times in order:",
      data.map((d) => d.from)
    );

    // Check that data is sorted
    expect(data.length).toBeGreaterThan(0);

    // Check consecutive pairs are in order
    for (let i = 1; i < data.length; i++) {
      const prevTime = data[i - 1].from;
      const currTime = data[i].from;
      expect(prevTime <= currTime).toBe(true);
    }

    // Check specific time ranges if data exists
    if (data.length >= 2) {
      // First entry should be earliest in the day
      expect(data[0].from).toMatch(/T00:00Z$/);
      // Last entry should be latest in the day
      expect(data[data.length - 1].from).toMatch(/T23:30Z$/);
    }
  });

  it("handles invalid dates", async () => {
    const invalidDate = "2024-13-45"; // Invalid month and day
    await expect(fetchCarbonIntensity(invalidDate)).rejects.toThrow();
  });

  it("handles empty responses correctly", async () => {
    const futureDate = "2050-12-31";
    const data = await fetchCarbonIntensity(futureDate);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });
});
