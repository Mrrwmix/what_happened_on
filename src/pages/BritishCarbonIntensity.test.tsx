import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import BritishCarbonIntensity from "./BritishCarbonIntensity";
import type { CarbonIntensityData } from "../services/britishCarbonIntensity";
import type { Mock } from "vitest";
import { act } from "react";
import { fetchCarbonIntensity } from "../services/britishCarbonIntensity";

// Mock the carbon intensity service
vi.mock("../services/britishCarbonIntensity", () => ({
  fetchCarbonIntensity: vi.fn(),
}));

describe("BritishCarbonIntensity Component", () => {
  const mockProps = {
    selectedDate: "2024-03-20",
    onBack: vi.fn(),
    onReset: vi.fn(),
  };

  const mockIntensityData: CarbonIntensityData = {
    from: "2024-03-20T00:00Z",
    to: "2024-03-20T00:30Z",
    intensity: {
      forecast: 200,
      actual: 195,
      index: "moderate",
    },
    generationmix: [
      {
        fuel: "gas",
        perc: 30.5,
      },
      {
        fuel: "nuclear",
        perc: 20.0,
      },
      {
        fuel: "wind",
        perc: 35.2,
      },
      {
        fuel: "solar",
        perc: 14.3,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading placeholders initially", () => {
    // Setup a promise that won't resolve immediately
    (fetchCarbonIntensity as Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<BritishCarbonIntensity {...mockProps} />);

    // Check for loading placeholders
    const timePlaceholders = screen.getAllByLabelText(
      "intensity time placeholder"
    );
    const detailsPlaceholders = screen.getAllByLabelText(
      "intensity details placeholder"
    );

    // Verify we have 3 loading intensity blocks
    expect(timePlaceholders).toHaveLength(3);
    expect(detailsPlaceholders).toHaveLength(3);

    // Verify placeholder animations
    [...timePlaceholders, ...detailsPlaceholders].forEach((placeholder) => {
      expect(placeholder).toHaveClass("placeholder-glow");
    });
  });

  it("transitions from loading to content correctly", async () => {
    let resolvePromise: (value: CarbonIntensityData[]) => void;
    const promise = new Promise<CarbonIntensityData[]>((resolve) => {
      resolvePromise = resolve;
    });

    (fetchCarbonIntensity as Mock).mockReturnValue(promise);

    render(<BritishCarbonIntensity {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("intensity time placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("intensity details placeholder")
    ).toHaveLength(3);

    // Resolve the promise with data
    await act(async () => {
      resolvePromise([mockIntensityData]);
    });

    // Verify content is displayed
    await waitFor(() => {
      // Check time display
      expect(screen.getByText(/00:00 - 00:30 UTC/)).toBeInTheDocument();

      // Check intensity values using more specific selectors
      const forecastText = screen.getByText("Forecast:");
      expect(forecastText.parentElement).toHaveTextContent(/200 gCO2\/kWh/);

      const actualText = screen.getByText("Actual:");
      expect(actualText.parentElement).toHaveTextContent(/195 gCO2\/kWh/);

      expect(screen.getByText(/moderate/)).toBeInTheDocument();

      // Check generation mix
      expect(screen.getByText(/gas:/i)).toBeInTheDocument();
      expect(screen.getByText(/30.5%/)).toBeInTheDocument();
      expect(screen.getByText(/nuclear:/i)).toBeInTheDocument();
      expect(screen.getByText(/20.0%/)).toBeInTheDocument();
      expect(screen.getByText(/wind:/i)).toBeInTheDocument();
      expect(screen.getByText(/35.2%/)).toBeInTheDocument();
      expect(screen.getByText(/solar:/i)).toBeInTheDocument();
      expect(screen.getByText(/14.3%/)).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("transitions from loading to error state correctly", async () => {
    (fetchCarbonIntensity as Mock).mockRejectedValue(new Error("API Error"));

    render(<BritishCarbonIntensity {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("intensity time placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("intensity details placeholder")
    ).toHaveLength(3);

    // Wait for error state
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load carbon intensity data/i)
      ).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("transitions from loading to empty state correctly", async () => {
    (fetchCarbonIntensity as Mock).mockResolvedValue([]);

    render(<BritishCarbonIntensity {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("intensity time placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("intensity details placeholder")
    ).toHaveLength(3);

    // Wait for empty state
    await waitFor(() => {
      expect(
        screen.getByText(/No carbon intensity data available/i)
      ).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("handles data without actual intensity value", async () => {
    const dataWithoutActual = {
      ...mockIntensityData,
      intensity: {
        forecast: 200,
        index: "moderate",
      },
    };

    (fetchCarbonIntensity as Mock).mockResolvedValue([dataWithoutActual]);

    render(<BritishCarbonIntensity {...mockProps} />);

    await waitFor(() => {
      const forecastText = screen.getByText("Forecast:");
      expect(forecastText.parentElement).toHaveTextContent(/200 gCO2\/kWh/);
      expect(screen.queryByText(/Actual:/)).not.toBeInTheDocument();
    });
  });

  it("handles missing generation mix data gracefully", async () => {
    const dataWithoutGenerationMix = {
      ...mockIntensityData,
      generationmix: undefined,
    };

    (fetchCarbonIntensity as Mock).mockResolvedValue([
      dataWithoutGenerationMix,
    ]);

    render(<BritishCarbonIntensity {...mockProps} />);

    await waitFor(() => {
      const forecastText = screen.getByText("Forecast:");
      expect(forecastText.parentElement).toHaveTextContent(/200 gCO2\/kWh/);
      expect(screen.queryByText(/Generation Mix:/i)).not.toBeInTheDocument();
    });
  });

  it("displays time ranges in UTC format", async () => {
    const timeData = [
      {
        ...mockIntensityData,
        from: "2024-03-20T12:00Z",
        to: "2024-03-20T12:30Z",
      },
    ];

    (fetchCarbonIntensity as Mock).mockResolvedValue(timeData);

    render(<BritishCarbonIntensity {...mockProps} />);

    await waitFor(() => {
      const timeElement = screen.getByText("12:00 - 12:30 UTC");
      expect(timeElement).toBeInTheDocument();
    });
  });
});
