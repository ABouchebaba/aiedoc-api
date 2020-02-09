const { ServiceProvider } = require("../models/serviceProvider");
const _ = require("lodash");

/// TODO: Add relevant attributes
module.exports._create = async (req, res) => {
  let sp = await ServiceProvider.findOne({ phone: req.body.phone });
  if (sp) return res.status(400).send("Service provider already registered");

  sp = await ServiceProvider.create(
    _.pick(req.body, [
      "email",
      "phone",
      "firstname",
      "lastname",
      "picture",
      "birthdate",
      "wilaya",
      "commune",
      "adress",
      "experience",
      "diplomas",
      "services",
      "description"
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
  const sp = await ServiceProvider.findById(req.user._id);
  if (!sp) return res.status(404).send("Service provider id not found");

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
