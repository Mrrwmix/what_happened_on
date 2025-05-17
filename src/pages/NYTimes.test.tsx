import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import type { Article } from "../services/nytimes";
import type { Mock } from "vitest";
import NYTimes from "./NYTimes";
import { act } from "react";
import { fetchArticles } from "../services/nytimes";
import moment from "moment";

// Mock the NYTimes service
vi.mock("../services/nytimes", () => ({
  fetchArticles: vi.fn(),
}));

describe("NYTimes Component", () => {
  const mockProps = {
    selectedDate: "2024-03-20",
  };

  const mockArticle: Article = {
    headline: {
      main: "Test Headline",
    },
    abstract: "This is a test article about important events.",
    web_url: "https://example.com/article",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear console.error mock after each test
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("displays the correct date in the header", async () => {
    (fetchArticles as Mock).mockResolvedValue([mockArticle]);

    render(<NYTimes {...mockProps} />);

    expect(
      screen.getByText(
        `NY Times Articles from ${moment(mockProps.selectedDate).format(
          "MMMM D, YYYY"
        )}`
      )
    ).toBeInTheDocument();
  });

  it("shows loading placeholders initially", () => {
    // Setup a promise that won't resolve immediately
    (fetchArticles as Mock).mockImplementation(() => new Promise(() => {}));

    render(<NYTimes {...mockProps} />);

    // Check for loading placeholders
    const titlePlaceholders = screen.getAllByLabelText(
      "article title placeholder"
    );
    const abstractPlaceholders = screen.getAllByLabelText(
      "article abstract placeholder"
    );

    // Verify we have 3 loading articles
    expect(titlePlaceholders).toHaveLength(3);
    expect(abstractPlaceholders).toHaveLength(3);

    // Verify placeholder animations
    [...titlePlaceholders, ...abstractPlaceholders].forEach((placeholder) => {
      expect(placeholder).toHaveClass("placeholder-glow");
    });
  });

  it("transitions from loading to content correctly", async () => {
    let resolvePromise: (value: Article[]) => void;
    const promise = new Promise<Article[]>((resolve) => {
      resolvePromise = resolve;
    });

    (fetchArticles as Mock).mockReturnValue(promise);

    render(<NYTimes {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("article title placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("article abstract placeholder")
    ).toHaveLength(3);

    // Resolve the promise with data
    await act(async () => {
      resolvePromise([mockArticle]);
    });

    // Verify content is displayed
    await waitFor(() => {
      expect(screen.getByText("Test Headline")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test article about important events.")
      ).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("transitions from loading to error state correctly", async () => {
    (fetchArticles as Mock).mockRejectedValue(new Error("API Error"));

    render(<NYTimes {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("article title placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("article abstract placeholder")
    ).toHaveLength(3);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/Failed to load articles/i)).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });

  it("transitions from loading to empty state correctly", async () => {
    (fetchArticles as Mock).mockResolvedValue([]);

    render(<NYTimes {...mockProps} />);

    // Verify loading state
    expect(screen.getAllByLabelText("article title placeholder")).toHaveLength(
      3
    );
    expect(
      screen.getAllByLabelText("article abstract placeholder")
    ).toHaveLength(3);

    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText(/No articles found/i)).toBeInTheDocument();

      // Verify loading placeholders are removed
      const placeholders = screen.queryAllByLabelText("placeholder");
      expect(placeholders).toHaveLength(0);
    });
  });
});
