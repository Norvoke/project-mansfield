/* eslint-disable no-unused-vars */
// Component responsible for formatting the information per review

import PropTypes from "prop-types";
import styles from "../styles/LiveReviews.module.css";

export default function LiveReview({
  buildingName,
  buildingID,
  buildingCategory,
  rating,
  review,
  date,
  likes,
}) {
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.buildingName}>
        {buildingName || "Unknown Building"}
      </div>
      {/* <div className={styles.buildingCategory}>{buildingCategory || "Unknown Category"}</div> */}
      <div className={styles.rating}>
        {rating ? `${rating}/5⭐` : "No Rating"}
      </div>
      <div className={styles.review}>{review || "No Review Provided"}</div>
      <div className={styles.review}>{formatDate(date)}</div>
      <div className={styles.review}>Likes: {likes}</div>
    </div>
  );
}

LiveReview.propTypes = {
  buildingName: PropTypes.string,
  buildingID: PropTypes.string,
  buildingCategory: PropTypes.string,
  rating: PropTypes.number,
  review: PropTypes.string,
  date: PropTypes.string,
  likes: PropTypes.number,
};
