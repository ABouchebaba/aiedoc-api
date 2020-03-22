const { Product } = require("../models/product");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  const product = await Product.create(req.body);
  res.send(product);
};

module.exports._read = async (req, res) => {
  const products = await Product.find(); //.sort("name");
  res.send(products);
};

module.exports._read_id = async (req, res) => {
  const product = await Product.findById(req.params.id);

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
    new: true
  });
  if (!product) return res.status(404).send("Product not found");

  res.send(product);
};

module.exports._delete = async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send("Product not found");

  res.send(product);
};
