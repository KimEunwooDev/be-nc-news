const db = require("../db/connection");

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

module.exports = { selectArticles, selectArticleById };
