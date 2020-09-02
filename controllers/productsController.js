const { Product } = require("../models/product");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports._create = async (req, res) => {
  let images = req.files.map((f) => f.path.slice(f.path.indexOf(path.sep) + 1));
  req.body.images = images;

  try {
    req.body.options = JSON.parse(req.body.options);
  } catch (e) {
    return res.status(400).send("Unexpected Options format");
  }

  const product = await Product.create(req.body);
  return res.send(product);
};

module.exports._add_image = async (req, res) => {
  if (!req.files) {
    return res.status(400).send("No image found");
  }

  // remove "public" from image paths => to be accessible from api link
  // ex : https://aiedoc.herokuapp.com/image-path
  let images = req.files.map((f) => f.path.slice(f.path.indexOf(path.sep) + 1));

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $push: { images: { $each: images } },
    },
    { new: true }
  );
  if (!product) {
    //remove added images
    await Promise.all(req.files.map(async (f) => await unlinkAsync(f.path)));
    return res.status(404).send("Product not found");
  }

  res.send(product);
};

module.exports._remove_images = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { images: { $in: req.body.links } },
    },
    { new: true }
  );

  if (!product) {
    return res.status(404).send("Product not found");
  }

  // removing images : no await => no blocking
  req.body.links.map((l) => {
    fs.exists(path.join("public", l), (exists) => {
      if (exists) unlinkAsync(path.join("public", l));
    });
  });

  res.send(product);
};

module.exports._read = async (req, res) => {
  const products = await Product.find().populate("category"); //.sort("name");
  res.send(products);
};

module.exports._read_id = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) return res.status(404).send("Product not found");

  res.send(product);
};

module.exports._update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).send("Product not found");

  res.send(product);
};

// remove images
module.exports._delete = async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send("Product not found");

  res.send(product);
};
