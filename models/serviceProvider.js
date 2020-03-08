const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const location = require("./location");

const wilayas = ["Alger", "Annaba", "Constantine", "Oran", "Tizi Ouzou"];
const spStates = ["notReady", "Ready", "EmergencyReady"];
const spStatuses = ["not validated", "validated", "banned"];
const types = ["Licence", "Master", "Doctorat", "Technicien"];

const spSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [true, "User phone number required"]
    },
    firstname: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true
    },
    lastname: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true
    },
    birthdate: { type: Date, required: true },
    wilaya: { type: String, enum: wilayas, required: true },
    commune: { type: String, required: true },
    adress: { type: String, required: true },
    experience: {
      type: [
        {
          jobTitle: {
            type: String,
            maxlength: 255
          },
          from: Date,
          to: Date
        }
      ],
      required: true
    },
    diplomas: {
      type: [
        {
          type: {
            type: String,
            enum: types
          },
          description: {
            type: String,
            maxlength: 255
          },
          file: {
            type: String
          }
        }
      ],
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    state: {
      type: String,
      enum: spStates,
      default: spStates[0]
    },
    status: {
      type: String,
      enum: spStatuses,
      default: spStatuses[0]
    },
    services: [String],
    picture: String,
    description: {
      type: String,
      maxlength: 255
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    interventions: [
      {
        intervention_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Intervention",
          required: true
        },
        client_name: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          required: true
        },
        totalPrice: {
          type: Number,
          required: true
        }
      }
    ],
    location: {
      type: location
      // required: true
    },
    payments: [
      {
        date: Date,
        amount: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

spSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const ServiceProvider = mongoose.model("ServiceProvider", spSchema);

function validateSP(sp) {
  const schema = {
    phone: Joi.string()
      .length(10)
      .required(),
    firstname: Joi.string()
      .min(2)
      .max(50)
      .required(),
    lastname: Joi.string()
      .min(2)
      .max(50)
      .required(),
    birthdate: Joi.date().required(),
    picture: Joi.string(),
    email: Joi.string()
      .email()
      .required(),
    wilaya: Joi.string()
      .valid(...wilayas)
      .required(),
    commune: Joi.string().required(),
    adress: Joi.string().required(),
    experience: Joi.array().required(),
    diplomas: Joi.array().required(),
    services: Joi.array(),
    description: Joi.string().max(255)
  };

  return Joi.validate(sp, schema);
}

function validatePhone(phone) {
  const schema = {
    phone: Joi.string()
      .length(10)
      .required()
  };

  return Joi.validate(phone, schema);
}

exports.ServiceProvider = ServiceProvider;
exports.validate = validateSP;
exports.validatePhone = validatePhone;
