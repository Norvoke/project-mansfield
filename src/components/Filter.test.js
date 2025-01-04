// Testing for BuildingFiler and Active Filter components

import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import BuildingFilter from "@/components/BuildingFilter";
import ActiveFilter from "./ActiveFilter";

describe("Filter", () => {
  beforeEach(() => {});
  test("Clicking toggle reveals dropdown", () => {
    render(<BuildingFilter setActiveFilter={jest.fn()} />);
    expect(screen.getByTestId("building-filter")).toBeInTheDocument();
    const toggle = screen.getByTestId("building-filter");
    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.queryByTestId("dropdown")).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
  });

  test("Clicking on a toggle filter makes it the active filter", () => {
    const mockClick = jest.fn();
    render(<BuildingFilter setActiveFilter={mockClick} />);
    expect(screen.getByTestId("building-filter")).toBeInTheDocument();
    const toggle = screen.getByTestId("building-filter");
    fireEvent.click(toggle);
    expect(screen.queryByTestId("dropdown")).toBeInTheDocument();
    const noise = screen.getByText("Laundry");
    fireEvent.click(noise);
    expect(mockClick).toHaveBeenCalledWith("Laundry");
  });
  test("Clicking on active filter removes it", () => {
    const handleClick = jest.fn();
    render(
      <ActiveFilter
        activeFilter={["Bike Room", "Laundry"]}
        removeFilter={handleClick}
      />,
    );
    const active = screen.getByTestId("active-filter");
    expect(active).toBeInTheDocument();
    const overall = within(active).getByText("Bike Room");
    fireEvent.click(overall);
    expect(handleClick).toHaveBeenCalledWith("Bike Room");
  });
});
