const mongoose = require("mongoose");
const Joi = require("joi");

let serviceTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    },
    services: [
      {
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 100
        },
        price: {
          type: Number,
          required: true,
          min: 0
        }
      },
      {
        timestamps: true
      }
    ]
  },
  {
    timestamps: true
  }
);

const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);

function validateServiceType(service) {
  const schema = {
    type: Joi.string()
      .min(3)
      .max(100)
      .required(),
    services: Joi.array().items(
      Joi.object({
        name: Joi.string()
          .min(3)
          .max(100)
          .required(),
        price: Joi.number()
          .min(0)
          .required()
      })
    )
  };

  return Joi.validate(service, schema);
}

function validateService(service) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),

    price: Joi.number()
      .min(0)
      .required()
  };

  return Joi.validate(service, schema);
}

exports.ServiceType = ServiceType;
exports.validate = validateServiceType;
exports.validateService = validateService;
