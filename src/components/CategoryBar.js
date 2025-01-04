/* eslint-disable react-hooks/exhaustive-deps */
/*
  CategoryBar.js

  This component provides the category and building name display that allows the user to 
  browse the available building and select one for display. 

   props:
    setCurrentBuilding - Function to call set current building displayed
    currentBuilding - The building to render
*/

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CategoriesView from "./CategoriesView";
import BuildingNamesView from "./BuildingNamesView";
import BuildingShape from "./BuildingShape";

export default function CategoryBar({
  setCurrentBuilding,
  currentBuilding,
  currentCategory,
  setCurrentCategory,
  buildings,
  setTempBuildings,
}) {
  const [categories] = useState([
    // add , setCategories when the data base is running
    "1st",
    "2nd",
    "Jr & Sr",
    "Special Housing",
  ]);

  useEffect(() => {
    const fetchBuildingNames = async () => {
      try {
        let response;
        if (currentCategory === "Special Housing") {
          response = await fetch(
            `/api/categories?buildingCategory=special&buildingNameOnly`,
          );
        } else if (currentCategory === "Jr & Sr") {
          response = await fetch(
            `/api/categories?buildingCategory=upper&buildingNameOnly`,
          );
        } else {
          response = await fetch(
            `/api/categories?buildingCategory=${currentCategory}&buildingNameOnly`,
          );
        }

        if (response.ok) {
          const data = await response.json();
          setTempBuildings(data);
        } else {
          throw new Error("Error loading building name");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading building name", error);
      }
    };
    if (currentCategory) {
      fetchBuildingNames();
    }
  }, [currentCategory]);

  useEffect(() => {
    // takes two arguments, the function to run and the list of variables to watch for changes (currentBuilding), changing the category if appropriate. the category will change when the building changes, but can then be also changed independently when the user selects a new category.
    if (currentBuilding != null) {
      const newCategory = currentBuilding.buildingCategory;
      setCurrentCategory(newCategory);
    }
  }, [currentBuilding, setCurrentCategory]);

  const updateCategoryOnClick = (category) => {
    setCurrentCategory(category);
    setCurrentBuilding(null);
  };

  // Sort buildings alphabetically by name
  const sortedBuildings = Array.isArray(buildings)
    ? [...buildings].sort((a, b) =>
        (a.buildingName || "").localeCompare(b.buildingName || ""),
      )
    : [];

  return (
    <div className="description">
      <CategoriesView
        categories={categories}
        setCurrentCategory={updateCategoryOnClick}
      />
      {currentCategory ? (
        <BuildingNamesView
          sortedBuildings={sortedBuildings}
          setCurrentBuilding={setCurrentBuilding}
        />
      ) : (
        <p style={{ textAlign: "center", margin: "0 auto" }}>
          Pick a housing category⤴
        </p>
      )}
    </div>
  );
}

CategoryBar.propTypes = {
  currentBuilding: PropTypes.oneOfType([
    BuildingShape,
    PropTypes.oneOf([null]),
  ]),
  setCurrentBuilding: PropTypes.func,
  currentCategory: PropTypes.string,
  setCurrentCategory: PropTypes.func,
  buildings: PropTypes.arrayOf(
    PropTypes.shape({
      buildingID: PropTypes.string.isRequired,
      buildingName: PropTypes.string.isRequired,
      buildingCategory: PropTypes.string,
      overview: PropTypes.string.isRequired,
      floors: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ),
  setTempBuildings: PropTypes.func,
};
