const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const {
  INTERVENTION_STATES,
  PENDING,
  INTERVENTION_TYPES,
  REGULAR,
} = require("../constants/intervention");

const interventionSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    sp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    services: [
      {
        type: String,
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    client_comment: {
      type: String,
      max: 255,
    },
    sp_comment: {
      type: String,
      max: 255,
    },
    client_rating: {
      type: Number,
      max: 5,
      min: 0,
    },
    sp_rating: {
      type: Number,
      max: 5,
      min: 0,
    },
    state: {
      type: String,
      enum: INTERVENTION_STATES,
      default: PENDING,
    },
    type: {
      type: String,
      enum: INTERVENTION_TYPES,
      default: REGULAR,
    },
    refusedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/** Returns an intervention's summary :
 * _id, name = sp_name or client_name, createdAt, totalPrice
 * */
interventionSchema.methods.getSummary = function (type, name) {
  const summary = _.pick(this, ["_id", "createdAt", "totalPrice"]);
  summary["intervention_id"] = summary["_id"];
  summary["date"] = summary["createdAt"];
  ["_id", "createdAt"].map((k) => _.unset(summary, k));
  summary[type] = name;
  return summary;
};

const Intervention = mongoose.model("Intervention", interventionSchema);

function validateIntervention(intervention) {
  const schema = {
    client_id: Joi.objectId().required(),
    sp_id: Joi.objectId().required(),
    client_name: Joi.string().required(),
    sp_name: Joi.string().required(),
    services: Joi.array().items(Joi.string()).required(),
    totalPrice: Joi.number().min(0),
    client_comment: Joi.string().max(255),
    sp_comment: Joi.string().max(255),
    client_rating: Joi.number().min(0).max(5),
    sp_rating: Joi.number().min(0).max(5),
    state: Joi.string().valid(INTERVENTION_STATES),
    type: Joi.string().valid(INTERVENTION_TYPES),
    refusedBy: Joi.array().items(Joi.objectId()),
  };

  return Joi.validate(intervention, schema);
}

exports.Intervention = Intervention;
exports.validate = validateIntervention;
