// const { User } = require("../models/user");

// module.exports._read = async (req, res) => {
//   const students = await User.find({ roles: "student" })
//     .select("-password")
//     .populate("courses", "name");
//   // .sort("class");
//   res.send(students);
// };

// module.exports._read_course_id = async (req, res, next) => {
//   const students = await User.find({ roles: "student", courses: req.params.id })
//     .select("-password")
//     .populate("courses", "name");

//   // if (!students) return res.status(404).send("Student not found");

//   res.send(students);
// };
