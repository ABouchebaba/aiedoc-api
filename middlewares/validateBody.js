const { deleteFiles } = require("./files");

module.exports = function (validator) {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      // might have saved files with multer
      // in case of formdata -> so delete them
      if (req.files) deleteFiles(req.files);
      if (req.file) deleteFiles([req.file]);
      return res.status(400).send(error.details[0].message);
    }

    next();
  };
};
