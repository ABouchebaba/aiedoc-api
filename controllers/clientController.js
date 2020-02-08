const { Client } = require("../models/client");
const _ = require("lodash");

/// TODO: Add relevant attributes
module.exports._create = async (req, res) => {
  let client = await Client.findOne({ phone: req.body.phone });
  if (client) return res.status(400).send("Client already registered");

  client = await Client.create(
    _.pick(req.body, [
      "email",
      "phone",
      "firstname",
      "lastname",
      "picture",
      "birthdate"
    ])
  );

  const token = client.generateAuthToken();

  return res.header("x-auth-token", token).send(client);
};

module.exports._read = async (req, res) => {
  const client = await Client.findById(req.user._id);
  if (!client) return res.status(404).send("Client id not found");

  return res.send(client);
};

module.exports._verifyPhone = async (req, res) => {
  const client = await Client.findOne({ phone: req.body.phone });
  if (client) {
    const token = client.generateAuthToken();
    return res.header("x-auth-token", token).send(client);
  }

  return res.status(404).send("No client with this phone number was found");
};
