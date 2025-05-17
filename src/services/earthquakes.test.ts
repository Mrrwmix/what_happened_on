import { describe, expect, it } from "vitest";

import { fetchEarthquakes } from "./earthquakes";

describe("Earthquakes Service", () => {
  it("successfully fetches earthquake data from USGS API", async () => {
    const date = "2024-03-20";
    const earthquakes = await fetchEarthquakes(date);

    expect(Array.isArray(earthquakes)).toBe(true);
    if (earthquakes.length > 0) {
      expect(earthquakes[0]).toMatchObject({
        properties: expect.objectContaining({
          place: expect.any(String),
          mag: expect.any(Number),
          time: expect.any(Number),
          url: expect.any(String),
        }),
      });
    }
  });

  it("handles API errors appropriately", async () => {
    const invalidDate = "2024/03/20"; // Wrong format
    await expect(fetchEarthquakes(invalidDate)).rejects.toThrow(
      "Invalid date format"
    );
  });

  it("handles invalid dates", async () => {
    const invalidDate = "2024-13-45"; // Invalid month and day
    await expect(fetchEarthquakes(invalidDate)).rejects.toThrow(
      "Invalid date format"
    );
  });
});
