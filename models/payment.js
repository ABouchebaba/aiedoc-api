const mongoose = require("mongoose");
const Joi = require("joi");

let paymentSchema = new mongoose.Schema(
  {
    sp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

function validatePayment(payment) {
  const schema = {
    sp_id: Joi.string().required(),
    amount: Joi.number()
      .min(0)
      .required()
  };

  return Joi.validate(payment, schema);
}

exports.Payment = Payment;
exports.validate = validatePayment;
