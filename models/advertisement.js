const mongoose = require("mongoose");
const Joi = require("joi");

let advertisementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

function validateAdvertisement(advertisement) {
  const schema = {
    name: Joi.string().max(100).required(),
    url: Joi.string().required(),
    image: Joi.string().required(),
  };

  return Joi.validate(advertisement, schema);
}
function validateAdvertisementUpdate(advertisement) {
  const schema = {
    name: Joi.string().max(100),
    url: Joi.string(),
    image: Joi.string(),
  };

  return Joi.validate(advertisement, schema);
}

exports.Advertisement = Advertisement;
exports.validate = validateAdvertisement;
exports.validateUpdate = validateAdvertisementUpdate;
