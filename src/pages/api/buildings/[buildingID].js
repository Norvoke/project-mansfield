import { createRouter } from "next-connect";
import { onError } from "../../../lib/middleware";
import Building from "../../../../models/building";
import BuildingReview from "../../../../models/buildingReview";

const router = createRouter();

router.get(async (req, res) => {
  const { buildingID } = req.query;

  // fetch the building by buildingID
  const building = await Building.query()
    .where("buildingID", buildingID)
    .first();

  if (!building) {
    return res.status(404).json({ message: "Building not found" });
  }

  // fetch reviews by buildingID
  const reviews = await BuildingReview.query().where("buildingID", buildingID);

  // calculate average ratings for each category
  const categories = [
    "Overall",
    "Noise",
    "Location",
    "Cleanliness",
    "Accessibility",
    "Storage",
  ];
  const averageRatings = categories.reduce((acc, category) => {
    const total = reviews.reduce(
      (sum, review) => sum + review.ratings[category],
      0,
    );
    // calculate the average ratings and round to 1 decimal place
    acc[category] = reviews.length
      ? Math.round((total / reviews.length) * 10) / 10
      : 0;
    return acc;
  }, {});

  return res.status(200).json({ building, reviews, averageRatings });
});

export default router.handler({ onError });
