import BaseModel from "./BaseModel";

export default class Building extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "building";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        buildingID: { type: "string" },
        buildingName: { type: "string" },
        buildingCategory: { type: "string" },
        floors: { type: "array", items: { type: "string" } },
        overview: { type: "string" },
        buildingPhotoLink: { type: "string" },
        floorPlanLinks: { type: "array", items: { type: "string" } },
        tags: { type: "array", items: { type: "string" } },
      },
    };
  }
}
