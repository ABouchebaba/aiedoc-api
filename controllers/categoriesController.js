const { Category } = require("../models/category");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  const category = await Category.create(req.body);
  res.send(category);
};

module.exports._read = async (req, res) => {
  const categories = await Category.find(); //.sort("name");
  res.send(categories);
};

// module.exports._read_id = async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) return res.status(404).send("Product not found");

//   res.send(product);
// };

// module.exports._read_name = async (req, res) => {
//   const searchQuery = new RegExp(`.*${req.params.name}.*`, "i");

//   const courses = await Course.find({ name: searchQuery });

//   res.send(courses);
// };

module.exports._update = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!category) return res.status(404).send("Category not found");

  res.send(category);
};

module.exports._delete = async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category) return res.status(404).send("Category not found");

  res.send(category);
};
