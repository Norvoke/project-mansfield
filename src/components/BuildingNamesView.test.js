import React from "react";
import { useRouter } from "next/router";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BuildingNamesView from "@/components/BuildingNamesView";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: () => {},
  push: pushMock,
});

const buildings = [
  { buildingID: "allen", buildingName: "Allen Hall" },
  {
    buildingID: "battell",
    buildingName: "Battell Hall",
  },
  { buildingID: "hepburn", buildingName: "Hepburn Hall" },
];

const handleClick = jest.fn();
describe("Display Buildings", () => {
  test("Smoke Test", () => {
    render(
      <BuildingNamesView
        sortedBuildings={buildings}
        setCurrentBuilding={handleClick}
      />,
    );
  });
  test("Buildings are sorted alphabetically", () => {
    render(
      <BuildingNamesView
        sortedBuildings={buildings}
        setCurrentBuilding={handleClick}
      />,
    );
    const buildingList = screen
      .getAllByRole("button")
      .map((building) => building.textContent);
    expect(buildingList).toEqual([
      buildings[0].buildingName,
      buildings[1].buildingName,
      buildings[2].buildingName,
    ]);
  });
  test("Clicking on a button sends user to building page", () => {
    render(
      <BuildingNamesView
        sortedBuildings={buildings}
        setCurrentBuilding={handleClick}
      />,
    );
    const rats = screen.getByText("Battell Hall");
    fireEvent.click(rats);
    expect(useRouter).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/buildings/battell");
  });
});
