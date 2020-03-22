const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate } = require("../models/payment");

const express = require("express");
const router = express.Router();

const { _read } = require("../controllers/paymentsController");

let roles = {
  READ: ["admin", "admin_1", "admin_2"]
};

// user need to admin and authenticated
router.get("/", auth, role(roles.READ), _read);

module.exports = router;
