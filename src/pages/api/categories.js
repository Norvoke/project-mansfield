import { createRouter } from "next-connect";
import Building from "../../../models/building";

const router = createRouter();

router.get(async (req, res) => {
  const buildingCategories = await Building.query()
    .where("buildingCategory", req.query.buildingCategory)
    .throwIfNotFound();
  res.status(200).json(buildingCategories);
});

export default router.handler();
