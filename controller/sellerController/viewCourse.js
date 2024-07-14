const Course = require("../../database/schema/courseSchema");

const viewCourse = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const courseId = req.params.courseid;

    const course = await Course.find({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(201).json(course);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = viewCourse;
