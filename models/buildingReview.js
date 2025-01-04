import BaseModel from "./BaseModel";

export default class BuildingReview extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "buildingReview";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        reviewID: { type: "integer" },
        userID: { type: "string" },
        review: { type: "string" },
        ratings: { type: "object" },
        buildingID: { type: "string" },
        likes: { type: "integer", default: 0 },
        date: { type: "string", format: "date-time" },
      },
    };
  }
}
