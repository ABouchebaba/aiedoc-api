const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate, validateLogin } = require("../models/admin");
const express = require("express");
const router = express.Router();
const { ADMIN } = require("../constants/roles");

const {
  _create,
  _read,
  _read_id,
  _authenticate,
  _delete,
} = require("../controllers/adminsController");

let roles = {
  GET_ALL: [ADMIN],
  GET_ONE: [ADMIN],
  CREATE: [ADMIN],
  DELETE: [ADMIN],
};

/**
 * 1. ADD /me route for profile instead of /:id
 * 2. _create route : test email unique
 * 3. Login : check user has not token
 */

// GET_ALL
router.get("/", auth, role(roles.GET_ALL), _read);

// GET_ONE
router.get("/:id", auth, role(roles.GET_ONE), validateObjectId, _read_id);

// CREATE
router.post("/", auth, role(roles.CREATE), validateBody(validate), _create);

// LOGIN
router.post("/auth", validateBody(validateLogin), _authenticate);

// DELETE ==> really not sure about this one
router.delete("/:id", auth, role(roles.DELETE), validateObjectId, _delete);

module.exports = router;
