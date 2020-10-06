const mongoose = require("mongoose");
const Joi = require("joi");
const {
  PENDING,
  COMMAND_STATUSES,
  COMMAND_TYPES,
} = require("../constants/command");

let commandSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "user_type",
      required: true,
    },
    user_type: {
      type: String,
      required: true,
      enum: ["Client", "ServiceProvider"],
    },
    address: {
      type: String,
      required: true,
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
    type: {
      type: String,
      enum: COMMAND_TYPES,
      required: true,
    },
    promoCode: {
      type: String,
      default: null,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          min: 1,
          default: 1,
        },
        option: String,
        from: {
          type: Date,
          default: null,
        },
        to: {
          type: Date,
          default: null,
        },
        returned: {
          type: Boolean,
          default: false,
        },
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
    user: Joi.objectId().required(),
    user_type: Joi.string().required(),
    address: Joi.string().required(),
    total_price: Joi.number().min(0).required(),
    products: Joi.array()
      .items(
        Joi.object({
          product: Joi.objectId().required(),
          qty: Joi.number().min(1).required(),
          option: Joi.string().required(),
          from: Joi.date(),
          to: Joi.date(),
        })
      )
      .required(),
    type: Joi.string().valid(COMMAND_TYPES).required(),
    promoCode: Joi.string(),
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
