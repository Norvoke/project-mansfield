import React from "react";
import { render, fireEvent, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Building from "@/components/Building";
import { useRouter } from "next/router";

// mock the Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();
const backMock = jest.fn();

useRouter.mockReturnValue({
  query: {},
  back: backMock,
  push: pushMock,
});

// mock react-medium-image-zoom to avoid parsing issues
jest.mock("react-medium-image-zoom", () => {
  function MockZoom() {
    return <div>Mocked Zoom</div>;
  }
  return MockZoom;
});

const currentBuilding = {
  buildingID: "allen",
  buildingName: "Allen Hall",
  floors: ["basement", "floor 1", "floor 2", "floor 3"],
  overview:
    "As the smallest first-year residential building on campus, Allen fosters a close-knit community among its residents.",
  buildingPhotoLink:
    "https://drive.google.com/uc?export=view&id=1kvfOQvVcxpCOwoOqfChR7gXed6hYC1Ha",
  floorPlanLinks: [
    "https://drive.google.com/uc?export=view&id=1v7S-RvPpZC_WpR8o96uNuaB9mGeJCXpk",
    "https://drive.google.com/uc?export=view&id=1ta73JIDfbaMo8zD5AGpmo1vugjEXVTVg",
    "https://drive.google.com/uc?export=view&id=1it7Ct7tFwsoS6cmIW-SOMTKGdfgtPnsG",
    "https://drive.google.com/uc?export=view&id=1epaLG995Eg5D24NYiFor9nuEhbP9sBm6",
  ],
};

const reviews = [
  {
    reviewID: 1,
    userID: "user123",
    review: "Great building, very cozy!",
    ratings: {
      Overall: 4,
      Noise: 3,
      Location: 5,
      Cleanliness: 4,
      Accessibility: 4,
      Storage: 3,
    },
    buildingID: "allen",
  },
];

const averageRatings = {
  Overall: 4.0,
  Noise: 3.5,
  Location: 4.5,
  Cleanliness: 4.0,
  Accessibility: 4.0,
  Storage: 3.5,
};

describe("Building Component", () => {
  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });
  test("Smoke Test", () => {
    render(
      <Building
        currentBuilding={currentBuilding}
        reviews={reviews}
        averageRatings={averageRatings}
      />,
    );
  });

  test("Building name and overviews are displayed", () => {
    render(
      <Building
        currentBuilding={currentBuilding}
        reviews={reviews}
        averageRatings={averageRatings}
      />,
    );

    expect(screen.getByText(currentBuilding.buildingName)).toBeInTheDocument();
    expect(screen.getByText(currentBuilding.overview)).toBeInTheDocument();
  });

  test("Clicking on 'Review' navigates to the review page", () => {
    render(
      <Building
        currentBuilding={currentBuilding}
        reviews={reviews}
        averageRatings={averageRatings}
      />,
    );

    const reviewButton = screen.getByText("Add a Review");
    fireEvent.click(reviewButton);
    expect(pushMock).toHaveBeenCalledWith(`/buildings/allen/review`);
  });

  test("Floors are listed correctly", () => {
    render(
      <Building
        currentBuilding={currentBuilding}
        reviews={reviews}
        averageRatings={averageRatings}
      />,
    );

    currentBuilding.floors.forEach((floor) => {
      expect(screen.getByText(floor)).toBeInTheDocument();
    });
  });

  test("Clicking floor plan name displays the associated floor plan image", () => {
    render(
      <Building
        currentBuilding={currentBuilding}
        reviews={reviews}
        averageRatings={averageRatings}
      />,
    );

    const floorButton = screen.getByText("basement");
    fireEvent.click(floorButton);
    expect(screen.findByAltText(`basement Floor Plan`));
  });
  test("Back button reroutes to home page", () => {
    render(
      <Building
        currentBuilding={currentBuilding}
        reviews={reviews}
        averageRatings={averageRatings}
      />,
    );
    const back = screen.getByText("Back");
    fireEvent.click(back);
    expect(backMock).toHaveBeenCalledWith();
  });
  test("Renders error page when no building is found", () => {
    render(
      <Building
        currentBuilding={null}
        reviews={reviews}
        averageRatings={averageRatings}
      />,
    );
    expect(screen.getByText("No building data available.")).toBeInTheDocument();
  });
  test("Average ratings change colors within the correct ranges", () => {
    render(
      <Building
        currentBuilding={currentBuilding}
        reviews={reviews}
        averageRatings={{
          Overall: 4.0,
          Noise: 3.5,
          Location: 2.3,
          Cleanliness: 1.2,
          Accessibility: 4.0,
          Storage: 3.5,
        }}
      />,
    );
    const ratings = screen.getByTestId("BuildingRatings");
    const circles = within(ratings).getAllByTestId("RatingCircle");
    const colors = [
      "ratingCircle high",
      "ratingCircle medhigh",
      "ratingCircle medium",
      "ratingCircle low",
      "ratingCircle high",
      "ratingCircle medhigh",
    ];
    colors.forEach((x, i) => {
      expect(circles[i].className).toBe(x);
    });
  });
});
