const { Intervention } = require("../models/intervention");
const { Client } = require("../models/client");
const { ServiceProvider } = require("../models/serviceProvider");

/* !Services populated  */
module.exports._create = async (req, res) => {
  let intervention = await Intervention.create(req.body);

  const res1 = await Client.findByIdAndUpdate(intervention.client_id, {
    $push: { interventions: intervention._id },
  });

  const res2 = await ServiceProvider.findByIdAndUpdate(intervention.sp_id, {
    $push: { interventions: intervention._id },
  });

  // intervention = await intervention.populate("services").execPopulate();

  res.send(intervention);
};

module.exports._read = async (req, res) => {
  const interventions = await Intervention.find()
    .populate("client_id", "firstname lastname phone")
    .populate("sp_id", "firstname lastname phone"); //.sort("name");
  res.send(interventions);
};

/* Services populated */
module.exports._read_id = async (req, res) => {
  const intervention = await Intervention.findById(req.params.id)
    .populate("client_id", "firstname lastname phone")
    .populate("sp_id", "firstname lastname phone")
    .populate("services");

  if (!intervention) return res.status(404).send("Intervention not found");

  res.send(intervention);
};

// module.exports._read_name = async (req, res) => {
//   const searchQuery = new RegExp(`.*${req.params.name}.*`, "i");

//   const courses = await Course.find({ name: searchQuery });

//   res.send(courses);
// };

// module.exports._update = async (req, res) => {
//   const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
//     new: true
//   });
//   if (!service) return res.status(404).send("Service not found");

//   res.send(service);
// };

// module.exports._delete = async (req, res) => {
//   const service = await Service.findByIdAndRemove(req.params.id);

//   if (!service) return res.status(404).send("Service not found");

//   res.send(service);
// };
