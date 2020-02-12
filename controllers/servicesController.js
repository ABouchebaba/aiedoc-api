const { Service } = require("../models/service");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  const service = await Service.create(req.body);
  res.send(service);
};

module.exports._read = async (req, res) => {
  const services = await Service.find(); //.sort("name");
  res.send(services);
};

module.exports._read_id = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) return res.status(404).send("Service not found");

  res.send(service);
};

// module.exports._read_name = async (req, res) => {
//   const searchQuery = new RegExp(`.*${req.params.name}.*`, "i");

//   const courses = await Course.find({ name: searchQuery });

//   res.send(courses);
// };

module.exports._update = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!service) return res.status(404).send("Service not found");

  res.send(service);
};

module.exports._delete = async (req, res) => {
  const service = await Service.findByIdAndRemove(req.params.id);

  if (!service) return res.status(404).send("Service not found");

  res.send(service);
};
