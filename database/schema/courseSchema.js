const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    aboutCourse: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyer",
      },
    ],
    ratings: [
      {
        buyerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Buyer",
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
    testimonials: [
      {
        buyerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Buyer",
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    lectures: [
      {
        letureId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lecture",
        },
      },
    ],
  },
  { timestamps: true }
);

const courseModel = mongoose.model("Course", courseSchema);
module.exports = courseModel;
