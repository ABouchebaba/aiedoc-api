const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");
const { validate } = require("../models/intervention");
const express = require("express");
const router = express.Router();

const {
  _create,
  _read_id,
  _read
} = require("../controllers/interventionsController");

let roles = {
  GET_ALL: ["admin", "admin_1", "admin_2"],
  CREATE: ["client"]
};

// GET_ALL
router.get("/", auth, role(roles.GET_ALL), _read);

// All authenticated users have access to this route ==> might need some change !!!
router.get("/:id", auth, validateObjectId, _read_id);

// CREATE
router.post("/", auth, role(roles.CREATE), validateBody(validate), _create);

// router.put("/:id/validate", auth, isAdmin, validateObjectId, _validate);

module.exports = router;
