const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate } = require("../models/category");

const express = require("express");
const router = express.Router();

const {
  _create,
  _read,
  _update,
  _delete
} = require("../controllers/categoriesController");

let roles = {
  CREATE: ["admin", "admin_1", "admin_2"],
  UPDATE: ["admin", "admin_1", "admin_2"],
  DELETE: ["admin", "admin_1", "admin_2"]
};

router.get("/", auth, _read);

// router.get("/:id", auth, validateObjectId, _read_id);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to have a valid request body
 */
// CREATE
router.post("/", [auth, role(roles.CREATE), validateBody(validate)], _create);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 * 4. to have a valid request body
 */
// UPDATE
const put_middlewares = [
  auth,
  role(roles.UPDATE),
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
// DELETE
router.delete("/:id", [auth, role(roles.DELETE), validateObjectId], _delete);

module.exports = router;
