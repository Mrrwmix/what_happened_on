import { describe, expect, it } from "vitest";

import { fetchAsteroids } from "./asteroids";

describe("Asteroids Service", () => {
  it("successfully fetches asteroid data from NASA API", async () => {
    const date = "2024-03-20";
    const asteroids = await fetchAsteroids(date);

    expect(asteroids.length).toBeGreaterThan(0);
    expect(asteroids[0]).toMatchObject({
      name: expect.any(String),
      estimated_diameter: expect.objectContaining({
        meters: expect.objectContaining({
          estimated_diameter_min: expect.any(Number),
          estimated_diameter_max: expect.any(Number),
        }),
      }),
      is_potentially_hazardous_asteroid: expect.any(Boolean),
      close_approach_data: expect.arrayContaining([
        expect.objectContaining({
          miss_distance: expect.objectContaining({
            kilometers: expect.any(String),
          }),
          relative_velocity: expect.objectContaining({
            kilometers_per_hour: expect.any(String),
          }),
        }),
      ]),
      nasa_jpl_url: expect.any(String),
    });
  });

  it("handles API errors appropriately", async () => {
    const invalidDate = "2024/03/20"; // Wrong format
    await expect(fetchAsteroids(invalidDate)).rejects.toThrow(
      "Invalid date format"
    );
  });

  it("handles invalid dates", async () => {
    const invalidDate = "2024-13-45"; // Invalid month and day
    await expect(fetchAsteroids(invalidDate)).rejects.toThrow(
      "Invalid date format"
    );
  });
});
