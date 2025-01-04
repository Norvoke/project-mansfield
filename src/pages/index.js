/* eslint-disable no-console, no-unused-vars */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import BuildingFilter from "../components/BuildingFilter";
import ActiveFilter from "../components/ActiveFilter";
import CategoryBar from "../components/CategoryBar";
import ReviewBar from "../components/ReviewBar";

export default function MainApp({ userID }) {
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [activeFilter, setActiveFilter] = useState([]);
  const [liveReviews, setLiveReviews] = useState([]);
  const [tempBuildings, setTempBuildings] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const router = useRouter();

  const updateActiveFilter = (filter) => {
    const newFilter = [...activeFilter];
    if (!newFilter.includes(filter)) {
      newFilter.push(filter);
      setActiveFilter(newFilter);
    }
  };

  const removeFilter = (filter) => {
    const newFilter = [...activeFilter].filter((active) => filter !== active);
    setActiveFilter(newFilter);
  };

  function isSubarray(mainArray, subArray) {
    if (subArray.length === 0) return true; // Empty array is always a subarray
    return subArray.every((tag) => mainArray.includes(tag));
  }

  useEffect(() => {
    if (activeFilter) {
      const filteredBuildings = [...tempBuildings]
        .map((building) =>
          isSubarray(building.tags, activeFilter) ? building : [],
        )
        .filter(Boolean);
      setBuildings(filteredBuildings);
    }
  }, [tempBuildings, activeFilter]);

  return (
    <div>
      <h1 className="midd-zillow-header">Review Housing at Middlebury</h1>
      <div>
        <CategoryBar
          setCurrentBuilding={setCurrentBuilding}
          currentBuilding={currentBuilding}
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
          filters={activeFilter}
          buildings={buildings}
          setTempBuildings={setTempBuildings}
        />
      </div>
      <div data-testid="filter-bar">
        {currentCategory ? (
          <>
            <ActiveFilter
              activeFilter={activeFilter}
              removeFilter={removeFilter}
            />
            <BuildingFilter setActiveFilter={updateActiveFilter} />
          </>
        ) : (
          <div />
        )}
      </div>
      <div>
        <ReviewBar
          liveReviews={liveReviews}
          setLiveReviews={setLiveReviews}
          userID={userID}
        />
      </div>
    </div>
  );
}

MainApp.propTypes = {
  userID: PropTypes.string,
};
