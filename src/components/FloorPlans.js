import { useState } from "react";
import PropTypes from "prop-types";
import Zoom from "react-medium-image-zoom";
import Image from "next/legacy/image";
import styles from "../styles/building.module.css";
// note that we should npm install react-medium-image-zoom
// to allow photo zooming
import "react-medium-image-zoom/dist/styles.css";

export default function FloorPlans({ floors, floorPlanLinks }) {
  const [selectedFloor, setSelectedFloor] = useState("");

  // clicking floor item, set state
  const handleFloorClick = (floor) => {
    setSelectedFloor(floor);
  };

  // get the image URL for the selected floor
  const getFloorPlanImage = () => {
    const floorIndex = floors.indexOf(selectedFloor);
    return floorPlanLinks[floorIndex];
  };

  return (
    <div className={styles.floorPlan}>
      <h2>Floor Plans</h2>
      <ul>
        {floors.map((floor) => (
          <li
            key={floor}
            className={`${styles.floorItem} ${selectedFloor === floor ? styles.selected : ""}`}
            onClick={() => handleFloorClick(floor)}
          >
            {floor}
          </li>
        ))}
      </ul>

      {selectedFloor && (
        <div className={styles.floorImageContainer}>
          <Zoom>
            <Image
              src={getFloorPlanImage()}
              alt={`${selectedFloor} Floor Plan`}
              className={styles.floorImage}
              width={800}
              height={600}
              layout="responsive"
            />
          </Zoom>
        </div>
      )}
    </div>
  );
}

FloorPlans.propTypes = {
  floors: PropTypes.arrayOf(PropTypes.string).isRequired,
  floorPlanLinks: PropTypes.arrayOf(PropTypes.string).isRequired,
};
