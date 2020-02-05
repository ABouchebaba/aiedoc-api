// /**
//  * This will not be used, it is here just for copy/paste purpose
//  */

// const mongoose = require("mongoose");
// const Joi = require("joi");

// let studentSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   firstname: { type: String, required: true },
//   lastname: { type: String, required: true },
//   birthdate: Date,
//   picture: String,
//   courses: {
//     type: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Course"
//       }
//     ]
//     // validate: {
//     //   validator: function validate_nb_elements(v) {
//     //     return v && v.length >= 1;
//     //   },
//     //   message: "A student must be enrolled in , at least, 1 course"
//     // }
//   }
// });

// studentSchema.statics.create = async function(body) {
//   let student = new Student(req.body);

//   return student.save();
// };

// const Student = mongoose.model("Student", studentSchema);

// function validateStudent(student) {
//   const schema = {
//     firstname: Joi.string().required(),
//     lastname: Joi.string().required(),
//     birthdate: Joi.date(),
//     picture: Joi.string(),
//     courses: Joi.array()
//   };

//   return Joi.validate(student, schema);
// }

// exports.Student = Student;
// exports.validate = validateStudent;
