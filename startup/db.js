const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  const db = config.get("db");

  // To avoid deprecation warnings
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose.set("useUnifiedTopology", true);

  mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
  //the winston.handleExceptions handles the catch part of this promise
  // and stops the process
};
