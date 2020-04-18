const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const { validate, validatePhone } = require("../models/client");
const express = require("express");
const router = express.Router();
const { ADMINS, CLIENT } = require("../constants/roles");

const {
  _create,
  _read_id,
  _interventions,
  _commands,
  _read,
  _verifyPhone,
} = require("../controllers/clientController");

let roles = {
  GET_ALL: ADMINS,
  GET_ONE: ADMINS,
  GET_ONE_INTERVENTIONS: [...ADMINS, CLIENT],
  GET_ONE_COMMANDS: [...ADMINS, CLIENT],
};

// GET_ALL
router.get("/", auth, role(roles.GET_ALL), _read);

// GET_ONE
router.get("/:id", auth, role(roles.GET_ONE), _read_id);

// GET_ONE_INTERVENTIONS
router.get(
  "/:id/interventions",
  auth,
  role(roles.GET_ONE_INTERVENTIONS),
  _interventions
);

// GET_ONE_COMMANDS
router.get("/:id/commands", auth, role(roles.GET_ONE_COMMANDS), _commands);

// Register route
router.post("/register", validateBody(validate), _create);

// Verify if user is already registered via phone number
// add body validation middleware
router.post("/verifyPhone", validateBody(validatePhone), _verifyPhone);

//TODO: Add put to update client infos

module.exports = router;
