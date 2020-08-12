const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const location = require("./location");
const {
  WILAYAS,
  STATES,
  NOT_READY,
  STATUSES,
  NOT_VALIDATED,
  DIPLOMAS,
} = require("../constants/serviceProvider");
const axios = require("axios");

const spSchema = new mongoose.Schema(
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
    sex: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    birthdate: { type: Date, required: true },
    wilaya: { type: String, enum: WILAYAS, required: true },
    commune: { type: String, required: true },
    jobTitle: { type: String, maxlength: 255, required: true },
    balance: { type: Number, default: 0 },
    amountToPay: { type: Number, default: 0 },
    location: { type: location, index: "2dsphere" },
    rating: { type: Number, min: 0, max: 5 },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    picture: String,
    diplomas: {
      type: [
        {
          type: {
            type: String,
            // enum: DIPLOMAS,
          },
          description: {
            type: String,
            maxlength: 255,
          },
          file: {
            type: String,
          },
        },
      ],
      required: true,
    },
    percentToPay: {
      type: Number,
      min: 0,
      max: 100,
      default: 20,
    },
    state: {
      type: String,
      enum: STATES,
      default: NOT_READY,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: NOT_VALIDATED,
    },
    busy: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    payments: [{ date: Date, amount: Number }],
    pushNotificationId: String,
  },
  {
    timestamps: true,
  }
);

spSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, roles: ["sp"] },
    config.get("jwtPrivateKey")
  );
};

spSchema.methods.notify = function (intervention) {
  // put app id in env or config file
  axios
    .post("https://onesignal.com/api/v1/notifications", {
      app_id: "aac6ed8b-9b71-4cd7-95c4-dc0931101a87",
      include_player_ids: [this.pushNotificationId],
      data: intervention,
      android_channel_id: "70f69b26-02b2-492a-91ff-4dc2336aa4c6",
      huawei_channel_id: "70f69b26-02b2-492a-91ff-4dc2336aa4c6",
      contents: { en: "Vous avez reçu une demande d'intervention." },
    })
    .then((res) => {
      console.log("sp notified !!!!!!");
    })
    .catch((err) => {
      console.log("An error occured while notifying sp " + err.message);
    });
};

const ServiceProvider = mongoose.model("ServiceProvider", spSchema);

function validateSP(sp) {
  const schema = {
    phone: Joi.string()
      .regex(/\+\d{12}/)
      .required(),
    firstname: Joi.string().min(2).max(50).required(),
    lastname: Joi.string().min(2).max(50).required(),
    sex: Joi.string().valid("male", "female").required(),
    jobTitle: Joi.string().max(255).required(),
    rating: Joi.number().min(0).max(5),
    birthdate: Joi.date().required(),
    picture: Joi.string().required(),
    email: Joi.string().email(),
    wilaya: Joi.string()
      .valid(...WILAYAS)
      .required(),
    pushNotificationId: Joi.string(),
    commune: Joi.string().required(),
    diplomas: Joi.array().items(
      Joi.object({
        type: Joi.string().required(),
        description: Joi.string().required(),
        file: Joi.any().required(),
      })
    ),
    // types: Joi.array(), //.items(Joi.string().valid(DIPLOMAS)),
    // descriptions: Joi.array(), //.items(Joi.string().max(255)),
    // docs: Joi.array(), //.items(Joi.object()),
    services: Joi.array().items(Joi.objectId().required()),
  };

  return Joi.validate(sp, schema);
}

function validatePhone(phone) {
  const schema = {
    phone: Joi.string()
      .regex(/\+\d{12}/)
      .required(),
    pushNotificationId: Joi.string().required(),
  };

  return Joi.validate(phone, schema);
}

exports.ServiceProvider = ServiceProvider;
exports.validate = validateSP;
exports.validatePhone = validatePhone;
