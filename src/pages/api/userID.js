import { createRouter } from "next-connect";
import Users from "../../../models/Users";

const router = createRouter();

router.get(async (req, res) => {
  const user = await Users.query()
    .where("email", req.query.email)
    .first()
    .throwIfNotFound();
  res.status(200).json(user);
});

export default router.handler();
