const documentExists = (Model) => {
  return async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return res
        .status(404)
        .send(`${Model.collection.collectionName} not found`);
    }

    next();
  };
};

module.exports.documentExists = documentExists;
