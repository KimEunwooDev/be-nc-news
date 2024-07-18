const db = require("../db/connection");
const { checkCommentExist } = require("../db/seeds/utils");

function removeCommentById(comment_id) {
  const queryString = `
    DELETE FROM comments
    WHERE comment_id = $1
    `;
  const queryArray = [comment_id];
  const promiseArray = [];

  promiseArray.push(checkCommentExist(comment_id));
  promiseArray.push(db.query(queryString, queryArray));
  return Promise.all(promiseArray).then((results) => {
    const commentResult = results[0];
    const queryResult = results[1];
    if (queryResult.rows.length === 0 && commentResult !== true) {
      return Promise.reject({ status: 404, msg: "comment does not exist" });
    }
    return queryResult.rows;
  });
}

module.exports = { removeCommentById };
