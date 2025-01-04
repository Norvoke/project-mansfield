import Image from "next/legacy/image";
import PropTypes from "prop-types";
import styles from "../styles/building.module.css";

export default function BuildingImage({ buildingPhotoLink, buildingName }) {
  return (
    <div className={styles.buildingImageContainer}>
      <Image
        src={buildingPhotoLink}
        alt={`${buildingName} Image`}
        width={600}
        height={400}
        layout="intrinsic"
      />
    </div>
  );
}

BuildingImage.propTypes = {
  buildingPhotoLink: PropTypes.string.isRequired,
  buildingName: PropTypes.string.isRequired,
};
