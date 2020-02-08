// const morgan = require("morgan");
// const debug = require("debug")("app:startup"); // need to set the DEBUG env variable to  app:startup
const express = require("express");
const fileUpload = require("express-fileupload");

const error = require("../middlewares/error");

const home = require("../routes/home");
const services = require("../routes/services");
const clients = require("../routes/clients");
const admins = require("../routes/admins");

const courses = require("../routes/courses");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(fileUpload());

  app.use("/", home);
  app.use("/api/services", services);
  app.use("/api/clients", clients);
  app.use("/api/admins", admins);

  app.use("/api/courses", courses);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(error);
};
