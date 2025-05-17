import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DateForm from "./DateForm";

describe("DateForm Component", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any running timers
    vi.clearAllTimers();
  });

  it("renders the form with initial suggestion", () => {
    render(<DateForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Enter")).toBeInTheDocument();
    expect(screen.getByText("your birthday")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
  });

  it("maintains consistent width for suggestions", () => {
    render(<DateForm onSubmit={mockOnSubmit} />);

    const suggestionElement = screen.getByText("your birthday");
    const styles = window.getComputedStyle(suggestionElement);

    expect(styles.minWidth).toBe("300px");
    expect(styles.display).toBe("inline-block");
    expect(styles.whiteSpace).toBe("nowrap");
  });

  it("shows error when date is cleared", () => {
    render(<DateForm onSubmit={mockOnSubmit} />);

    const dateInput = screen.getByLabelText("Date");

    // Initially, there should be no error message
    expect(
      screen.queryByText("Please Enter A Valid Date")
    ).not.toBeInTheDocument();

    // Enter a date first
    fireEvent.change(dateInput, { target: { value: "2024-03-20" } });
    // Then clear it
    fireEvent.change(dateInput, { target: { value: "" } });

    expect(screen.getByText("Please Enter A Valid Date")).toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when a valid date is entered", () => {
    render(<DateForm onSubmit={mockOnSubmit} />);

    const dateInput = screen.getByLabelText("Date");
    fireEvent.change(dateInput, { target: { value: "2024-03-20" } });

    expect(mockOnSubmit).toHaveBeenCalledWith("2024-03-20");
    expect(
      screen.queryByText("Please Enter A Valid Date")
    ).not.toBeInTheDocument();
  });

  it("cycles through date suggestions", async () => {
    vi.useFakeTimers();
    render(<DateForm onSubmit={mockOnSubmit} />);

    // Initial suggestion
    expect(screen.getByText("your birthday")).toBeInTheDocument();

    // Wait for first transition
    await act(async () => {
      vi.advanceTimersByTime(4000);
      // Wait for fade out
      vi.advanceTimersByTime(300);
    });

    // Should show the second suggestion
    expect(screen.getByText("your mother's birthday")).toBeInTheDocument();

    // Wait for another transition
    await act(async () => {
      vi.advanceTimersByTime(4000);
      // Wait for fade out
      vi.advanceTimersByTime(300);
    });

    // Should show the third suggestion
    expect(screen.getByText("your father's birthday")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("shows error when empty and clears it when valid date is entered", () => {
    render(<DateForm onSubmit={mockOnSubmit} />);

    const dateInput = screen.getByLabelText("Date");

    // Initially, there should be no error message
    expect(
      screen.queryByText("Please Enter A Valid Date")
    ).not.toBeInTheDocument();

    // Enter a valid date first to trigger interaction
    fireEvent.change(dateInput, { target: { value: "2024-03-20" } });

    // Then clear it to trigger error
    fireEvent.change(dateInput, { target: { value: "" } });
    expect(screen.getByText("Please Enter A Valid Date")).toBeInTheDocument();

    // Enter a valid date again
    fireEvent.change(dateInput, { target: { value: "2024-03-20" } });
    expect(
      screen.queryByText("Please Enter A Valid Date")
    ).not.toBeInTheDocument();
  });

  it("has proper styling classes for layout", () => {
    const { container } = render(<DateForm onSubmit={mockOnSubmit} />);

    expect(container.firstChild).toHaveClass(
      "container",
      "justify-content-center",
      "align-items-center"
    );
    expect(screen.getByLabelText("Date")).toHaveClass(
      "text-center",
      "mx-auto",
      "form-control"
    );
  });
});
