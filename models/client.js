const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const location = require("./location");

const clientSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /\+\d{12}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "User phone number required"],
    },
    firstname: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    lastname: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    birthdate: { type: Date, required: true },
    picture: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: location,
    },
    interventions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Intervention",
      },
    ],
    commands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Command",
      },
    ],
  },
  {
    timestamps: true,
  }
);

clientSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, roles: ["client"] },
    config.get("jwtPrivateKey")
  );
};

clientSchema.statics.create = async function (userInfo) {
  client = await Client.findOne({ phone: userInfo.phone });
  if (client) return client;

  client = new Client(userInfo);
  return client.save();
};

const Client = mongoose.model("Client", clientSchema);

function validateClient(client) {
  const schema = {
    phone: Joi.string()
      .regex(/\+\d{12}/)
      .required(),
    firstname: Joi.string().min(2).max(50).required(),
    lastname: Joi.string().min(2).max(50).required(),
    birthdate: Joi.date().required(),
    email: Joi.string().email().required(),
    picture: Joi.string(),
  };

  return Joi.validate(client, schema);
}

function validatePhone(phone) {
  const schema = {
    phone: Joi.string()
      .regex(/\+\d{12}/)
      .required(),
  };

  return Joi.validate(phone, schema);
}

exports.Client = Client;
exports.validate = validateClient;
exports.validatePhone = validatePhone;
