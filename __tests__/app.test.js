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

describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given a invalid id", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH: 200 update an article by article id and sends the updated article", () => {
    const updateBody = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updateBody)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(105);
      });
  });
  test("PATCH: 400 sends an appropriate status and error message when given a invalid id", () => {
    const updateBody = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(updateBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATHCH:400 responds with an appropriate status and error message when provided with a bad request body (non number)", () => {
    const updateBody = {
      inc_votes: "not-a-number",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updateBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH:404 respons with an appropriate status and error message when given a valid id but doesn not exsit", () => {
    const updateBody = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(updateBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 sends an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        body.articles.forEach((article) => {
          expect(Array.isArray(article)).toBe(false);
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test("GET:200 allow a client to sort by any valid column with a '?sort_by=' query", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("GET:200 allow a client to client to change the sort order with an `?order=` query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at");
      });
  });
  test("GET:400 responds with an appropriate status and error message when provided with a invalid query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid-query")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Query");
      });
  });
  test("GET:200 sends an array of articles by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET:400 responds with an appropriate status and error message when provided with a invalid query", () => {
    return request(app)
      .get("/api/articles?topic=invalid-query")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Query");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of all commnets for an articles", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid article id but non-existent comment", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given a invalid id", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("POST:201 add a new comment with corresponded article_id to the db and sends the posted comment back to the client", () => {
    const newComment = {
      username: "rogersop",
      body: "It is so interesting !",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment.comment_id).toBe(19);
        expect(body.postedComment.author).toBe("rogersop");
        expect(body.postedComment.body).toBe("It is so interesting !");
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with a bad comment (no username)", () => {
    const newComment = {
      body: "It is so interesting !",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:400 respons with an appropriate status and error message when given a invalid id", () => {
    const newComment = {
      username: "rogersop",
      body: "It is so interesting !",
    };
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST:404 respons with an appropriate status and error message when given a valid id but doesn not exsit", () => {
    const newComment = {
      username: "rogersop",
      body: "It is so interesting !",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("POST:404 respons with an appropriate status and error message when given non-exsisting username", () => {
    const newComment = {
      username: "eunwoo",
      body: "It is so interesting !",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user does not exist");
      });
  });
});
describe("/api/comments/:comment_id", () => {
  test("DELETE:204 delete the given comment by comment id from the db", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:400 respons with an appropriate status and error message when given a invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("DELETE:400 respons with an appropriate status anderror message when given non-exsisting comment id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
});

describe("/api/users", () => {
  test("GET:200 sends an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
