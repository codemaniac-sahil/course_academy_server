const mongoose = require("mongoose");

const lectureSchema = mongoose.Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    publicAccess: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const videoModel = mongoose.model("Video", lectureSchema);
module.exports = videoModel;
