const mongoose = require("mongoose");
const Joi = require("joi");

let categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
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
});

categorySchema.pre("findOneAndRemove", async function (next) {
  // do something

  // await Category.deleteMany({ parent: this._id });
  console.log("pré");
  console.log(this._id);

  next();
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
  const schema = {
    name: Joi.string().min(1).max(100).required(),
    level: Joi.string().min(1).max(100).required(),
    parent: Joi.objectId(),
  };

  return Joi.validate(category, schema);
}

exports.Category = Category;
exports.validate = validateCategory;
