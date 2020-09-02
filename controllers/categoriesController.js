const { Category } = require("../models/category");
const { Product } = require("../models/product");
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
  const category = await Category.findById(req.params.id);

  if (!category) return res.status(404).send("Category not found");

  // category tree associates category_id with category_image
  const categoryTree = {};
  // adding root of category tree
  categoryTree[req.params.id] = category.image;
  let oldSize = Object.keys(categoryTree).length;
  let newSize = 0;

  while (oldSize !== newSize) {
    oldSize = Object.keys(categoryTree).length;

    // get sub categories
    const subCategories = await Category.find({
      parent: { $in: Object.keys(categoryTree) },
    }).select("_id image");

    // add sub categories to category tree
    subCategories.map((c) => (categoryTree[c._id] = c.image));

    // set new size
    newSize = Object.keys(categoryTree).length;
  }

  const categories = Object.keys(categoryTree);

  // remove categories from DB
  await Category.deleteMany({ _id: { $in: categories } });

  // getting products under those categories
  const products = await Product.find({
    category: { $in: categories },
  }).select("_id images");

  // deleting products under those categories
  await Product.deleteMany({
    category: { $in: categories },
  });

  // delete category images (files)
  const categoryImages = Object.values(categoryTree);
  categoryImages.map((img) => {
    if (img) {
      deleteFile(
        path.join("public", img),
        () => {}, // on success : do nothing
        (err) => {
          // on error : log error
          console.log("Error deleting category image: ", err.message);
        }
      );
    }
  });

  // delete product images
  products.map((p) => {
    p.images.map((img) => {
      if (img) {
        deleteFile(
          path.join("public", img),
          () => {}, // on success : do nothing
          (err) => {
            // on error : log error
            console.log(
              "Error deleting product image (after deleting category): ",
              err.message
            );
          }
        );
      }
    });
  });

  return res.send(category);
};

const deleteFile = (filepath, success = () => {}, failure = () => {}) => {
  fs.exists(filepath, (exists) => {
    if (exists) {
      unlinkAsync(filepath)
        .then((response) => {
          success(response);
        })
        .catch((err) => {
          failure(err);
        });
    }
  });
};
