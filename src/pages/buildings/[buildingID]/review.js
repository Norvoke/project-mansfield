/* eslint-disable no-console, no-unused-vars */

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Review from "../../../components/BuildingReview";

function ReviewLandingPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const { buildingID } = router.query;
  const [building, setCurrentBuilding] = useState({});
  useEffect(() => {
    if (buildingID) {
      // fetch buildings data
      fetch(`/api/buildings/${buildingID}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("buildingID not found");
          }
          return res.json();
        })
        .then((data) => {
          setCurrentBuilding(data.building);
          /* eslint-disable-next-line no-console */
          console.log(`This is the query: ${buildingID}`);
          /* eslint-disable-next-line no-console */
          console.log(
            `This is the buildingName: ${data.building.buildingName}`,
          );
        });
    }
  }, [buildingID]);

  const handleComplete = async (reviewData) => {
    /* eslint-disable-next-line no-console */
    console.log("Submitting review data:", reviewData);

    const response = await fetch("/api/submitReview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      router.back(); // TODO: Add confirmation banner when returning to home page
    } else {
      console.error("Failed to submit review");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div>
      <Review
        Building={{
          buildingID,
          buildingName: building.buildingName,
          buildingCategory: building.buildingCategory,
        }}
        complete={handleComplete}
        cancel={handleCancel}
      />
    </div>
  );
}

export default ReviewLandingPage;
