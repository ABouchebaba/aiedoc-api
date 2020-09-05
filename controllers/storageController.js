const multer = require("multer");
const path = require("path");
const mkdirp = require("mkdirp");
const { v4: uuidv4 } = require("uuid");

var spStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "";
    switch (file.fieldname) {
      case "picture": {
        dest = path.join("public", "images", "profiles", "sp");
        break;
      }
      case "docs": {
        dest = path.join("public", "files", "diplomas");
        break;
      }
      case "extNaissance": {
        dest = path.join("public", "files", "extsNaissance");
        break;
      }
      case "residence": {
        dest = path.join("public", "files", "residences");
        break;
      }
      case "idCard": {
        dest = path.join("public", "files", "idCards");
        break;
      }
      case "casierJudiciaire": {
        dest = path.join("public", "files", "casiersJudiciaires");
        break;
      }
      default:
        dest = null;
    }

    // console.log(dest);
    mkdirp(dest).then((val) => cb(null, dest));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname)); //Appending .jpg
  },
});
module.exports.spStorage = multer({ storage: spStorage });

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

var categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join("public", "images", "categories");
    mkdirp(dest).then((val) => cb(null, dest));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname)); //Appending .jpg
  },
});
module.exports.categoryStorage = multer({ storage: categoryStorage });
