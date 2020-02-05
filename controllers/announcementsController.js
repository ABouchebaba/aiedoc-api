// const { Announcement } = require("../models/announcement");
// const { save } = require("./fileController");
// const _ = require("lodash");

// // this directory is in /public
// const basePath = "Uploads/Ressources";
// //
// module.exports._create = async (req, res) => {
//   // Here user._id is used as prefix for filename ...
//   req.body.attached = await save(req.files, basePath, req.user._id);

//   const announcement = await Announcement.create(req.body);
//   res.send(announcement);
// };

// module.exports._read = async (req, res) => {
//   const announcements = await Announcement.find().sort("title");
//   res.send(announcements);
// };

// module.exports._read_id = async (req, res) => {
//   const announcement = await Announcement.findById(req.params.id);

//   if (!announcement) return res.status(404).send("Course not found");

//   res.send(announcement);
// };

// module.exports._update = async (req, res) => {
//   const announcement = await Announcement.update(req.params.id, req.body);

//   if (!announcement) return res.status(404).send("Course not found");

//   res.send(announcement);
// };

// module.exports._delete = async (req, res) => {
//   const announcement = await Announcement.findByIdAndRemove(req.params.id);

//   if (!announcement) return res.status(404).send("Course not found");

//   res.send(announcement);
// };
