import { knex } from "../../../knex/knex";

export default async function handler(req, res) {
  const { email } = req.query;

  if (req.method === "PATCH") {
    try {
      const newReviews = req.body;

      await knex("User")
        .where({ email })
        .update({ savedReviews: newReviews })
        /* eslint-disable-next-line no-console */
        .debug(console.log);

      res.status(200).json({ message: "User variables updated successfully" });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error("Error updating user variables:", error);
      res.status(500).json({ message: "Failed to update user variables" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
