const { Payment } = require("../models/payment");
const _ = require("lodash");

module.exports._read = async (req, res) => {
  const payments = await Payment.find(); //.sort("name");
  res.send(payments);
};
