const { deleteFiles } = require("./files");

const parseJson = (...fields) => {
  return async (req, res, next) => {
    for (let i = 0; i < fields.length; i++) {
      let f = fields[i];
      try {
        req.body[f] = await JSON.parse(req.body[f]);
        //console.log(req.body[f]);
      } catch (e) {
        deleteFiles(req.files);
        return res.status(400).send("Unexpected json format in field : " + f);
      }
    }

    next();
  };
};

module.exports.parseJson = parseJson;
