/* eslint-disable func-names */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const fs = require("fs");

exports.seed = function (knex) {
  const contents = fs.readFileSync("./data/seed.json");
  const data = JSON.parse(contents);

  // Deletes ALL existing entries
  // Use batch insert because we have too many articles for simple insert
  return knex("buildingReview")
    .del()
    .then(() => knex.batchInsert("buildingReview", data, 100));
};
