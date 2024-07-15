const express = require("express");
const app = express();
const fs = require("fs/promises");

const { getTopics } = require("./controllers/topics-controllers");
const { getApi } = require("./controllers/api-controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

module.exports = app;
