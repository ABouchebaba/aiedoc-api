const { Product } = require("../models/product");
const { save } = require("./fileController");
const fs = require("fs");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  let images = req.files.map((f) => f.path.slice(f.path.indexOf("/") + 1));
  req.body.images = images;
  const product = await Product.create(req.body);
  res.send(product);
};

module.exports._add_image = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("Product not found");
  }
  const images = await save(req.files, `images/products`);

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $push: { images: { $each: images } },
    },
    { new: true }
  );

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

  req.body.links.map((link) => {
    fs.unlink(`./public/${link}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Removed link ...");
      }
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

// module.exports._read_name = async (req, res) => {
//   const searchQuery = new RegExp(`.*${req.params.name}.*`, "i");

//   const courses = await Course.find({ name: searchQuery });

//   res.send(courses);
// };

module.exports._update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).send("Product not found");

  res.send(product);
};

module.exports._delete = async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send("Product not found");

  res.send(product);
};
