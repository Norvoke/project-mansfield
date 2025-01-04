/* eslint-disable func-names */

exports.up = function (knex) {
  return knex.schema.table("building", (table) => {
    table.renameColumn("review", "overview");
  });
};

exports.down = function (knex) {
  return knex.schema.table("building", (table) => {
    table.renameColumn("overview", "review");
  });
};
