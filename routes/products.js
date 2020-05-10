const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate } = require("../models/product");

const express = require("express");
const router = express.Router();
const { ADMINS } = require("../constants/roles");
const { productStorage } = require("../controllers/storageController");

const {
  _create,
  _read,
  _read_id,
  _update,
  _delete,
  _add_image,
  _remove_images,
} = require("../controllers/productsController");

let roles = {
  CREATE: ADMINS,
  UPDATE: ADMINS,
  DELETE: ADMINS,
  ADD_IMAGES: ADMINS,
  REMOVE_IMAGES: ADMINS,
};

router.get("/", auth, _read);

router.get("/:id", auth, validateObjectId, _read_id);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to have a valid request body
 */
// CREATE
router.post(
  "/",
  [
    auth,
    role(roles.CREATE),
    // validateBody(validate),
    productStorage.array("images"),
  ],
  _create
);

router.post("/:id/images", [auth, role(roles.ADD_IMAGES)], _add_image);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 * 4. to have a valid request body
 */
// UPDATE
const put_middlewares = [
  auth,
  role(roles.UPDATE),
  validateObjectId,
  validateBody(validate),
];
router.put("/:id", put_middlewares, _update);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 */
// DELETE
router.delete("/:id", [auth, role(roles.DELETE), validateObjectId], _delete);

// deleting product images
router.delete(
  "/:id/images",
  [auth, role(roles.REMOVE_IMAGES), validateObjectId],
  _remove_images
);

module.exports = router;
