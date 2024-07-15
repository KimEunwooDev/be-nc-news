const fs = require("fs/promises");

function readEndpoints() {
  return fs.readFile("./endpoints.json", "utf8").then((endpoints) => {
    const parsedEndpoints = JSON.parse(endpoints);
    return parsedEndpoints;
  });
}

module.exports = { readEndpoints };
