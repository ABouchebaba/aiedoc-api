const _ = require("lodash");

/*
 * returns a dynamically generated middleware function
 * to test role authorization of user
 */

module.exports = function(roles) {
  return (req, res, next) => {
    // admins might have differente roles, clients and SPs don't
    // req.user.roles will be undefined for clients and SPs
    // so they will be treated as admins who don't have the relevant role
    // that explains this code => '|| []'
    const role_intersect = _.intersection(roles, req.user.roles || []);

    if (role_intersect.length == 0)
      return res.status(403).send("Unauthorized action");

    next();
  };
};
