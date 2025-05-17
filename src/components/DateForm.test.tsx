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
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows error alert when submitting without a date", () => {
    render(<DateForm onSubmit={mockOnSubmit} />);

    // Submit the form without entering a date
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Check if error alert is shown
    expect(screen.getByText("Please Enter A Valid Date")).toBeInTheDocument();
    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the selected date when form is submitted", () => {
    render(<DateForm onSubmit={mockOnSubmit} />);

    const dateInput = screen.getByLabelText("Date");
    fireEvent.change(dateInput, { target: { value: "2024-03-20" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith("2024-03-20");
    // Error alert should not be shown
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

  it("clears error when valid date is entered after error", () => {
    render(<DateForm onSubmit={mockOnSubmit} />);

    // Submit without date to trigger error
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText("Please Enter A Valid Date")).toBeInTheDocument();

    // Enter a valid date
    const dateInput = screen.getByLabelText("Date");
    fireEvent.change(dateInput, { target: { value: "2024-03-20" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Error should be cleared
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
