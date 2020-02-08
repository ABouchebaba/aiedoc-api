const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

const roles = ["admin", "admin_1", "admin_2"];

const adminSchema = new mongoose.Schema({
  username: { type: String, minlength: 2, maxlength: 50, unique: true },
  firstname: { type: String, minlength: 2, maxlength: 50 },
  lastname: { type: String, minlength: 2, maxlength: 50 },
  birthdate: Date,
  picture: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(v) {
        const up = v.match(/.*[A-Z]+.*/);
        const low = v.match(/.*[a-z]+.*/);
        const num = v.match(/.*[0-9]+.*/);
        return up && low && num;
      },
      message:
        "Password must contain an uppercase letter, a lowercase letter and a number"
    }
  },
  roles: {
    type: [
      {
        type: String,
        enum: roles
      }
    ],
    required: true,
    validate: {
      validator: function(r) {
        return r && r.length > 0;
      },
      message: "At least 1 user role must be provided"
    }
  }
});

adminSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, roles: this.roles },
    config.get("jwtPrivateKey")
  );
};

adminSchema.statics.create = async function(adminInfo) {
  admin = new Admin(adminInfo);
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);

  return admin.save();
};

const Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(admin) {
  const schema = {
    username: Joi.string()
      .min(2)
      .max(50)
      .required(),
    firstname: Joi.string()
      .min(2)
      .max(50)
      .required(),
    lastname: Joi.string()
      .min(2)
      .max(50)
      .required(),
    birthdate: Joi.date(),
    picture: Joi.string(),
    email: Joi.string()
      .email()
      .required(),
    roles: Joi.array()
      .min(1)
      .items(Joi.valid(...roles))
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  };

  return Joi.validate(admin, schema);
}

function validateLogin(loginInfo) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  };

  return Joi.validate(loginInfo, schema);
}

exports.Admin = Admin;
exports.validate = validateAdmin;
exports.validateLogin = validateLogin;
