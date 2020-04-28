const mongoose = require("mongoose");
const Joi = require("joi");

let productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
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
  discount: {
    type: Number,
    min: 0,
    max: 100,
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
    brand: Joi.string().required(),
    category: Joi.objectId().required(),
    price: Joi.number().min(0).required(),
    discount: Joi.number().min(0).max(100),
    options: Joi.array().items(
      Joi.object({
        qty: Joi.number().min(0).required(),
        option: Joi.string().required(),
      })
    ),
    images: Joi.array().items(Joi.string()),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
