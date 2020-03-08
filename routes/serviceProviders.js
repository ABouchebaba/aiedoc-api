const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
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

router.get("/", auth, _read);

// router.get("/me", auth, _read_id);

router.get("/:id", auth, validateObjectId, _read_id);

router.get("/:id/interventions", auth, validateObjectId, _interventions);

router.get("/:id/payments", auth, validateObjectId, _payments);

// Register route
router.post("/register", validateBody(validate), _create);

// Verify if user is already registered via phone number
// add body validation middleware
router.post("/verifyPhone", validateBody(validatePhone), _verifyPhone);

router.put("/:id/validate", auth, isAdmin, validateObjectId, _validate);

router.put("/:id/ban", auth, isAdmin, validateObjectId, _ban);

module.exports = router;
