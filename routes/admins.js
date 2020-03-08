const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
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

router.get("/", auth, isAdmin, _read);

router.get("/:id", auth, isAdmin, validateObjectId, _read_id);

// create admin route
// verify creator's role
router.post("/", auth, isAdmin, validateBody(validate), _create);

router.post("/auth", validateBody(validateLogin), _authenticate);

module.exports = router;
