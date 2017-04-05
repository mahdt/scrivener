const fs = require('fs');

const webpackAssets = jsonPath => (req, res, next) => {
  res.locals.webpack_assets = JSON.parse(fs.readFileSync(jsonPath));
  next();
};

module.exports = webpackAssets;
