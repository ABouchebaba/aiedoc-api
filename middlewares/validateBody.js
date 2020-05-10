const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports = function (validator) {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      // might have saved files with multer
      // in case of formdata -> so delete them
      req.files.map(async (f) => {
        await unlinkAsync(f.path);
      });
      return res.status(400).send(error.details[0].message);
    }

    next();
  };
};
