import { createRouter } from "next-connect";
import { onError } from "../../../lib/middleware";
import Building from "../../../../models/building";

const router = createRouter();

// GET /api/buildings
router.get(async (req, res) => {
  // fetch all buildings from the database
  const buildings = await Building.query();

  res.status(200).json(buildings);
});

export default router.handler({ onError });
