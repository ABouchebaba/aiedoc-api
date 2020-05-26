const { Admin } = require("../models/admin");
const _ = require("lodash");
const bcrypt = require("bcrypt");

module.exports._read = async (req, res) => {
  const admins = await Admin.find().select("-password");
  return res.send(admins);
};

module.exports._read_id = async (req, res) => {
  const admin = await Admin.findById(req.params.id).select("-password");
  if (!admin) return res.status(404).send("Admin id not found");

  return res.send(admin);
};

module.exports._create = async (req, res) => {
  let admin = await Admin.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });
  if (admin) return res.status(400).send("Admin already registered");

  admin = await Admin.create(
    _.pick(req.body, [
      "username",
      "firstname",
      "lastname",
      "email",
      "birthdate",
      "picture",
      "password",
      "roles",
    ])
  );

  const token = admin.generateAuthToken();

  return res
    .header("x-auth-token", token)
    .send(_.pick(admin, ["_id", "email"]));
};

module.exports._authenticate = async (req, res) => {
  let admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(400).send("Invalid email or password");

  const passwordValid = await bcrypt.compare(req.body.password, admin.password);
  if (!passwordValid) return res.status(400).send("Invalid email or password");

  const token = admin.generateAuthToken();
  return res
    .header("x-auth-token", token)
    .send(
      _.pick(admin, [
        "username",
        "firstname",
        "lastname",
        "email",
        "birthdate",
        "picture",
        "roles",
      ])
    );
};

module.exports._delete = async (req, res) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) return res.status(404).send("Admin id not found");

  return res.send(admin);
};
