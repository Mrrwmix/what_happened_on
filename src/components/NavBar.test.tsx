import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import NavBar from "./NavBar";

describe("NavBar Component", () => {
  const mockOnBack = vi.fn();
  const mockOnReset = vi.fn();

  it("renders nothing when no buttons are shown", () => {
    const { container } = render(<NavBar />);
    expect(container.firstChild).toBeNull();
  });

  it("renders only Back button when showBack is true", () => {
    render(<NavBar showBack onBack={mockOnBack} />);

    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Reset")).not.toBeInTheDocument();
  });

  it("renders only Reset button when showReset is true", () => {
    render(<NavBar showReset onReset={mockOnReset} />);

    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.queryByText("Back")).not.toBeInTheDocument();
  });

  it("renders both buttons when both flags are true", () => {
    render(
      <NavBar showBack showReset onBack={mockOnBack} onReset={mockOnReset} />
    );

    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("calls onBack when Back button is clicked", () => {
    render(<NavBar showBack onBack={mockOnBack} />);

    fireEvent.click(screen.getByText("Back"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when Reset button is clicked", () => {
    render(<NavBar showReset onReset={mockOnReset} />);

    fireEvent.click(screen.getByText("Reset"));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("has dark theme and fixed top position", () => {
    render(
      <NavBar showBack showReset onBack={mockOnBack} onReset={mockOnReset} />
    );

    const navbar = screen.getByRole("navigation");
    expect(navbar).toHaveClass("bg-dark", "navbar-dark", "fixed-top");
  });

  it("has proper button styling", () => {
    render(
      <NavBar showBack showReset onBack={mockOnBack} onReset={mockOnReset} />
    );

    const backButton = screen.getByText("Back");
    const resetButton = screen.getByText("Reset");

    expect(backButton).toHaveClass("btn-outline-light");
    expect(resetButton).toHaveClass("btn-outline-light");
  });

  it("has proper layout with buttons aligned correctly", () => {
    render(
      <NavBar showBack showReset onBack={mockOnBack} onReset={mockOnReset} />
    );

    const container = screen
      .getByRole("navigation")
      .querySelector(".container-fluid");
    expect(container).toHaveClass("d-flex", "justify-content-between");
  });

  it("includes spacing div for content below navbar", () => {
    render(
      <NavBar showBack showReset onBack={mockOnBack} onReset={mockOnReset} />
    );

    const spacingDiv = screen.getByTestId("navbar-spacing");
    expect(spacingDiv).toHaveStyle({ marginBottom: "60px" });
  });
});
