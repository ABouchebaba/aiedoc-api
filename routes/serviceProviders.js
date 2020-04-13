const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const paramsToBody = require("../middlewares/paramsToBody");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");
const { validate, validatePhone } = require("../models/serviceProvider");
const validatePayment = require("../models/payment")["validate"];
const express = require("express");
const router = express.Router();

const {
  _create,
  _read_id,
  _read,
  _read_available,
  _verifyPhone,
  _validate,
  _ban,
  _interventions,
  _payments,
  _add_payment,
} = require("../controllers/serviceProvidersController");

let roles = {
  GET_ALL: ["admin", "admin_1", "admin_2"],
  GET_AVAILABLE: ["admin", "admin_1", "admin_2", "client"],
  GET_ONE: ["admin", "admin_1", "admin_2"],
  GET_ONE_INTERVENTIONS: ["admin", "admin_1", "admin_2"],
  GET_ONE_PAYMENTS: ["admin", "admin_1", "admin_2"],
  VALIDATE: ["admin", "admin_1", "admin_2"],
  BAN: ["admin", "admin_1", "admin_2"],
  POST_ONE_PAYMENT: ["admin", "admin_1", "admin_2"],
};

// Register route
router.post("/register", validateBody(validate), _create);

// Verify if user is already registered via phone number
// add body validation middleware
router.post("/verifyPhone", validateBody(validatePhone), _verifyPhone);

// GET_ALL
router.get("/", auth, role(roles.GET_ALL), _read);

// GET_AVAILABLE
router.get("/available", auth, role(roles.GET_AVAILABLE), _read_available);

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

// POST_ONE_PAYMENT
router.post(
  "/:id/payments",
  auth,
  role(roles.POST_ONE_PAYMENT),
  validateObjectId,
  paramsToBody({ id: "sp_id" }),
  validateBody(validatePayment),
  _add_payment
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
