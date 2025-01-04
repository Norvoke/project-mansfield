import PropTypes from "prop-types";
import styles from "../styles/building.module.css";

export default function BuildingRatings({ ratings }) {
  // Function to determine the color class based on the rating value
  const getRatingClass = (rating) => {
    if (rating >= 4) return styles.high; // High for rating >= 4
    if (rating >= 3) return styles.medhigh; // Medhigh for 3 <= rating < 4
    if (rating >= 2) return styles.medium; // Medium for 2 <= rating < 3
    return styles.low; // Low for rating < 2
  };

  return (
    <div className={styles.ratings} data-testid="BuildingRatings">
      {/* Rating circles for categories */}
      {Object.entries(ratings).map(([category, rating]) => (
        <div key={category} className={`${styles.ratingCircleWrapper}`}>
          <div
            className={`${styles.ratingCircle} ${getRatingClass(rating)}`}
            data-testid="RatingCircle"
          >
            <div className={styles.ratingNumber}>{rating}</div>
          </div>
          <div className={styles.ratingLabel}>{category}</div>
        </div>
      ))}
    </div>
  );
}

BuildingRatings.propTypes = {
  ratings: PropTypes.shape({
    Noise: PropTypes.number.isRequired,
    Location: PropTypes.number.isRequired,
    Cleanliness: PropTypes.number.isRequired,
    Accessibility: PropTypes.number.isRequired,
    Storage: PropTypes.number.isRequired,
  }).isRequired,
};
