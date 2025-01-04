/* eslint-disable no-unused-vars, no-console */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import LiveReview from "./LiveReview";
import styles from "../styles/ReviewBar.module.css";

export default function ReviewBar({ liveReviews, setLiveReviews, userID }) {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);

  const buttonStyle = {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  const handleMouseOver = (e) => {
    Object.assign(e.target.style, buttonHoverStyle);
  };

  const handleMouseOut = (e) => {
    Object.assign(e.target.style, { backgroundColor: "#007bff" });
  };
  const [sortType, setSortType] = useState("recent");

  const sortedReviews = useCallback(
    (reviewsToBeSorted, type) => {
      let sorted;
      if (type === "recent") {
        sorted = [...reviewsToBeSorted].sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
      } else {
        sorted = [...reviewsToBeSorted].sort(
          (a, b) => (b.likes || 0) - (a.likes || 0),
        );
      }
      setLiveReviews(sorted);
    },
    [setLiveReviews],
  );

  useEffect(() => {
    const fetchBuildingNames = async () => {
      try {
        const response = await fetch("/api/buildings");
        if (response.ok) {
          const buildings = await response.json();
          const map = {};
          buildings.forEach((building) => {
            map[building.buildingID] = {
              name: building.buildingName,
              category: building.buildingCategory,
            };
          });
          return map;
        }
        throw new Error("Error fetching building names");
      } catch (error) {
        console.error("Error fetching building names", error);
        return {};
      }
    };

    const fetchLiveReviews = async (map) => {
      try {
        const response = await fetch("/api/allReviews");
        if (response.ok) {
          const data = await response.json();

          const updatedReviews = data.map((review) => ({
            ...review,
            buildingName: map[review.buildingID]?.name || "Unknown Building",
            buildingCategory:
              map[review.buildingID]?.category || "Unknown Category",
          }));

          sortedReviews([...updatedReviews], sortType);
        } else {
          throw new Error("Error loading live reviews");
        }
      } catch (error) {
        console.error("Error loading live reviews", error);
      }
    };

    const initialize = async () => {
      const map = await fetchBuildingNames();
      await fetchLiveReviews(map);
    };

    if (liveReviews.length === 0) {
      initialize();
    }
  }, [liveReviews, setLiveReviews, sortType, sortedReviews]);

  const handleSortFilterChange = (changeFilterSort) => {
    const newFilterType = changeFilterSort.target.value;
    setSortType(newFilterType);
    sortedReviews([...liveReviews], newFilterType);
  };

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
                return { ID, data: data2 };
              }
              return { ID, error: "Failed to fetch data" };
            }),
          );
          setReviews(results);
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

  const handleUpdateReviews = async (reviewID) => {
    const newReviews = [...reviews].map((review) => review.ID);

    if (!(reviewID in newReviews)) {
      newReviews.push(reviewID);

      console.log("Updating variables data:", newReviews);

      const response = await fetch(`/api/updateReviews?email=${userID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReviews),
      });

      if (response.ok) {
        console.log("Success");
      } else {
        console.error("Failed to update variables");
      }
    }
  };

  return (
    <div>
      <h3 className="live-reviews-header"> </h3>
      <div className="list-container">
        <ul className="scrollable-list">
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
          {liveReviews.map((review) => (
            <li
              key={review.reviewID}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{ flex: 1, cursor: "pointer" }}
                onClick={() => router.push(`/buildings/${review.buildingID}`)}
              >
                <LiveReview
                  buildingName={review.buildingName}
                  buildingID={review.buildingID}
                  buildingCategory={review.buildingCategory}
                  rating={review.ratings?.Overall}
                  review={review.review}
                  date={review.date}
                  likes={review.likes || 0}
                />
              </div>
              {userID && (
                <button
                  type="button"
                  style={buttonStyle}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={() => handleUpdateReviews(review.reviewID)}
                >
                  Save
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ReviewBar.propTypes = {
  liveReviews: PropTypes.arrayOf(Object),
  setLiveReviews: PropTypes.func,
  userID: PropTypes.string,
};
