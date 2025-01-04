/* eslint-disable no-unused-vars, no-console */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import styles from "../../styles/UserPage.module.css";

export default function UserPage({ userID }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [renderReviews, setRenderReviews] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/userID?email=${userID}`);

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.name);
          const test = data.savedReviews ? data.savedReviews : [];

          const results = await Promise.all(
            test.map(async (ID) => {
              const response2 = await fetch(`/api/singleReview?reviewID=${ID}`);

              if (response2.ok) {
                const data2 = await response2.json();
                return { ID, data: data2 }; // Map ID to its result
              }
              return { ID, error: "Failed to fetch data" }; // Handle failed requests
            }),
          );
          setRenderReviews(results);
        } else {
          throw new Error("Error loading user");
        }
      } catch (error) {
        console.error("Error loading user", error);
      }
    };
    if (userID) {
      fetchUser();
    }
  }, [userID]);

  const handleUpdateReviews = async (reviewsData) => {
    console.log("Updating variables data:", reviewsData);

    const response = await fetch(`/api/updateReviews?email=${userID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewsData),
    });

    if (response.ok) {
      console.log("Successfully deleted");
    } else {
      console.error("Failed to update variables");
    }
  };

  const handleDelete = (reviewID) => {
    const newReviews = [...renderReviews].filter(
      (review) => review.ID !== reviewID,
    );
    const reviewIDS = newReviews.map((review) => review.ID);
    setRenderReviews(newReviews);
    handleUpdateReviews(reviewIDS);
  };

  return (
    <div className={styles.userPageContainer}>
      <h1
        className={styles.userPageHeader}
      >{`Welcome ${currentUser || "User"}`}</h1>

      <h2 className={styles.userPageSubHeader}>Your Saved Reviews</h2>

      <ul className={styles.reviewsList}>
        {renderReviews && renderReviews.length > 0 ? (
          renderReviews.map((review) => (
            <li key={review.ID} className={styles.reviewItem}>
              <div>
                <strong>{review.data[0].buildingID}</strong>
              </div>
              <div>{`Rating: ${review.data[0].ratings.Overall} out of 5`}</div>
              <div>{`Likes: ${review.data[0].likes}`}</div>
              <div>{review.data[0].review}</div>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDelete(review.ID)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <div className={styles.reviewItem}>Nothing here</div>
        )}
      </ul>

      <button
        type="button"
        className={styles.button}
        onClick={() => router.back()}
      >
        Back
      </button>
    </div>
  );
}

UserPage.propTypes = {
  userID: PropTypes.string,
};
