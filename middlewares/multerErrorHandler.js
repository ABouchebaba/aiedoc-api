const multer = require("multer");

const multerErrorHandler = (storage) => {
  return (req, res, next) => {
    storage(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .send(err.message + " in " + err.field + " : " + err.code);
      } else if (err) {
        // An unknown error occurred when uploading.
        // dunno yet what to put here
        console.log(err.message);
        return res.status(500).send("Unexpected Multer error");
      }

      next();
    });
  };
};

module.exports.multerErrorHandler = multerErrorHandler;
