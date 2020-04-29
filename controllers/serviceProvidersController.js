const { ServiceProvider } = require("../models/serviceProvider");
const { Payment } = require("../models/payment");
const { saveOne } = require("./fileController");
const _ = require("lodash");

/// TODO: Add relevant attributes
module.exports._create = async (req, res) => {
  let sp = await ServiceProvider.findOne({ phone: req.body.phone });
  if (sp) return res.status(400).send("Service provider already registered");

  // 1st .files comes from express upload module
  // 2nd .files comes from body key
  const files = Object.values(req.files.files);
  let diplomas = [];

  for (let i = 0; i < files.length; i++) {
    const dip = await saveOne(files[i], "files/diplomas");
    diplomas = [
      ...diplomas,
      {
        type: req.body.types[i],
        description: req.body.descriptions[i],
        file: dip,
      },
    ];
  }

  req.body.diplomas = diplomas;

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
      "diplomas",
    ])
  );

  const token = sp.generateAuthToken();

  return res.header("x-auth-token", token).send(sp);
};

module.exports._read = async (req, res) => {
  const sps = await ServiceProvider.find();
  return res.send(sps);
};

module.exports._read_id = async (req, res) => {
  const sp = await ServiceProvider.findById(req.params.id);
  if (!sp) return res.status(404).send("Service provider id not found");

  return res.send(sp);
};

module.exports._read_available = async (req, res) => {
  const sp = await ServiceProvider.find({
    state: "ready",
    status: "validated",
  });
  if (!sp) return res.status(404).send("No available service providers");

  return res.send(sp);
};

module.exports._verifyPhone = async (req, res) => {
  const sp = await ServiceProvider.findOne({ phone: req.body.phone });
  if (sp) {
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

module.exports._set_state = async (req, res) => {
  const sp = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    {
      state: req.body.state,
    },
    { new: true }
  );
  if (!sp) return res.status(404).send("Service provider id not found");

  return res.send(sp.state);
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

module.exports._interventions = async (req, res) => {
  const sp = await ServiceProvider.findById(req.params.id)
    .populate("interventions")
    .select("interventions");

  if (!sp) return res.status(404).send("Service Provider id not found");

  return res.send(sp.interventions);
};

module.exports._commands = async (req, res) => {
  const sp = await ServiceProvider.findById(req.params.id)
    .populate("commands")
    .select("commands");
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
      $inc: { amountToPay: -payment.amount },
      balance: 0,
    },
    { new: true }
  );

  return res.send(sp.payments);
};

module.exports._set_services = async (req, res) => {
  const sp = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    {
      services: req.body.services,
    },
    { new: true }
  );

  if (!sp) {
    return res.status(404).send("Service Provider not found");
  }

  res.send(sp);
};
