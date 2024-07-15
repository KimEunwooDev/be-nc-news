const { readEndpoints } = require("../models/api-models");

exports.getApi = (req, res, next) => {
  readEndpoints().then((parsedEndpoints) => {
    res.status(200).send({ parsedEndpoints });
  });
};
