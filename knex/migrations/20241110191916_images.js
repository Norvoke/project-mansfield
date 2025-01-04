/* eslint-disable func-names */

exports.up = function (knex) {
  return knex.schema.table("building", (table) => {
    table.text("buildingPhotoLink");
  });
};

exports.down = function (knex) {
  return knex.schema.table("building", (table) => {
    table.dropColumn("buildingPhotoLink");
  });
};
