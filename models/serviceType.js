const mongoose = require("mongoose");
const Joi = require("joi");

let serviceTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    }
  },
  {
    timestamps: true
  }
);

const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);

function validateServiceType(serviceType) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
  };

  return Joi.validate(serviceType, schema);
}

exports.ServiceType = ServiceType;
exports.validate = validateServiceType;
