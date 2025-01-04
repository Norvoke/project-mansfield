/**
 * @jest-environment node
 *
 * Use Node environment for server-side tests to avoid loading browser libraries.
 * This needs to be the top comment in the file
 */
/* eslint-disable no-return-assign, no-param-reassign */
import { testApiHandler } from "next-test-api-route-handler";
import reviewsEndpoint from "../pages/api/allReviews";
import buildingsEndpoint from "../pages/api/buildings/[buildingID]";
import userEndpoint from "../pages/api/userID";
import { knex } from "../../knex/knex";

describe("Test MiddZillow Api", () => {
  beforeAll(() => knex.migrate.rollback().then(() => knex.migrate.latest()));
  afterAll(() => knex.destroy());
  beforeEach(() => knex.seed.run());
  describe("Building API", () => {
    test("GET /api/building/[buildingID] fetches a building", async () => {
      await testApiHandler({
        rejectOnHandlerError: true,
        pagesHandler: buildingsEndpoint,
        params: { buildingID: "allen" }, // Testing dynamic routes requires params or patcher
        test: async ({ fetch }) => {
          const res = await fetch();
          await expect(res.json()).resolves.toHaveProperty("building");
        },
      });
    });
  });
  describe("Review API", () => {
    test("GET /api/allReviews returns all reviews", async () => {
      await testApiHandler({
        rejectOnHandlerError: true,
        pagesHandler: reviewsEndpoint,
        params: {}, // Testing dynamic routes requires params or patcher
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.json()).resolves.toContainEqual(
            expect.objectContaining({
              buildingID: "allen",
              reviewID: 1,
              userID: "fakeID1",
            }),
          );
        },
      });
    });
  });
  describe("User Endpoint", () => {
    test("GET /api/userID returns the user ID", async () => {
      await testApiHandler({
        rejectOnHandlerError: true,
        pagesHandler: userEndpoint,
        params: { email: "oarmbruster@middlebury.edu" }, // Testing dynamic routes requires params or patcher
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.json()).resolves.toHaveProperty("id");
        },
      });
    });
  });
});
