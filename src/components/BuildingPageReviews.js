/* eslint-disable no-console */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "../styles/building.module.css";

export default function BuildingPageReviews({
  reviews,
  handleBuildingUpdates,
}) {
  const [reviewsState, setReviewsState] = useState(reviews);
  const [likedReviews, setLikedReviews] = useState([]);
  const [sortType, setSortType] = useState("recent");

  useEffect(() => {
    if (reviews.length > 0) {
      const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setReviewsState(sortedReviews);
    }
  }, [reviews]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const sortReviews = (type) => {
    const sortedReviews = [...reviewsState];
    if (type === "recent") {
      sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      sortedReviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    setReviewsState(sortedReviews);
  };

  const handleSortFilterChange = (changeFilterSort) => {
    const newFilterType = changeFilterSort.target.value;
    setSortType(newFilterType);
    sortReviews(newFilterType);
  };

  useEffect(() => {
    const savedLikedReviews = sessionStorage.getItem("likedReviews");
    if (savedLikedReviews) {
      setLikedReviews(JSON.parse(savedLikedReviews));
    }
  }, []);

  const handleLike = async (reviewID) => {
    try {
      const response = await fetch("/api/submitReview", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewID }),
      });

      if (response.ok) {
        const updatedReview = await response.json();

        setReviewsState((prevReviews) =>
          prevReviews.map((review) =>
            review.reviewID === reviewID ? updatedReview : review,
          ),
        );

        const updatedLikedReviews = [...likedReviews, reviewID];
        setLikedReviews(updatedLikedReviews);
        sessionStorage.setItem(
          "likedReviews",
          JSON.stringify(updatedLikedReviews),
        );
      } else {
        console.error("Failed to like the review");
      }
    } catch (error) {
      console.error("Error liking review", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Building Reviews</h2>
      <div className={styles.sortContainer}>
        <label htmlFor="sortSelect">Sort by:</label>
        <select
          id="sortSelect"
          value={sortType}
          onChange={handleSortFilterChange}
          className={styles.sortSelect}
        >
          <option value="recent">Most Recent</option>
          <option value="liked">Most Liked</option>
        </select>
      </div>
      <div className={styles.reviews}>
        {reviewsState.length > 0 ? (
          reviewsState.map((review) => {
            const clickedLike = likedReviews.includes(review.reviewID);
            return (
              <div key={review.reviewID} className={styles.reviewContainer}>
                <div className={styles.reviewContent}>
                  <div className={styles.buildingName}>{review.review}</div>
                  <div className={styles.reviewDate}>
                    {formatDate(review.date)}
                  </div>
                  <div className={styles.ratings}>
                    {Object.entries(review.ratings).map(
                      ([category, rating]) => {
                        let ratingClass = "";
                        if (rating <= 2) ratingClass = styles.low;
                        else if (rating <= 4) ratingClass = styles.medium;
                        else if (rating <= 6) ratingClass = styles.medhigh;
                        else ratingClass = styles.high;

                        return (
                          <div
                            key={category}
                            className={`${styles.ratingCircleWrapper} ${ratingClass}`}
                          >
                            <div className={styles.ratingCircle}>
                              <span className={styles.ratingNumber}>
                                {rating}/5⭐
                              </span>
                            </div>
                            <div className={styles.ratingLabel}>{category}</div>
                          </div>
                        );
                      },
                    )}
                  </div>
                  <div className={styles.liked}>
                    <button
                      type="button"
                      className={`${styles.categoryButton} ${
                        clickedLike ? styles.liked : ""
                      }`}
                      onClick={() => handleLike(review.reviewID)}
                      disabled={clickedLike}
                    >
                      {clickedLike ? "👍" : "🤜"}
                    </button>
                    <span className={styles.likeCount}>
                      &nbsp;{review.likes}{" "}
                      {review.likes === 1 ? "Like" : " Likes"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={() => handleBuildingUpdates(review.reviewID)}
                >
                  Save
                </button>
              </div>
            );
          })
        ) : (
          <p>No reviews available for this building.</p>
        )}
      </div>
    </div>
  );
}

BuildingPageReviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      reviewID: PropTypes.number.isRequired,
      userID: PropTypes.string.isRequired,
      review: PropTypes.string.isRequired,
      ratings: PropTypes.shape({
        Overall: PropTypes.number.isRequired,
        Noise: PropTypes.number.isRequired,
        Location: PropTypes.number.isRequired,
        Cleanliness: PropTypes.number.isRequired,
        Accessibility: PropTypes.number.isRequired,
        Storage: PropTypes.number.isRequired,
      }).isRequired,
      buildingID: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleBuildingUpdates: PropTypes.func,
};
