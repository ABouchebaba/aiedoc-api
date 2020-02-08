const config = require("config");

module.exports = function() {
  /// We don't need jwt authentication for the moment
  if (!config.get("jwtPrivateKey"))
    throw new Error("FATAL ERROR: jwtPrivateKey is not set");
};
