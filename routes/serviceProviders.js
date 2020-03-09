const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");
const { validate, validatePhone } = require("../models/serviceProvider");
const express = require("express");
const router = express.Router();

const {
  _create,
  _read_id,
  _read,
  _verifyPhone,
  _validate,
  _ban,
  _interventions,
  _payments
} = require("../controllers/serviceProvidersController");

let roles = {
  GET_ALL: ["admin", "admin_1", "admin_2"],
  GET_ONE: ["admin", "admin_1", "admin_2"],
  GET_ONE_INTERVENTIONS: ["admin", "admin_1", "admin_2"],
  GET_ONE_PAYMENTS: ["admin", "admin_1", "admin_2"],
  VALIDATE: ["admin", "admin_1", "admin_2"],
  BAN: ["admin", "admin_1", "admin_2"]
};

// Register route
router.post("/register", validateBody(validate), _create);

// Verify if user is already registered via phone number
// add body validation middleware
router.post("/verifyPhone", validateBody(validatePhone), _verifyPhone);

// GET_ALL
router.get("/", auth, role(roles.GET_ALL), _read);

// router.get("/me", auth, _read_id);

// GET_ONE
router.get("/:id", auth, role(roles.GET_ONE), validateObjectId, _read_id);

// GET_ONE_INTERVENTIONS
router.get(
  "/:id/interventions",
  auth,
  role(roles.GET_ONE_INTERVENTIONS),
  validateObjectId,
  _interventions
);

// GET_ONE_PAYMENTS
router.get(
  "/:id/payments",
  auth,
  role(roles.GET_ONE_PAYMENTS),
  validateObjectId,
  _payments
);

// VALIDATE
router.put(
  "/:id/validate",
  auth,
  role(roles.VALIDATE),
  validateObjectId,
  _validate
);

// BAN
router.put("/:id/ban", auth, role(roles.BAN), validateObjectId, _ban);

module.exports = router;
