const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

var docStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files/diplomas/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname); //Appending .jpg
  },
});

module.exports.docStorage = multer({ storage: docStorage });
