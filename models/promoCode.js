const mongoose = require("mongoose");
const Joi = require("joi");

let promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

function validatePromoCode(promoCode) {
  const schema = {
    code: Joi.string().min(3).max(100).required(),
    discount: Joi.number().min(0).max(100).required(),
  };

  return Joi.validate(promoCode, schema);
}

function validatePromoCodeUpdate(promoCode) {
  const schema = {
    code: Joi.string().min(3).max(100),
    discount: Joi.number().min(0).max(100),
  };

  return Joi.validate(promoCode, schema);
}

exports.PromoCode = PromoCode;
exports.validate = validatePromoCode;
exports.validateUpdate = validatePromoCodeUpdate;
