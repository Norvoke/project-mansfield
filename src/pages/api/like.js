// import { createRouter } from "next-connect";
// import BuildingReview from "../../../models/buildingReview";

// const router = createRouter();

// router.put(async (req, res) => {
//   const { reviewID } = req.query;

//   try {
//     const review = await BuildingReview.query()
//       .where("reviewID", reviewID)
//       .throwIfNotFound();

//     const updatedReview = await review
//       .query()
//       .patchAndFetch({ likes: review.likes + 1 });
//     if (!updatedReview) {
//       return res.status(404).json({ message: "Updated Review not found" });
//     }

//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     return res.status(200).json(updatedReview);
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error("Error updating likes", error);
//     return res.status(500).json({ message: "Error updating likes" });
//   }
// });

// export default router.handler();
