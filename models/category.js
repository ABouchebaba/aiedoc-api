const mongoose = require("mongoose");
const Joi = require("joi");

let categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    image: {
      type: String,
    },
    level: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
  const schema = {
    name: Joi.string().min(1).max(100).required(),
    image: Joi.string(),
    level: Joi.string().min(1).max(100).required(),
    parent: Joi.objectId(),
  };

  return Joi.validate(category, schema);
}

function validateCategoryUpdate(category) {
  const schema = {
    name: Joi.string().min(1).max(100),
    level: Joi.string().min(1).max(100),
    parent: Joi.objectId(),
  };

  return Joi.validate(category, schema);
}

exports.Category = Category;
exports.validate = validateCategory;
exports.validateUpdate = validateCategoryUpdate;
