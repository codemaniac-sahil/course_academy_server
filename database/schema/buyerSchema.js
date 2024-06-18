const mongoose = require("mongoose");

const buyerSchema = mongoose.Schema(
  {
    buyerName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    coursesEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const buyerModel = mongoose.model("Buyer", buyerSchema);
module.exports = buyerModel;
