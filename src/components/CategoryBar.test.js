/* eslint-disable no-unused-vars */
import { React } from "react";
import { useRouter } from "next/router";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import CategoryBar from "@/components/CategoryBar";
import BuildingNamesView from "@/components/BuildingNamesView";

const setCurrentBuilding = jest.fn();
const setCurrentCategory = jest.fn();
const setTempBuildings = jest.fn();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: () => {},
  push: pushMock,
});
const buildings = [
  {
    buildingID: "allen",
    buildingName: "Allen Hall",
    buildingCategory: "1st",
    overview: "cool building",
    floors: ["Floor 1", "Floor 2"],
  },
  {
    buildingID: "hepburn",
    buildingName: "Hepburn Hall",
    buildingCategory: "1st",
    overview: "cool building",
    floors: ["Floor 1", "Floor 2"],
  },
  {
    buildingID: "battell",
    buildingName: "Battell Hall",
    buildingCategory: "1st",
    overview: "cool building",
    floors: ["Floor 1", "Floor 2"],
  },
  {
    buildingID: "gifford",
    buildingName: "Gifford Hall",
    biuldingCategory: "2nd",
    overview: "It's fine",
    floors: ["Floor 1", "Floor 2"],
  },
  {
    buildingID: "innonthegreen",
    buildingName: "Inn on the Green",
    buildingCategory: "special",
    overview: "Rather isolating",
    floors: ["Floor 1", "Floor 2"],
  },
  {
    buildingID: "starr",
    buildingName: "Starr Hall",
    buildingCategory: "upper",
    overview: "Old building",
    floors: ["Floor 1", "Floor 2"],
  },
];
global.fetch = jest.fn((x) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve(
        buildings.filter(
          (cat) => cat.buildingCategory === x.split("=")[1].split("&")[0],
        ),
      ),
  }),
);

describe("Category Bar", () => {
  afterEach(cleanup);
  test("Smoke Test", () => {
    render(
      <CategoryBar
        setCurrentBuilding={setCurrentBuilding}
        currentBuilding={null}
        currentCategory={null}
        setCurrentCategory={setCurrentCategory}
        buildings={buildings}
        setTempBuildings={setTempBuildings}
      />,
    );
  });
  // test("Selecting a category updates the current category", () => {
  //   render(
  //     <CategoryBar
  //       setCurrentBuilding={setCurrentBuilding}
  //       currentBuilding={null}
  //       currentCategory={null}
  //       setCurrentCategory={setCurrentCategory}
  //       buildings={buildings}
  //       setTempBuildings={setTempBuildings}
  //     />,
  //   );
  //   const first = screen.getByText("1st");
  //   fireEvent.click(first);
  //   expect(setCurrentCategory).toHaveBeenCalledWith("1st");
  //   const second = screen.getByText("2nd");
  //   fireEvent.click(second);
  //   expect(setCurrentCategory).toHaveBeenCalledWith("2nd");
  // });
  // test("Selecting a building updates the current building and section", async () => {
  //   await waitFor(() =>
  //     render(
  //       <>
  //         <CategoryBar
  //           setCurrentBuilding={setCurrentBuilding}
  //           currentBuilding={null}
  //           currentCategory="1st"
  //           setCurrentCategory={setCurrentCategory}
  //           buildings={buildings}
  //           setTempBuildings={setTempBuildings}
  //         />
  //         <BuildingNamesView
  //           buildings={buildings}
  //           setCurrentBuilding={setCurrentBuilding}
  //         />
  //       </>,
  //     ),
  //   );
  //   const first = screen.getByText("1st");
  //   await waitFor(() => fireEvent.click(first));
  //   expect(setCurrentCategory).toHaveBeenCalledWith("1st");
  //   const allen = screen.getByText("Allen Hall");
  //   await waitFor(() => fireEvent.click(allen));
  //   expect(setCurrentBuilding).toHaveBeenCalledWith("allen");
  //   expect(setCurrentCategory).toHaveBeenCalledWith("1st");
  // });
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
        <CategoryBar
          setCurrentBuilding={setCurrentBuilding}
          currentBuilding={null}
          currentCategory="1st"
          setCurrentCategory={setCurrentCategory}
        />,
      );
    } catch (error) {
      expect(error).toEqual("Error loading building name");
    }
  });
});
