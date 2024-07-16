const {
  selectArticles,
  selectArticleById,
  selectComments,
  insertComment,
} = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(newComment, article_id)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};
