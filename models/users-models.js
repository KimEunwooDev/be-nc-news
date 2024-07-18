const db = require("../db/connection");

function selectUsers() {
  const queryString = `
    SELECT *
    FROM users`;
  return db.query(queryString);
}

module.exports = { selectUsers };
