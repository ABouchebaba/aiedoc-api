const { Admin } = require("../models/admin");

// checks if user is admin
module.exports = async (req, res, next) => {
  const admin = await Admin.findById(req.user._id);

  if (!admin) return res.status(400).send("Invalid token");

  next();
};
