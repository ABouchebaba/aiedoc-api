const { Command } = require("../models/command");
const { ServiceProvider } = require("../models/serviceProvider");
const { Client } = require("../models/client");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  const command = await Command.create(req.body);
  let User = command.user_type === "Client" ? Client : ServiceProvider;

  await User.findByIdAndUpdate(command.user_id, {
    $push: { commands: command._id },
  });
  res.send(command);
};

module.exports._read = async (req, res) => {
  const commands = await Command.find(); //.sort("name");
  res.send(commands);
};

module.exports._read_id = async (req, res) => {
  const command = await Command.findById(req.params.id)
    .populate("products.product", "-options")
    .populate("user_id", "firstname lastname phone");

  if (!command) return res.status(404).send("Command not found");

  res.send(command);
};

// module.exports._update = async (req, res) => {
//   const command = await Command.findByIdAndUpdate(req.params.id, req.body, {
//     new: true
//   });
//   if (!command) return res.status(404).send("Command not found");

//   res.send(command);
// };

module.exports._update_status = async (req, res) => {
  const command = await Command.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
    }
  );
  if (!command) return res.status(404).send("Command not found");

  res.send(command);
};

// module.exports._delete = async (req, res) => {
//   const command = await Command.findByIdAndRemove(req.params.id);

//   if (!command) return res.status(404).send("Command not found");

//   res.send(command);
// };
