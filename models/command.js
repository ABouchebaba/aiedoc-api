const mongoose = require("mongoose");
const Joi = require("joi");
const { PENDING, COMMAND_STATUSES } = require("../constants/command");

let commandSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "user_type",
      required: true,
    },
    user_type: {
      type: String,
      required: true,
      enum: ["Client", "ServiceProvider"],
    },
    status: {
      type: String,
      enum: COMMAND_STATUSES,
      default: PENDING,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        product_name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          min: 1,
        },
        option: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Command = mongoose.model("Command", commandSchema);

function validateCommand(command) {
  const schema = {
    user_id: Joi.objectId().required(),
    user_type: Joi.string().required(),
    total_price: Joi.number().min(0).required(),
    products: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.objectId().required(),
          product_name: Joi.string().required(),
          qty: Joi.number().min(1).required(),
          option: Joi.string().required(),
        })
      )
      .required(),
  };

  return Joi.validate(command, schema);
}

function validateStatus(status) {
  const schema = {
    status: Joi.string().valid(COMMAND_STATUSES).required(),
  };
  return Joi.validate(status, schema);
}

exports.Command = Command;
exports.validate = validateCommand;
exports.validateStatus = validateStatus;
