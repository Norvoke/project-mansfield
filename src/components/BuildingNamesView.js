/* TitleList.js

This module displays a list of building names and reports when a user clicks on one.

props:
  buildings - an array of objects with buildingName and buildingID properties
  setCurrentBuilding - a callback that expects a buildingID as an argument

*/
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import styles from "../styles/BuildingNamesView.module.css";

function BuildingNamesView({ sortedBuildings, setCurrentBuilding }) {
  const router = useRouter();

  const navigateToBuilding = (buildingID) => {
    setCurrentBuilding(buildingID);
    router.push(`/buildings/${buildingID}`);
  };

  return (
    <div
      className={styles.buildingNamesContainer}
      data-testid="building-names-container"
    >
      <ul className={styles.buildingNames}>
        {sortedBuildings.map((building) => (
          <li key={building.buildingID} className={styles.buildingItem}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault(); // Prevent default HTML behavior
                navigateToBuilding(building.buildingID);
              }}
              className={styles.buildingButton}
              data-testid="building"
            >
              {building.buildingName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

BuildingNamesView.propTypes = {
  sortedBuildings: PropTypes.arrayOf(
    PropTypes.shape({
      buildingID: PropTypes.string.isRequired,
      buildingName: PropTypes.string.isRequired,
      buildingCategory: PropTypes.string,
      overview: PropTypes.string,
      floors: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  setCurrentBuilding: PropTypes.func.isRequired,
};

export default BuildingNamesView;
