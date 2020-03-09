const _ = require("lodash");

/*
 * returns a dynamically generated middleware function
 * to test role authorization of user
 */

module.exports = function(roles) {
  return (req, res, next) => {
    const role_intersect = _.intersection(roles, req.user.roles);

    if (role_intersect.length == 0)
      return res.status(403).send("Unauthorized action");

    next();
  };
};
