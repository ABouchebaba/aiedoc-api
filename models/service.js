const mongoose = require("mongoose");
const Joi = require("joi");

let serviceSchema = new mongoose.Schema(
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
    },
    type: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

serviceSchema.statics.create = function(s) {
  let service = new Service(s);
  return service.save();
};

serviceSchema.statics.update = function(id, s) {
  return Service.findByIdAndUpdate(id, s, { new: true });
};

const Service = mongoose.model("Service", serviceSchema);

function validateService(service) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    price: Joi.number()
      .min(0)
      .required(),
    type: Joi.string()
      .max(100)
      .required()
  };

  return Joi.validate(service, schema);
}

exports.Service = Service;
exports.validate = validateService;
