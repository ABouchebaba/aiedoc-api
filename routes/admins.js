const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate, validateLogin } = require("../models/admin");
const express = require("express");
const router = express.Router();

const {
  _create,
  _read,
  _read_id,
  _authenticate
} = require("../controllers/adminsController");

let roles = {
  GET_ALL: ["admin", "admin_1", "admin_2"],
  GET_ONE: ["admin", "admin_1", "admin_2"],
  CREATE: ["admin", "admin_1", "admin_2"]
};

// GET_ALL
router.get("/", auth, role(roles.GET_ALL), _read);

// GET_ONE
router.get("/:id", auth, role(roles.GET_ONE), validateObjectId, _read_id);

// CREATE
router.post("/", auth, role(roles.CREATE), validateBody(validate), _create);

router.post("/auth", validateBody(validateLogin), _authenticate);

module.exports = router;
