const multer = require("multer");
const path = require("path");
const { v1: uuidv1 } = require("uuid");

var docStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public", "files", "diplomas"));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv1() + path.extname(file.originalname)); //Appending .jpg
  },
});

module.exports.docStorage = multer({ storage: docStorage });

var productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public", "images", "products"));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv1() + path.extname(file.originalname)); //Appending .jpg
  },
});

module.exports.productStorage = multer({ storage: productStorage });
