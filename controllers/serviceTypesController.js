const { ServiceType } = require("../models/serviceType");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  const serviceType = await ServiceType.create(req.body);
  res.send(serviceType);
};

module.exports._read = async (req, res) => {
  const serviceTypes = await ServiceType.find(); //.sort("name");
  res.send(serviceTypes);
};

module.exports._read_id = async (req, res) => {
  const serviceType = await ServiceType.findById(req.params.id);

  if (!serviceType) return res.status(404).send("Service not found");

  res.send(serviceType);
};

module.exports._addService = async (req, res) => {
  const serviceType = await ServiceType.findByIdAndUpdate(
    req.params.id,
    { $push: { services: req.body } },
    { new: true }
  );
  if (!serviceType) return res.status(404).send("Service not found");

  res.send(serviceType);
};

module.exports._deleteService = async (req, res) => {
  const serviceType = await ServiceType.findByIdAndUpdate(
    req.params.id,
    { $pull: { services: { _id: req.params.sid } } },
    { new: true }
  );
  if (!serviceType) return res.status(404).send("Service not found");

  res.send(serviceType);
};

// module.exports._read_name = async (req, res) => {
//   const searchQuery = new RegExp(`.*${req.params.name}.*`, "i");

//   const courses = await Course.find({ name: searchQuery });

//   res.send(courses);
// };

module.exports._update = async (req, res) => {
  const serviceType = await ServiceType.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true
    }
  );
  if (!serviceType) return res.status(404).send("Service not found");

  res.send(serviceType);
};

module.exports._delete = async (req, res) => {
  const serviceType = await ServiceType.findByIdAndRemove(req.params.id);

  if (!serviceType) return res.status(404).send("Service not found");

  res.send(serviceType);
};
