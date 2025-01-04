import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Building from "../../components/Building";

export default function BuildingPage({ userID }) {
  const router = useRouter();
  const { buildingID } = router.query; // Gets buildingID from the URL
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [averageRatings, setAverageRatings] = useState(null);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    if (buildingID) {
      // fetch buildings data
      fetch(`/api/buildings/${buildingID}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not OK");
          }
          return res.json();
        })
        .then((data) => {
          setCurrentBuilding(data.building);
          setAverageRatings(data.averageRatings);
          setReviews(data.reviews);
        });
    }
  }, [buildingID]);

  if (!currentBuilding || !averageRatings || !reviews) return <p>Loading...</p>;

  return (
    <Building
      currentBuilding={currentBuilding}
      averageRatings={averageRatings}
      reviews={reviews}
      userID={userID}
    />
  );
}

BuildingPage.propTypes = {
  userID: PropTypes.string,
};
