const { Advertisement } = require("../models/advertisement");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports._create = async (req, res) => {
  let cat = await Advertisement.findOne(req.body);
  if (cat) {
    return res.status(400).send("Advertisement already exists");
  }

  const advertisement = await Advertisement.create(req.body);
  res.send(advertisement);
};

module.exports._read = async (req, res) => {
  const advertisements = await Advertisement.find(); //.sort("name");
  res.send(advertisements);
};

module.exports._read_id = async (req, res) => {
  const advertisement = await Advertisement.findById(req.params.id);

  if (!advertisement) return res.status(404).send("Advertisement not found");

  res.send(advertisement);
};

module.exports._update = async (req, res) => {
  const advertisement = await Advertisement.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!advertisement) return res.status(404).send("Advertisement not found");

  res.send(advertisement);
};

module.exports._update_image = async (req, res) => {
  const oldAd = await Advertisement.findByIdAndUpdate(req.params.id, {
    image: req.body.image,
  });

  if (oldAd.image) {
    unlinkAsync(path.join("public", oldAd.image))
      .then((response) => {
        oldAd.image = req.body.image;
        res.send(oldAd);
      })
      .catch((err) => {
        res
          .status(500)
          .send("An unexpected error occured while deleting old image ", err);
      });
  } else {
    oldAd.image = req.body.image;
    res.send(oldAd);
  }
};
