const express = require("express");
const app = express();
const fs = require("fs/promises");

const { getTopics } = require("./controllers/topics-controllers");
const { getApi } = require("./controllers/api-controllers");
const { getArticleById } = require("./controllers/articles-controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send(err);
});

module.exports = app;
