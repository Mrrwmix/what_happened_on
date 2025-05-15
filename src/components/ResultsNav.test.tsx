import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ResultsNav from "./ResultsNav";

describe("ResultsNav Component", () => {
  const mockOnNavigate = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all navigation cards", () => {
    render(<ResultsNav onNavigate={mockOnNavigate} onReset={mockOnReset} />);

    // Verify all cards are rendered
    expect(screen.getByText("NY Times Articles")).toBeInTheDocument();
    expect(screen.getByText("Seismic Activity")).toBeInTheDocument();
    expect(screen.getByText("Asteroid Data")).toBeInTheDocument();
    expect(screen.getByText("GB Carbon Intensity")).toBeInTheDocument();

    // Verify descriptions
    expect(
      screen.getByText(/View news articles from this date in history/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explore earthquakes that occurred on this date/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Learn about near-Earth objects from this date/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /View Great Britain's electricity carbon intensity data for this date/
      )
    ).toBeInTheDocument();
  });

  it("navigates to NY Times page when clicking NY Times card", () => {
    render(<ResultsNav onNavigate={mockOnNavigate} onReset={mockOnReset} />);

    const card = screen.getByText("NY Times Articles").closest(".card");
    fireEvent.click(card!);

    expect(mockOnNavigate).toHaveBeenCalledWith("nytimes");
  });

  it("navigates to Earthquakes page when clicking Seismic Activity card", () => {
    render(<ResultsNav onNavigate={mockOnNavigate} onReset={mockOnReset} />);

    const card = screen.getByText("Seismic Activity").closest(".card");
    fireEvent.click(card!);

    expect(mockOnNavigate).toHaveBeenCalledWith("earthquakes");
  });

  it("navigates to Asteroids page when clicking Asteroid Data card", () => {
    render(<ResultsNav onNavigate={mockOnNavigate} onReset={mockOnReset} />);

    const card = screen.getByText("Asteroid Data").closest(".card");
    fireEvent.click(card!);

    expect(mockOnNavigate).toHaveBeenCalledWith("asteroids");
  });

  it("navigates to Carbon Intensity page when clicking GB Carbon Intensity card", () => {
    render(<ResultsNav onNavigate={mockOnNavigate} onReset={mockOnReset} />);

    const card = screen.getByText("GB Carbon Intensity").closest(".card");
    fireEvent.click(card!);

    expect(mockOnNavigate).toHaveBeenCalledWith("carbon-intensity");
  });

  it("calls onReset when clicking the reset button", () => {
    render(<ResultsNav onNavigate={mockOnNavigate} onReset={mockOnReset} />);

    const resetButton = screen.getByText("Choose Another Date");
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });
});
