const { PromoCode } = require("../models/promoCode");

module.exports._create = async (req, res) => {
  const service = await PromoCode.create(req.body);
  res.send(service);
};

module.exports._read = async (req, res) => {
  const services = await PromoCode.find(); //.sort("name");
  res.send(services);
};

module.exports._read_id = async (req, res) => {
  const service = await PromoCode.findById(req.params.id);

  if (!service) return res.status(404).send("PromoCode not found");

  res.send(service);
};

module.exports._update = async (req, res) => {
  const service = await PromoCode.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!service) return res.status(404).send("PromoCode not found");

  res.send(service);
};

module.exports._delete = async (req, res) => {
  const service = await PromoCode.findByIdAndRemove(req.params.id);

  if (!service) return res.status(404).send("PromoCode not found");

  res.send(service);
};
