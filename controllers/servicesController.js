const { Service } = require("../models/service");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports._create = async (req, res) => {
  const service = await Service.create(req.body);
  res.send(service);
};

module.exports._read = async (req, res) => {
  const services = await Service.find(); //.sort("name");
  res.send(services);
};

module.exports._read_id = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) return res.status(404).send("Service not found");

  res.send(service);
};

module.exports._update = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!service) return res.status(404).send("Service not found");

  res.send(service);
};

module.exports._update_image = async (req, res) => {
  const oldService = await Service.findByIdAndUpdate(req.params.id, {
    image: req.body.image,
  });

  if (oldService.image) {
    unlinkAsync(path.join("public", oldService.image))
      .then((response) => {
        oldService.image = req.body.image;
        res.send(oldService);
      })
      .catch((err) => {
        res
          .status(500)
          .send("An unexpected error occured while deleting old image");
      });
  } else {
    oldService.image = req.body.image;
    res.send(oldService);
  }
};

module.exports._delete = async (req, res) => {
  /**
   * Remove image before service object
   */

  const service = await Service.findByIdAndRemove(req.params.id);

  if (!service) return res.status(404).send("Service not found");

  fs.exists(path.join("public", service.image), (exists) => {
    if (exists) {
      unlinkAsync(path.join("public", service.image))
        .then((response) => {
          res.send(service);
        })
        .catch((err) => {
          res
            .status(500)
            .send("An unexpected error occured while deleting image");
        });
    }
  });
};
