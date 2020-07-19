const { Category } = require("../models/category");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports._create = async (req, res) => {
  let cat = await Category.findOne(req.body);
  if (cat) {
    return res.status(400).send("Category already exists");
  }

  const category = await Category.create(req.body);
  res.send(category);
};

module.exports._read = async (req, res) => {
  const categories = await Category.find(); //.sort("name");
  res.send(categories);
};

module.exports._read_id = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) return res.status(404).send("Category not found");

  res.send(category);
};

module.exports._update = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!category) return res.status(404).send("Category not found");

  res.send(category);
};

module.exports._update_image = async (req, res) => {
  const oldCategory = await Category.findByIdAndUpdate(req.params.id, {
    image: req.body.image,
  });

  if (oldCategory.image) {
    unlinkAsync(path.join("public", oldCategory.image))
      .then((response) => {
        oldCategory.image = req.body.image;
        res.send(oldCategory);
      })
      .catch((err) => {
        res
          .status(500)
          .send("An unexpected error occured while deleting old image");
      });
  } else {
    oldCategory.image = req.body.image;
    res.send(oldCategory);
  }
};

module.exports._delete = async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category) return res.status(404).send("Category not found");

  fs.exists(path.join("public", category.image), (exists) => {
    if (exists) {
      unlinkAsync(path.join("public", category.image))
        .then((response) => {
          res.send(category);
        })
        .catch((err) => {
          res
            .status(500)
            .send("An unexpected error occured while deleting image");
        });
    }
  });
};
