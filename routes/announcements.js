const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate } = require("../models/announcement");

const express = require("express");
const router = express.Router();

const {
  _create,
  _read,
  _read_id,
  _update,
  _delete
} = require("../controllers/announcementsController");

/*
 * here are defined roles for each route
 * routes that are not listed in the object
 * are accessible for all roles
 */
const roles = {
  post: ["teacher", "admin"],
  put: ["teacher", "admin"],
  delete: ["teacher", "admin"]
};

router.get("/", _read);

router.get("/:id", validateObjectId, _read_id);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to have a valid request body
 */
router.post("/", [auth, role(roles.post), validateBody(validate)], _create);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 * 4. to have a valid request body
 */
const put_middlewares = [
  auth,
  role(roles.put),
  validateObjectId,
  validateBody(validate)
];
router.put("/:id", put_middlewares, _update);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 */
router.delete("/:id", [auth, role(roles.delete), validateObjectId], _delete);

module.exports = router;
