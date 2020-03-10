module.exports = function(params) {
  return (req, res, next) => {
    Object.keys(params).forEach(key => {
      req.body[params[key]] = req.params[key];
    });
    next();
  };
};
