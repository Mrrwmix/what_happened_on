import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import type { Asteroid } from "../services/asteroids";
import Asteroids from "./Asteroids";
import type { Mock } from "vitest";
import { act } from "react";
import { fetchAsteroids } from "../services/asteroids";

// Mock the asteroids service
vi.mock("../services/asteroids", () => ({
  fetchAsteroids: vi.fn(),
}));

describe("Asteroids Component", () => {
  const mockProps = {
    selectedDate: "2024-03-20",
    onBack: vi.fn(),
    onReset: vi.fn(),
  };

  const mockAsteroid: Asteroid = {
    name: "Test Asteroid",
    estimated_diameter: {
      meters: {
        estimated_diameter_min: 100,
        estimated_diameter_max: 200,
      },
    },
    is_potentially_hazardous_asteroid: false,
    close_approach_data: [
      {
        miss_distance: {
          kilometers: "1000000",
        },
        relative_velocity: {
          kilometers_per_hour: "50000",
        },
      },
    ],
    nasa_jpl_url: "https://example.com/asteroid",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading placeholders initially", () => {
    // Setup a promise that won't resolve immediately
    (fetchAsteroids as Mock).mockImplementation(() => new Promise(() => {}));

    render(<Asteroids {...mockProps} />);

    // Check for loading placeholders
    const namePlaceholders = screen.getAllByLabelText(
      "asteroid name placeholder"
    );
    const detailsPlaceholders = screen.getAllByLabelText(
      "asteroid details placeholder"
    );

    // Verify we have 3 loading asteroids
    expect(namePlaceholders).toHaveLength(3);
    expect(detailsPlaceholders).toHaveLength(3);

    // Verify placeholder animations
    [...namePlaceholders, ...detailsPlaceholders].forEach((placeholder) => {
      expect(placeholder).toHaveClass("placeholder-glow");
    });
  });

  it("transitions from loading to content correctly", async () => {
    let resolvePromise: (value: Asteroid[]) => void;
    const promise = new Promise<Asteroid[]>((resolve) => {
      resolvePromise = resolve;
    });

    (fetchAsteroids as Mock).mockReturnValue(promise);

    render(<Asteroids {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("asteroid name placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("asteroid details placeholder")
    ).toHaveLength(3);

    // Resolve the promise with data
    await act(async () => {
      resolvePromise([mockAsteroid]);
    });

    // Verify content is displayed
    await waitFor(() => {
      expect(screen.getByText("Test Asteroid")).toBeInTheDocument();
      expect(screen.getByText(/100 - 200 meters/i)).toBeInTheDocument();
      expect(screen.getByText(/1,000,000 km/i)).toBeInTheDocument();
      expect(screen.getByText(/50,000 km\/h/i)).toBeInTheDocument();
      expect(screen.getByText("No")).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("transitions from loading to error state correctly", async () => {
    (fetchAsteroids as Mock).mockRejectedValue(new Error("API Error"));

    render(<Asteroids {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("asteroid name placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("asteroid details placeholder")
    ).toHaveLength(3);

    // Wait for error state
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load asteroid data/i)
      ).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("transitions from loading to empty state correctly", async () => {
    (fetchAsteroids as Mock).mockResolvedValue([]);

    render(<Asteroids {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("asteroid name placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("asteroid details placeholder")
    ).toHaveLength(3);

    // Wait for empty state
    await waitFor(() => {
      expect(
        screen.getByText(/No asteroid data available/i)
      ).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });
});
