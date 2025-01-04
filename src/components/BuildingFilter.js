import PropTypes from "prop-types";
import { useState } from "react";

export default function BuildingFilter({ setActiveFilter }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const categories = [
    "Laundry",
    "Parking",
    "Dining Hall",
    "Bike Room",
    "Elevator",
    "Single Gender Floors",
    "Suites",
    "Kitchen",
  ];

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <div className="building-filter">
      <button
        type="button"
        data-testid="building-filter"
        onClick={toggleDropdown}
        className="filter-button"
      >
        {isDropdownVisible ? "Hide Filters" : "Show Filters"}
      </button>
      {isDropdownVisible && (
        <ul className="dropdown" data-testid="dropdown">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => setActiveFilter(category)}
              className="dropdown-item"
            >
              {category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

BuildingFilter.propTypes = {
  setActiveFilter: PropTypes.func.isRequired,
};
