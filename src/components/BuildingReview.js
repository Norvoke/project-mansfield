import { useState } from "react";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import BuildingShape from "./BuildingShape";
import styles from "../styles/Review.module.css"; // Import the new CSS module

export default function Review({ Building, complete, cancel }) {
  const [review, setReview] = useState("");
  const categories = [
    {
      name: "Overall",
      state: useState(0),
    },
    {
      name: "Noise",
      state: useState(0),
    },
    {
      name: "Location",
      state: useState(0),
    },
    {
      name: "Cleanliness",
      state: useState(0),
    },
    {
      name: "Accessibility",
      state: useState(0),
    },
    {
      name: "Storage",
      state: useState(0),
    },
  ];

  const starRating = categories.map((x) => (
    <div key={x.name} className={styles.categoryWrapper}>
      <p className={styles.categoryLabel}>{x.name}</p>
      <StarRating
        rating={x.state[0]}
        setRating={(rating) => x.state[1](rating)}
      />
    </div>
  ));

  if (!Building) {
    return (
      <div className={styles.noBuildingWrapper}>
        <p className={styles.noBuildingMessage}>
          No building information available
        </p>
        <button type="button" className={styles.cancelButton} onClick={cancel}>
          Cancel
        </button>
      </div>
    );
  }

  const ratings = {};
  categories.forEach((x) => {
    const rate = x.state[0];
    ratings[x.name] = rate;
  });

  return (
    <div className={styles.reviewContainer}>
      <h1 className={styles.buildingTitle}>{Building.buildingName}</h1>
      <div className={styles.ratingsContainer}>{starRating}</div>
      <textarea
        className={styles.reviewTextarea}
        placeholder="Comments (Must be 180 characters or longer to submit)"
        value={review}
        onChange={(x) => setReview(x.target.value)}
        maxLength={500}
      />
      <div className={styles.buttonContainer}>
        {review.length >= 180 && (
          <button
            type="button"
            className={styles.completeButton}
            onClick={() =>
              complete({
                buildingID: Building.buildingID,
                ratings,
                review,
                date: new Date().toISOString(),
              })
            }
          >
            Complete
          </button>
        )}
        <button
          type="button"
          className={`${styles.cancelButton} ${styles.secondaryButton}`}
          onClick={cancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

Review.propTypes = {
  Building: BuildingShape,
  complete: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};
