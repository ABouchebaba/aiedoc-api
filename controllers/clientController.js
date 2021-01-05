const { Client } = require("../models/client");
const { ServiceProvider } = require("../models/serviceProvider");
const _ = require("lodash");
const { generateAffiliateCode } = require("../helper/generate");
const { AuthPoints } = require("../constants/points");

module.exports._read = async (req, res) => {
  const client = await Client.find();
  return res.send(client);
};

/// TODO: Add relevant attributes
module.exports._create = async (req, res) => {
  let client = await Client.findOne({ phone: req.body.phone });
  if (client) return res.status(400).send("Client already registered");

  const codeAffiliate = generateAffiliateCode();

  client = await Client.create(
    _.pick(
      {
        ...req.body,
        codeAffiliate: codeAffiliate,
      },
      [
        "email",
        "phone",
        "firstname",
        "lastname",
        "picture",
        "birthdate",
        "codeAffiliate",
        "codeAffiliatedTo",
      ]
    )
  );

  const addPointsSp = await ServiceProvider.findOneAndUpdate(
    { codeAffiliate: req.body.codeAffiliatedTo },
    { $inc: { score: AuthPoints } }
  );
  if (!addPointsSp) {
    await Client.findOneAndUpdate(
      { codeAffiliate: req.body.codeAffiliatedTo },
      { $inc: { score: AuthPoints } }
    );
  }

  const token = client.generateAuthToken();

  return res.header("x-auth-token", token).send(client);
};

module.exports._read_id = async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).send("Client id not found");

  return res.send(client);
};

module.exports._interventions = async (req, res) => {
  const client = await Client.findById(req.params.id)
    .populate({
      path: "interventions",
      populate: { path: "services" },
    })
    .select("interventions");
  if (!client) return res.status(404).send("Client id not found");

  return res.send(client.interventions);
};

module.exports._commands = async (req, res) => {
  const client = await Client.findById(req.params.id).populate({
    path: "commands",
    populate: { path: "products.product", select: "name price" },
    // select: "commands",
  });
  if (!client) return res.status(404).send("Client id not found");

  return res.send(client.commands);
};

module.exports._verifyPhone = async (req, res) => {
  const client = await Client.findOne({ phone: req.body.phone });
  if (client) {
    const token = client.generateAuthToken();
    return res.header("x-auth-token", token).send(client);
  }

  return res.status(404).send("Client Not found");
};
