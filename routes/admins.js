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

// GET_ALL
router.get("/", auth, role(roles.GET_ALL), _read);

// GET_ONE
router.get("/:id", auth, role(roles.GET_ONE), validateObjectId, _read_id);

// CREATE
router.post("/", auth, role(roles.CREATE), validateBody(validate), _create);

router.post("/auth", validateBody(validateLogin), _authenticate);

router.delete("/:id", auth, role(roles.DELETE), validateObjectId, _delete);

module.exports = router;
