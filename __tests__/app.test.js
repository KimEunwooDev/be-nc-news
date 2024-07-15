const request = require("supertest");

const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 should respond with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        expect(Array.isArray(response.body.topics)).toBe(true);
        response.body.topics.forEach((topic) => {
          expect(Array.isArray(topic)).toBe(false);
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given an invalid endpoint", () => {
    return request(app).get("/api/not-a-route").expect(404);
  });
});
