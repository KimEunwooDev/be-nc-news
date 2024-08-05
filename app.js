const express = require("express");
const app = express();
const fs = require("fs/promises");
const cors = require("cors");

const { getTopics } = require("./controllers/topics-controllers");
const { getApi } = require("./controllers/api-controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchArticleByID,
} = require("./controllers/articles-controllers");
const { deleteCommentById } = require("./controllers/comments-controllers");
const { getUsers } = require("./controllers/users-controllers");

app.use(express.json());
app.use(cors());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleByID);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).send(err);
});

module.exports = app;
