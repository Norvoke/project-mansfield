import { createRouter } from "next-connect";
import BuildingReview from "../../../models/buildingReview";

const router = createRouter();

router.get(async (req, res) => {
  const buildingCategories = await BuildingReview.query().throwIfNotFound();
  res.status(200).json(buildingCategories);
});

export default router.handler();
