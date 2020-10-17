const mongoose = require("mongoose");
const Joi = require("joi");

let productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  ref: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  priceHT: {
    type: Number,
    min: 0,
    required: true,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  promoted: {
    type: Number,
    min: 0,
    default: 0,
  },
  options: [
    {
      qty: {
        type: Number,
        min: 0,
      },
      option: String,
    },
  ],
  images: [String],
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string().max(100).required(),
    ref: Joi.string().max(100).required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.objectId().required(),
    price: Joi.number().min(0).required(),
    priceHT: Joi.number().min(0).required(),
    discount: Joi.number().min(0).max(100),
    promoted: Joi.number().min(0),
    options: Joi.string(),
    images: Joi.array(),
  };

  return Joi.validate(product, schema);
}
function validateProductUpdate(product) {
  const schema = {
    name: Joi.string().max(100),
    ref: Joi.string().max(100),
    description: Joi.string(),
    brand: Joi.string(),
    category: Joi.objectId(),
    price: Joi.number().min(0),
    priceHT: Joi.number().min(0),
    discount: Joi.number().min(0).max(100),
    promoted: Joi.number().min(0),
    options: Joi.array().items(
      Joi.object({
        qty: Joi.number().min(0),
        option: Joi.string(),
      })
    ),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
exports.validateUpdate = validateProductUpdate;
