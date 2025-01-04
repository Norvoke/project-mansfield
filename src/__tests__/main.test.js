import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
  act,
} from "@testing-library/react";
import { useRouter } from "next/router";
import MainApp from "@/pages/index";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: () => {},
  push: pushMock,
});

const mockedResponses = {
  buildings: [
    {
      buildingID: "allen",
      buildingName: "Allen Hall",
      buildingCategory: "1st",
      floors: ["Floor 1", "Floor 2"],
      overview: "This is a test",
      buildingPhotoLink: "Still a test",
      floorPlanLinks: ["www.thisisatest.com", "www.stillatest.com"],
    },
    {
      buildingID: "starr",
      buildingName: "Starr Hall",
      buildingCategory: "upper",
      floors: ["Floor 1", "Floor 2"],
      overview: "This is a test",
      buildingPhotoLink: "Still a test",
      floorPlanLinks: ["www.thisisatest.com", "www.stillatest.com"],
    },
    {
      buildingID: "innonthegreen",
      buildingName: "Inn on the Green",
      buildingCategory: "special",
      floors: ["Floor 1", "Floor 2"],
      overview: "This is a test",
      buildingPhotoLink: "Still a test",
      floorPlanLinks: ["www.thisisatest.com", "www.stillatest.com"],
    },
  ],
  reviews: [
    {
      reviewID: 1,
      userID: "Tester",
      review: "I literally love testing so much I hope to do it forever",
      ratings: { Quality: 0, Fun: 0, Coverage: 0 },
      buildingID: "Starr",
    },
  ],
};

global.fetch = jest.fn((url) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve(
        url.toLowerCase().includes("reviews")
          ? mockedResponses.reviews
          : mockedResponses.buildings.filter(
              (cat) =>
                cat.buildingCategory === url?.split("=")[1]?.split("&")[0],
            ),
      ),
  }),
);
global.setLiveReviews = jest.fn();
global.removeFilters = jest.fn();
describe("End-to-end testing", () => {
  test("Render index.js component", async () => {
    await waitFor(() => render(<MainApp />));
  });
  test("Selecting a new tag adds it to the current tags", async () => {
    render(<MainApp />);
    const first = screen.getByText("1st");
    await waitFor(() => fireEvent.click(first));
    const toggle = screen.getByText("Show Filters");
    await waitFor(() => fireEvent.click(toggle));
    const toggleLaundry = screen.getByText("Laundry");
    setTimeout(async () => {
      await waitFor(() => fireEvent.click(toggleLaundry));
      const active = screen.getByTestId("active-filter");
      expect(within(active).getByText("Laundry")).toBeInTheDocument();
      const toggleBike = screen.getByText("Bike Room");
      expect(within(active).queryByText("Bike Room")).not.toBeInTheDocument();
      await waitFor(() => fireEvent.click(toggleBike));
      expect(within(active).getByText("Bike Room")).toBeInTheDocument();
      expect(within(active).getByText("Laundry")).toBeInTheDocument();
    }, 500);
  });

  test("Selecting a category displays a list of buildings", async () => {
    act(() => render(<MainApp />));
    const first = screen.getByText("1st");
    let namesContainer = screen.queryByTestId("building-names-container");
    expect(namesContainer).not.toBeInTheDocument();
    await waitFor(() => fireEvent.click(first));
    namesContainer = screen.getByTestId("building-names-container");
    expect(namesContainer).toBeInTheDocument();
  });
  test("Changing current category renders new buildings", async () => {
    act(() => render(<MainApp />));
    const first = screen.getByText("1st");
    await waitFor(() => fireEvent.click(first));
    const namesContainer = screen.getByTestId("building-names-container");

    setTimeout(async () => {
      const allen = within(namesContainer).getByText("Allen Hall");
      expect(allen).toBeInTheDocument();
      const upper = screen.getByText("Upperclassmen");
      await waitFor(() => fireEvent.click(upper));
      const starr = within(namesContainer).getByText("Starr Hall");
      expect(starr).toBeInTheDocument();
      expect(allen).not.toBeInTheDocument();
      const special = await screen.findByText("Special Housing");
      await waitFor(() => fireEvent.click(special));
      expect(starr).not.toBeInTheDocument();
      const inn = within(namesContainer).getByText("Inn on the Green");
      expect(inn).toBeInTheDocument();
      await waitFor(() => fireEvent.click(first));
      expect(
        within(namesContainer).getByText("Allen Hall"),
      ).toBeInTheDocument();
      expect(starr).not.toBeInTheDocument();
    }, 500);
  });
});
