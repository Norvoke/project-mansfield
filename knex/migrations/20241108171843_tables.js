/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema
    .createTable("building", (table) => {
      table.string("buildingID").primary();
      table.string("buildingName");
      table.string("buildingCategory");
      table.specificType("floors", "text[]");
      table.text("review");
      table.specificType("tags", "text[]");
    })
    .then(() =>
      knex.schema.createTable("buildingReview", (table) => {
        table.increments("reviewID").primary();
        table.string("userID");
        table.text("review");
        table.json("ratings");
        table.string("buildingID");
        table.integer("likes").defaultTo(0);
        table.string("date");
      }),
    );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("buildingReview")
    .then(() => knex.schema.dropTableIfExists("building"));
};
