const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

/** puts image in req.body.image */
const image = (required = true) => (req, res, next) => {
  if (required) {
    if (!req.file)
      return res.status(400).send("Service/Category image is required");

    const imagePath = req.file.path;
    req.body.image = imagePath.slice(imagePath.indexOf(path.sep) + 1);
  } else {
    if (req.files[0]) {
      const imagePath = req.files[0].path;
      req.body.image = imagePath.slice(imagePath.indexOf(path.sep) + 1);
    }
  }

  next();
};

/** puts picture path in req.body.picture */
const picture = (req, res, next) => {
  if (!req.files.picture || req.files.picture.length === 0) {
    // delete saved files
    deleteFiles(req.files);
    return res.status(400).send("Profile picture is required");
  }

  const picturePath = req.files.picture[0].path;
  req.body.picture = picturePath.slice(picturePath.indexOf(path.sep) + 1);

  next();
};

/** puts diploma (including docs paths) in req.body.diplomas */
const docs = (req, res, next) => {
  if (!req.files.docs || req.files.docs.length === 0) {
    // delete saved files
    deleteFiles(req.files);
    return res.status(400).send("Diploma documents are required");
  }

  let diplomas = [];

  for (let i = 0; i < req.files.docs.length; i++) {
    const filepath = req.files.docs[i].path;

    diplomas = [
      ...diplomas,
      {
        type: req.body.types[i],
        description: req.body.descriptions[i],
        file: filepath.slice(filepath.indexOf(path.sep) + 1),
      },
    ];
  }

  req.body.diplomas = diplomas;

  delete req.body.types;
  delete req.body.descriptions;

  next();
};

const deleteFiles = (files) => {
  if (!files) return;

  if (Array.isArray(files)) {
    files.map(async (f) => {
      await unlinkAsync(f.path);
    });
  } else {
    Object.keys(files).map((key) => {
      files[key].map(async (f) => {
        await unlinkAsync(f.path);
      });
    });
  }
};

module.exports.deleteFiles = deleteFiles;
module.exports.picture = picture;
module.exports.docs = docs;
module.exports.image = image;
