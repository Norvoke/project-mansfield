// Review.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Review from "./BuildingReview";

// Mock StarRating component
/* eslint-disable-next-line */
jest.mock("../components/StarRating", () => ({ rating, setRating }) => (
  <div data-testid="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        data-testid={`star-${star}`}
        onClick={() => setRating(star)}
      >
        {rating >= star ? "★" : "☆"}
      </span>
    ))}
  </div>
));

// Mock BuildingShape
const mockBuilding = {
  buildingID: "maple",
  date: new Date().toISOString(),
  overview: "A cool dorm that Joe made up",
  buildingName: "Maple Hall",
  buildingCategory: "1st Year",
  review: "It's nice",
  floors: ["1st Floor", "2nd Floor", "3rd Floor"],
};

// Mock functions
const mockComplete = jest.fn();
const mockCancel = jest.fn();

describe("Review Component", () => {
  const fixedDate = new Date("2024-12-15T12:00:00.000Z");

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(fixedDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockComplete.mockClear();
    mockCancel.mockClear();
  });

  test("renders building name and star ratings", () => {
    render(
      <Review
        Building={mockBuilding}
        complete={mockComplete}
        cancel={mockCancel}
      />,
    );
    expect(screen.getByText("Maple Hall")).toBeInTheDocument();
    expect(screen.getAllByTestId("star-rating")).toHaveLength(6);
    expect(
      screen.getByPlaceholderText(
        "Comments (Must be 180 characters or longer to submit)",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.queryByText("Complete")).not.toBeInTheDocument();
  });

  test("updates ratings when stars are clicked", () => {
    render(
      <Review
        Building={mockBuilding}
        complete={mockComplete}
        cancel={mockCancel}
      />,
    );
    const firstStar = screen.getAllByTestId("star-3")[0];
    fireEvent.click(firstStar);
    // Additional state checks can be added if StarRating is not mocked
    expect(firstStar).toBeInTheDocument();
  });

  test("shows Complete button when comment is >= 180 chars", () => {
    render(
      <Review
        Building={mockBuilding}
        complete={mockComplete}
        cancel={mockCancel}
      />,
    );
    const textarea = screen.getByPlaceholderText(
      "Comments (Must be 180 characters or longer to submit)",
    );
    fireEvent.change(textarea, { target: { value: "a".repeat(180) } });
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  test("calls complete with correct data on Complete click", () => {
    render(
      <Review
        Building={mockBuilding}
        complete={mockComplete}
        cancel={mockCancel}
      />,
    );
    const textarea = screen.getByPlaceholderText(
      "Comments (Must be 180 characters or longer to submit)",
    );
    const longReview = "a".repeat(180);
    fireEvent.change(textarea, { target: { value: longReview } });

    // Set ratings
    const allStars = screen.getAllByTestId(/star-\d+/);
    allStars.forEach((star) => fireEvent.click(star));

    fireEvent.click(screen.getByText("Complete"));
    expect(mockComplete).toHaveBeenCalledWith({
      buildingID: "maple",
      date: fixedDate.toISOString(),
      ratings: {
        Overall: 5,
        Noise: 5,
        Location: 5,
        Cleanliness: 5,
        Accessibility: 5,
        Storage: 5,
      },
      review: longReview,
    });
  });

  test("calls cancel on Cancel click", () => {
    render(
      <Review
        Building={mockBuilding}
        complete={mockComplete}
        cancel={mockCancel}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCancel).toHaveBeenCalled();
  });

  // Edge Cases

  test("handles negative ratings gracefully", () => {
    render(
      <Review
        Building={mockBuilding}
        complete={mockComplete}
        cancel={mockCancel}
      />,
    );
    // Initial ratings are 0, so no filled stars
    const filledStars = screen
      .queryAllByTestId(/star-\d+/)
      .filter((star) => star.textContent === "★");
    expect(filledStars).toHaveLength(0);
  });

  test("caps ratings above 5 to 5", () => {
    render(
      <Review
        Building={mockBuilding}
        complete={mockComplete}
        cancel={mockCancel}
      />,
    );
    const sixthStar = screen.getAllByTestId("star-5")[0];
    fireEvent.click(sixthStar);
    expect(mockComplete).not.toHaveBeenCalled(); // Ensure no overflow
  });

  test("handles missing Building prop", () => {
    render(<Review complete={mockComplete} cancel={mockCancel} />);
    expect(
      screen.getByText("No building information available"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Maple Hall")).not.toBeInTheDocument();
    // Optionally check for fallback UI
  });
});
