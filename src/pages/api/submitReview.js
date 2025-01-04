// Will need to change this to store data in database. Just some default found online before that is set up.
import { knex } from "../../../knex/knex";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const reviewData = req.body;
    const { buildingID, ratings, review, likes = 0, date } = reviewData;
    const userID = "placeholder";

    await knex("buildingReview").insert({
      userID,
      review,
      ratings: JSON.stringify(ratings),
      buildingID,
      likes,
      date,
    });

    return res.status(200).json({ message: "Review submitted successfully" });
  }
  if (req.method === "PUT") {
    const reviewData = req.body;
    const { reviewID } = reviewData;

    if (!reviewID) {
      res.status(404).json({ message: "Review not found" });
    }

    try {
      const existingReview = await knex("buildingReview")
        .where({ reviewID })
        .first();

      if (!existingReview) {
        res.status(404).json({ message: "Review not found" });
      }

      const newLikes = existingReview.likes + 1;

      await knex("buildingReview").where({ reviewID }).update({
        likes: newLikes,
      });

      const updatedReview = await knex("buildingReview")
        .where({ reviewID })
        .first();

      return res.status(200).json(updatedReview);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error editing review:", error);
      return res.status(500).json({ message: "Error editing review" });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
