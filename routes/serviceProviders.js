const auth = require("../middlewares/auth");
const validateBody = require("../middlewares/validateBody");
const { validate, validatePhone } = require("../models/serviceProvider");
const express = require("express");
const router = express.Router();

const {
  _create,
  _read_id,
  _read,
  _verifyPhone
} = require("../controllers/serviceProvidersController");

router.get("/", auth, _read);

router.get("/me", auth, _read_id);

// Register route
router.post("/register", validateBody(validate), _create);

// Verify if user is already registered via phone number
// add body validation middleware
router.post("/verifyPhone", validateBody(validatePhone), _verifyPhone);

module.exports = router;
