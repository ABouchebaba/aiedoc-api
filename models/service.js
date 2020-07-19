const mongoose = require("mongoose");
const Joi = require("joi");

let serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

function validateService(service) {
  const schema = {
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().min(0),
    image: Joi.string(),
    level: Joi.string().min(1).max(100).required(),
    parent: Joi.objectId(),
  };

  return Joi.validate(service, schema);
}

function validateServiceUpdate(service) {
  const schema = {
    name: Joi.string().min(3).max(100),
    price: Joi.number().min(0),
    level: Joi.string().min(1).max(100),
    parent: Joi.objectId(),
  };

  return Joi.validate(service, schema);
}

exports.Service = Service;
exports.validate = validateService;
exports.validateUpdate = validateServiceUpdate;
