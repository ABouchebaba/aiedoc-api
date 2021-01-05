const mongoose = require("mongoose");
const Joi = require("joi");

let advertisementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  location: {
    type: String,
    required: true,
    maxlength: 100,
    default: "",
  },
  url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

function validateAdvertisement(advertisement) {
  const schema = {
    name: Joi.string().max(100).required(),
    location: Joi.string().max(100).required(),
    url: Joi.string().required(),
    image: Joi.string().required(),
    isActive: Joi.boolean(),
  };

  return Joi.validate(advertisement, schema);
}
function validateAdvertisementUpdate(advertisement) {
  const schema = {
    name: Joi.string().max(100),
    location: Joi.string().max(100),
    url: Joi.string(),
    image: Joi.string(),
    isActive: Joi.boolean(),
  };

  return Joi.validate(advertisement, schema);
}

exports.Advertisement = Advertisement;
exports.validate = validateAdvertisement;
exports.validateUpdate = validateAdvertisementUpdate;
