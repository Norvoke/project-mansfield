import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/building.module.css";
import Ratings from "./BuildingRatings";
import FloorPlans from "./FloorPlans";
import BuildingPageReviews from "./BuildingPageReviews";
import BuildingImage from "./BuildingImage";

export default function Building({
  currentBuilding,
  reviews,
  averageRatings,
  userID,
}) {
  const [reviewsUser, setReviewsUser] = useState([]);

  if (!currentBuilding) {
    return <div>No building data available.</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const { buildingName, floors, overview, buildingPhotoLink, floorPlanLinks } =
    currentBuilding;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/userID?email=${userID}`);

        if (response.ok) {
          const data = await response.json();
          const userSavedReviews = data.savedReviews ? data.savedReviews : [];

          const results = await Promise.all(
            userSavedReviews.map(async (ID) => {
              const response2 = await fetch(`/api/singleReview?reviewID=${ID}`);

              if (response2.ok) {
                const data2 = await response2.json();
                return { ID, data: data2 }; // Map ID to its result
              }
              return { ID, error: "Failed to fetch data" }; // Handle failed requests
            }),
          );
          setReviewsUser(results);
        } else {
          throw new Error("Error loading user");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading user", error);
      }
    };
    if (userID) {
      fetchUser();
    }
  }, [userID]);

  const handleUpdateReviews = async (reviewID) => {
    const newReviews = [...reviewsUser].map((review) => review.ID);

    if (!(reviewID in newReviews)) {
      newReviews.push(reviewID);

      /* eslint-disable-next-line no-console */
      console.log("Updating variables data:", newReviews);

      const response = await fetch(`/api/updateReviews?email=${userID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReviews),
      });

      if (response.ok) {
        /* eslint-disable-next-line no-console */
        console.log("Success");
      } else {
        /* eslint-disable-next-line no-console */
        console.log(response);
        /* eslint-disable-next-line no-console */
        console.error("Failed to update variables");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>{buildingName}</h1>
      </div>

      <div>
        <button
          type="button"
          className={styles.addReviewButton}
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>

      <Ratings ratings={averageRatings} />

      <div className={styles.contentSection}>
        <BuildingImage
          buildingPhotoLink={buildingPhotoLink}
          buildingName={buildingName}
        />
        <FloorPlans floors={floors} floorPlanLinks={floorPlanLinks} />
      </div>

      <div className={styles.overview}>
        <h2>Building Overview</h2>
        <p>{overview}</p>
      </div>

      <button
        type="button"
        className={styles.addReviewButton}
        onClick={() =>
          router.push(`/buildings/${currentBuilding.buildingID}/review`)
        }
      >
        Add a Review
      </button>

      <BuildingPageReviews
        reviews={reviews}
        handleBuildingUpdates={handleUpdateReviews}
        userID={userID}
      />
    </div>
  );
}

Building.propTypes = {
  currentBuilding: PropTypes.shape({
    buildingID: PropTypes.string.isRequired,
    buildingName: PropTypes.string.isRequired,
    floors: PropTypes.arrayOf(PropTypes.string).isRequired,
    overview: PropTypes.string.isRequired,
    buildingPhotoLink: PropTypes.string.isRequired,
    floorPlanLinks: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      reviewID: PropTypes.number.isRequired,
      userID: PropTypes.string.isRequired,
      review: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      ratings: PropTypes.shape({
        Overall: PropTypes.number.isRequired,
        Noise: PropTypes.number.isRequired,
        Location: PropTypes.number.isRequired,
        Cleanliness: PropTypes.number.isRequired,
        Accessibility: PropTypes.number.isRequired,
        Storage: PropTypes.number.isRequired,
      }).isRequired,
      buildingID: PropTypes.string.isRequired,
    }),
  ).isRequired,
  averageRatings: PropTypes.shape({
    Overall: PropTypes.number.isRequired,
    Noise: PropTypes.number.isRequired,
    Location: PropTypes.number.isRequired,
    Cleanliness: PropTypes.number.isRequired,
    Accessibility: PropTypes.number.isRequired,
    Storage: PropTypes.number.isRequired,
  }).isRequired,
  userID: PropTypes.string,
};
