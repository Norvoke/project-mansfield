/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("User", (table) => {
    table.increments("id").primary();
    table.string("googleId");
    table.string("name");
    table.text("email");
    table.specificType("savedReviews", "integer[]");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("User");
};
