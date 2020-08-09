const { Command } = require("../models/command");
const { Product } = require("../models/product");
const { ServiceProvider } = require("../models/serviceProvider");
const { Client } = require("../models/client");
const { COMPLETED } = require("../constants/command");
const _ = require("lodash");

module.exports._create = async (req, res) => {
  const command = await Command.create(req.body);
  let User = command.user_type === "Client" ? Client : ServiceProvider;

  await User.findByIdAndUpdate(command.user, {
    $push: { commands: command._id },
  });
  res.send(command);
};

module.exports._read = async (req, res) => {
  const commands = await Command.find()
    .populate("products.product", "name price")
    .populate("user", "firstname lastname"); //.sort("name");
  res.send(commands);
};

module.exports._read_id = async (req, res) => {
  const command = await Command.findById(req.params.id)
    .populate("products.product", "-options")
    .populate("user", "firstname lastname phone");

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

  if (req.body.status === COMPLETED) {
    /**Updating products' quantities after command confirmed(compelete) */
    const { products } = command;

    const r = await Promise.all(
      products.map((p) =>
        Product.findOneAndUpdate(
          { _id: p.product, "options.option": p.option },
          {
            $inc: { "options.$.qty": -p.qty },
          }
        )
      )
    );

    // console.log(r);
  }

  res.send(command);
};

/**
 * 1. params are : command id, product index (id given by mongoose in command.products)
 * 2. find command by id
 * 3. find product in command by index
 * 4. update product qty
 * 5. mark product as returned in command
 */
module.exports._return_product = async (req, res) => {
  const command = await Command.findById(req.params.id);

  if (!command) return res.status(404).send("Command not found");
  if (command.status !== COMPLETED)
    return res
      .status(400)
      .send("Cannot return product from uncomplete command");

  const product = command.products.id(req.params.index);

  if (!product) return res.status(404).send("Command product not found");
  if (!product.from)
    return res.status(400).send("Only rent products can be returned");
  if (product.returned) return res.status(400).send("Product already returned");

  const new_product = await Product.findOneAndUpdate(
    { _id: product.product, "options.option": product.option },
    {
      $inc: { "options.$.qty": product.qty },
    },
    { new: true }
  );

  console.log(new_product);

  const new_command = await Command.findOneAndUpdate(
    {
      _id: req.params.id,
      "products._id": req.params.index,
    },
    {
      "products.$.returned": true,
    },
    {
      new: true,
    }
  );

  res.send(new_command);
};

// module.exports._delete = async (req, res) => {
//   const command = await Command.findByIdAndRemove(req.params.id);

//   if (!command) return res.status(404).send("Command not found");

//   res.send(command);
// };
