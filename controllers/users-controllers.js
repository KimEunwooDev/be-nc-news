const { selectUsers } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then(({ rows }) => {
      res.status(200).send({ users: rows });
    })
    .catch(next);
};
