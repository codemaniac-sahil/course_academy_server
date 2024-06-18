const mongoose = require("mongoose");

const sellerSchema = mongoose.Schema(
  {
    sellerName: {
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
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],

    profileLinks: [
      {
        profileName: {
          type: String,
        },
        links: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const sellerModel = mongoose.model("Seller", sellerSchema);
module.exports = sellerModel;
