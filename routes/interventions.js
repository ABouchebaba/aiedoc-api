const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
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

router.get("/", auth, isAdmin, _read);

router.get("/:id", auth, validateObjectId, _read_id);

// Maybe add isClient middleware OR JUST IMPLEMENT SOME ROLE MANAGEMENT !!!!!
router.post("/", auth, validateBody(validate), _create);

// router.put("/:id/validate", auth, isAdmin, validateObjectId, _validate);

module.exports = router;
