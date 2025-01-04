/* eslint-disable func-names */

exports.up = function (knex) {
  return knex.schema.table("building", (table) => {
    table.specificType("floorPlanLinks", "text[]");
  });
};

exports.down = function (knex) {
  return knex.schema.table("building", (table) => {
    table.dropColumn("floorPlanLinks");
  });
};
