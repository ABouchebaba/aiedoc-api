const { ServiceProvider } = require("../models/serviceProvider");
const { Payment } = require("../models/payment");
const { saveOne, saveAs } = require("./fileController");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { deleteFiles } = require("../middlewares/files");

const { EMERGENCY_READY, VALIDATED } = require("../constants/serviceProvider");

const unlinkAsync = promisify(fs.unlink);

/// TODO: Implement validation !!!
/// ex :  case no picture || no docs
/* !Services populated  */
module.exports._create = async (req, res) => {
  let sp = await ServiceProvider.findOne({ phone: req.body.phone });
  if (sp) {
    // remove files ...
    deleteFiles(req.files);
    return res.status(400).send("Service provider already registered");
  }

  sp = await ServiceProvider.create(
    _.pick(req.body, [
      "email",
      "phone",
      "jobTitle",
      "firstname",
      "lastname",
      "birthdate",
      "wilaya",
      "commune",
      "sex",
      "services",
      "pushNotificationId",
      "diplomas",
      "picture",
    ])
  );

  // sp = await sp.populate("services").execPopulate();

  const token = sp.generateAuthToken();

  return res.header("x-auth-token", token).send(sp);
};

module.exports._read = async (req, res) => {
  const sps = await ServiceProvider.find();
  return res.send(sps);
};

/* !Services populated  */
module.exports._read_id = async (req, res) => {
  const sp = await ServiceProvider.findById(req.params.id).populate("services");
  if (!sp) return res.status(404).send("Service provider id not found");

  return res.send(sp);
};

module.exports._read_available = async (req, res) => {
  const sp = await ServiceProvider.find({
    state: { $in: ["ready", "emergencyReady"] },
    status: "validated",
    busy: false,
  });
  if (!sp) return res.status(404).send("No available service providers");

  return res.send(sp);
};

/* !Services populated  */
module.exports._verifyPhone = async (req, res) => {
  let sp = await ServiceProvider.findOneAndUpdate(
    { phone: req.body.phone },
    {
      pushNotificationId: req.body.pushNotificationId,
    },
    { new: true }
  );
  if (sp) {
    // sp = await sp.populate("services").execPopulate();
    const token = sp.generateAuthToken();
    return res.header("x-auth-token", token).send(sp);
  }

  return res
    .status(404)
    .send("No service provider with this phone number was found");
};

module.exports._validate = async (req, res) => {
  const sp = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    {
      status: "validated",
    },
    { new: true }
  );
  if (!sp) return res.status(404).send("Service provider id not found");

  return res.send(sp);
};

module.exports._set_percentToPay = async (req, res) => {
  const sp = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    {
      percentToPay: req.body.percentToPay,
    },
    { new: true }
  );
  if (!sp) return res.status(404).send("Service provider id not found");

  return res.send(sp);
};

module.exports._set_state = async (req, res) => {
  const { state, longitude, latitude } = req.body;
  const sp = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    {
      state,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    },
    { new: true }
  );
  if (!sp) return res.status(404).send("Service provider id not found");

  return res.send(sp.state);
};

module.exports._set_profile_picture = async (req, res) => {
  const sp = await ServiceProvider.findById(req.params.id);

  if (!sp) {
    // wrong sp id
    deleteFiles(req.files);
    return res.status(404).send("Service provider not found");
  }

  // sp good, picture good
  try {
    // delete existing picture from file system if exists
    if (sp.picture) await unlinkAsync(path.join("public", sp.picture));

    sp.picture = req.body.picture;
    await sp.save();
    return res.send(sp.picture);
  } catch (e) {
    // error while deleting picture or saving sp
    return res.status(500).send(e.message);
  }
};

module.exports._ban = async (req, res) => {
  const sp = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    {
      status: "banned",
    },
    { new: true }
  );
  if (!sp) return res.status(404).send("Service provider id not found");

  return res.send(sp);
};

/* !Services populated  */
module.exports._interventions = async (req, res) => {
  const sp = await ServiceProvider.findById(req.params.id)
    .populate({
      path: "interventions",
      // populate: { path: "services" },
    })
    .select("interventions");

  if (!sp) return res.status(404).send("Service Provider id not found");

  return res.send(sp.interventions);
};

module.exports._commands = async (req, res) => {
  const sp = await ServiceProvider.findById(req.params.id).populate({
    path: "commands",
    populate: { path: "products.product", select: "name price" },
    // select: "commands",
  });
  // .select("commands");
  if (!sp) return res.status(404).send("Service Provider id not found");

  return res.send(sp.commands);
};

module.exports._payments = async (req, res) => {
  const sp = await ServiceProvider.findById(req.params.id, "payments");
  if (!sp) return res.status(404).send("Service provider id not found");

  return res.send(sp.payments);
};

module.exports._add_payment = async (req, res) => {
  const payment = await Payment.create(req.body);

  const sp_payment = {
    amount: payment.amount,
    date: payment.createdAt,
  };

  const sp = await ServiceProvider.findByIdAndUpdate(
    payment.sp_id,
    {
      $push: { payments: sp_payment },
      balance: 0,
    },
    { new: true }
  );

  return res.send(sp.payments);
};

/* !Services populated  */
module.exports._set_services = async (req, res) => {
  let sp = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    {
      services: req.body.services,
    },
    { new: true }
  );

  if (!sp) {
    return res.status(404).send("Service Provider not found");
  }

  // sp = await sp.populate("services").execPopulate();

  res.send(sp);
};

module.exports._closestEmergencyReady = async (req, res) => {
  const sp = await ServiceProvider.find({
    state: EMERGENCY_READY,
    status: VALIDATED,
    services: { $in: req.body.services },
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: req.body.location,
        },
      },
    },
  }).limit(1);

  return res.send(sp);
};
