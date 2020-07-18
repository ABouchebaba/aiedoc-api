const multer = require("multer");
const path = require("path");
const mkdirp = require("mkdirp");
const { v4: uuidv4 } = require("uuid");

var docStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join("public", "files", "diplomas");
    if (file.fieldname === "picture")
      dest = path.join("public", "images", "profiles", "sp");

    mkdirp(dest).then((val) => cb(null, dest));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname)); //Appending .jpg
  },
});
module.exports.docStorage = multer({ storage: docStorage });

var productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join("public", "images", "products");
    mkdirp(dest).then((val) => cb(null, dest));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname)); //Appending .jpg
  },
});
module.exports.productStorage = multer({ storage: productStorage });

var serviceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join("public", "images", "services");
    mkdirp(dest).then((val) => cb(null, dest));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname)); //Appending .jpg
  },
});
module.exports.servicesStorage = multer({ storage: serviceStorage });
