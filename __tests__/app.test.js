const request = require("supertest");

const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api", () => {
  test("GET:200 respond with a description of all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.parsedEndpoints).toBe("object");
        expect(body.parsedEndpoints).toEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 respond with an array of topics", () => {
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
