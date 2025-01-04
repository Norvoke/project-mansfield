// ReviewBar.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import "@testing-library/jest-dom";
import ReviewBar from "./ReviewBar";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve([
        {
          reviewID: 1,
          userID: "fakeID1",
          review: "This is a test",
          ratings: {
            Overall: 4,
            Noise: 3,
            Location: 2,
            Cleanliness: 4,
            Accessibility: 2,
            Storage: 4,
          },
          buildingID: "allen",
        },
      ]),
  }),
);

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: () => {},
  push: pushMock,
});

const mockLiveReviews = [
  {
    reviewID: 1,
    userID: "fakeID1",
    review: "This is a test",
    ratings: {
      Overall: 4,
      Noise: 3,
      Location: 2,
      Cleanliness: 4,
      Accessibility: 2,
      Storage: 4,
    },
    buildingID: "allen",
  },
];

const setLiveReviews = jest.fn();
describe("ReviewBar Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("Render live reviews", async () => {
    render(<ReviewBar liveReviews={[]} setLiveReviews={setLiveReviews} />);
    expect(fetch).toHaveBeenCalledWith("/api/buildings");

    setTimeout(async () => {
      expect(await screen.findByText("This is a test")).toBeInTheDocument();
      expect(await screen.findByText("4/5⭐")).toBeInTheDocument();
    }, 500);
  });
  test("Clicking on live review reroutes to building page", () => {
    render(
      <ReviewBar
        liveReviews={mockLiveReviews}
        setLiveReviews={setLiveReviews}
      />,
    );
    const rev = screen.getByText("This is a test");
    fireEvent.click(rev);
    expect(pushMock).toHaveBeenCalledWith("/buildings/allen");
  });
});

describe("Error Testing", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    );
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });
  test("Error is thrown with invalid response", () => {
    try {
      render(
        <ReviewBar
          liveReviews={mockLiveReviews}
          setLiveReviews={setLiveReviews}
        />,
      );
    } catch (error) {
      expect(error).toEqual("Error loading reviews");
    }
  });
});
