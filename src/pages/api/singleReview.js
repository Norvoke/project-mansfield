import { createRouter } from "next-connect";
import BuildingReview from "../../../models/buildingReview";

const router = createRouter();

router.get(async (req, res) => {
  const review = await BuildingReview.query()
    .where("reviewID", req.query.reviewID)
    .throwIfNotFound();
  res.status(200).json(review);
});

export default router.handler();
