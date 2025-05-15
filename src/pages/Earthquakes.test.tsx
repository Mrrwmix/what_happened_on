import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import type { Earthquake } from "../services/earthquakes";
import Earthquakes from "./Earthquakes";
import type { Mock } from "vitest";
import { act } from "react";
import { fetchEarthquakes } from "../services/earthquakes";

// Mock the earthquakes service
vi.mock("../services/earthquakes", () => ({
  fetchEarthquakes: vi.fn(),
}));

describe("Earthquakes Component", () => {
  const mockProps = {
    selectedDate: "2024-03-20",
    onBack: vi.fn(),
    onReset: vi.fn(),
  };

  const mockEarthquake: Earthquake = {
    properties: {
      place: "Test Location",
      mag: 5.5,
      time: 1710907080000, // March 20, 2024
      url: "https://example.com/earthquake",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading placeholders initially", () => {
    // Setup a promise that won't resolve immediately
    (fetchEarthquakes as Mock).mockImplementation(() => new Promise(() => {}));

    render(<Earthquakes {...mockProps} />);

    // Check for loading placeholders
    const locationPlaceholders = screen.getAllByLabelText(
      "earthquake location placeholder"
    );
    const detailsPlaceholders = screen.getAllByLabelText(
      "earthquake details placeholder"
    );

    // Verify we have 3 loading earthquakes
    expect(locationPlaceholders).toHaveLength(3);
    expect(detailsPlaceholders).toHaveLength(3);

    // Verify placeholder animations
    [...locationPlaceholders, ...detailsPlaceholders].forEach((placeholder) => {
      expect(placeholder).toHaveClass("placeholder-glow");
    });
  });

  it("transitions from loading to content correctly", async () => {
    let resolvePromise: (value: Earthquake[]) => void;
    const promise = new Promise<Earthquake[]>((resolve) => {
      resolvePromise = resolve;
    });

    (fetchEarthquakes as Mock).mockReturnValue(promise);

    render(<Earthquakes {...mockProps} />);

    // Verify loading state
    expect(
      screen.getAllByLabelText("earthquake location placeholder")
    ).toHaveLength(3);
    expect(
      screen.getAllByLabelText("earthquake details placeholder")
    ).toHaveLength(3);

    // Resolve the promise with data
    await act(async () => {
      resolvePromise([mockEarthquake]);
    });

    // Verify content is displayed
    await waitFor(() => {
      expect(screen.getByText("Test Location")).toBeInTheDocument();
      expect(screen.getByText(/5.5/)).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("transitions from loading to error state correctly", async () => {
    (fetchEarthquakes as Mock).mockRejectedValue(new Error("API Error"));

    render(<Earthquakes {...mockProps} />);

    // Verify loading state
    expect(
      screen.getAllByLabelText("earthquake location placeholder")
    ).toHaveLength(3);
    expect(
      screen.getAllByLabelText("earthquake details placeholder")
    ).toHaveLength(3);

    // Wait for error state
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load earthquake data/i)
      ).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("transitions from loading to empty state correctly", async () => {
    (fetchEarthquakes as Mock).mockResolvedValue([]);

    render(<Earthquakes {...mockProps} />);

    // Verify loading state
    expect(
      screen.getAllByLabelText("earthquake location placeholder")
    ).toHaveLength(3);
    expect(
      screen.getAllByLabelText("earthquake details placeholder")
    ).toHaveLength(3);

    // Wait for empty state
    await waitFor(() => {
      expect(
        screen.getByText(/No significant earthquakes recorded/i)
      ).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });
});
