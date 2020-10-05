const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate, validateStatus } = require("../models/command");

const express = require("express");
const router = express.Router();
const { CLIENT, SP, COMMANDES } = require("../constants/roles");

const {
  _create,
  _read,
  _read_id,
  _update_status,
  _return_product,
} = require("../controllers/commandsController");

let roles = {
  READ_ALL: COMMANDES,
  CREATE: [CLIENT, SP],
  UPDATE_STATUS: COMMANDES,
};

/**
 * 1. Add role verification in /:id route
 * 2. Add user_type predefined values in validate (not hardcoded)
 */

router.get("/", [auth, role(roles.READ_ALL)], _read);

router.get("/:id", auth, validateObjectId, _read_id);

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
  validateObjectId,
  role(roles.UPDATE_STATUS),
  validateBody(validateStatus),
];
router.put("/:id/status", ...put_middlewares, _update_status);

/**
 * Rent: return product
 */
const return_product_middlewares = [
  auth,
  validateObjectId,
  role(roles.UPDATE_STATUS),
];

router.put(
  "/:id/return_product/:index",
  ...return_product_middlewares,
  _return_product
);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 */
// DELETE
// router.delete("/:id", [auth, role(roles.DELETE), validateObjectId], _delete);

module.exports = router;
