const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  // used to log errors in logfile and in DB
  winston.add(winston.transports.File, { filename: "logfile.log" });

  // not using the local db
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost/TemplateDB"
  // });

  process.on("unhandledRejection", e => {
    // this catches promise rejections
    // passes them to winston.handleExceptions
    throw e;
  });

  /////////////////////////////////////////////////////////////////////
  // This handles errors outside of the request processing pipeline
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "Exceptions.log" })
  );
};
