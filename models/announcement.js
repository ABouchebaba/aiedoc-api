// const mongoose = require("mongoose");
// const Joi = require("joi");

// let announcementSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     minlength: 3,
//     maxlength: 100
//   },
//   message: {
//     type: String,
//     maxlength: 255
//   },
//   attached: [{}]
// });

// announcementSchema.statics.create = function(body) {
//   let announcement = new Announcement(body);
//   return announcement.save();
// };

// announcementSchema.statics.update = function(id, body) {
//   return Announcement.findByIdAndUpdate(id, body, { new: true });
// };

// const Announcement = mongoose.model("Announcement", announcementSchema);

// function validateAnnouncement(announcement) {
//   const schema = {
//     title: Joi.string()
//       .min(3)
//       .max(100)
//       .required(),
//     message: Joi.string().max(255),
//     attached: Joi.array()
//   };

//   return Joi.validate(announcement, schema);
// }

// exports.Announcement = Announcement;
// exports.validate = validateAnnouncement;
