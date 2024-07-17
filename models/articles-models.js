const db = require("../db/connection");
const { checkArticleExist, checkUserExist } = require("../db/seeds/utils");

function selectArticles() {
  //   return db.query("SELECT * FROM articles ORDER BY created_at;");
  return db.query(
    `SELECT
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
    FROM comments
    RIGHT JOIN articles
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`
  );
}

function selectArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
}

function selectComments(article_id) {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows;
    });
}

function insertComment(newComment, article_id) {
  const queryString = `INSERT INTO comments (author,body,article_id)VALUES ($1, $2, $3) RETURNING *;`;
  const queryValues = [newComment.username, newComment.body];
  const promiseArray = [];
  if (article_id) {
    queryValues.push(article_id);
    promiseArray.push(checkArticleExist(article_id));
  }
  if (newComment.username) {
    promiseArray.push(checkUserExist(newComment.username));
  }
  promiseArray.push(db.query(queryString, queryValues));
  return Promise.all(promiseArray).then((results) => {
    const articleResults = results[0];
    const queryResults = results[2];

    if (queryResults.rows.length === 0 && articleResults !== true) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return queryResults.rows[0];
  });
}

function updateArticleByID(article_id, inc_votes) {
  const queryString = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`;
  const promiseArray = [];
  const queryArray = [];
  if (inc_votes) {
    queryArray.push(inc_votes);
  }
  if (article_id) {
    queryArray.push(article_id);
    promiseArray.push(checkArticleExist(article_id));
  }
  promiseArray.push(db.query(queryString, queryArray));
  return Promise.all(promiseArray).then((results) => {
    const articleResults = results[0];
    const queryResults = results[1];
    if (queryResults.rows === 0 && articleResults !== true) {
    }
    return queryResults.rows[0];
  });
}

module.exports = {
  selectArticles,
  selectArticleById,
  selectComments,
  insertComment,
  updateArticleByID,
};
