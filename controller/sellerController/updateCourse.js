const Course = require("../../database/schema/courseSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken")

const { BlobServiceClient } = require("@azure/storage-blob");

const updateCourse = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User is not unauthorized" });
    }

    const course = await Course.find({ _id: req.params.id })

    const { coursename, category, shortdesc, aboutcourse, price } = req.body
    if (!(coursename || category || shortdesc || aboutcourse || price || req.file)) {
      return res.status(400).json({ message: "Fill all the field" });
    }
    const AZURE_STORAGE_CONNECTION_STRING =
      process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = process.env.CONTAINER_NAME;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    if (coursename) course.coursename = coursename
    if (category) course.category = category
    if (shortdesc) course.shortdesc = shortdesc
    if (aboutcourse) course.aboutcourse = aboutcourse
    if (price) course.price = price
    if (req.file) {
      const options = {
        deleteSnapshots: "include",
      };
      const oldPic = `seller/${course.thumbnail.split("/")[5]}`;

      const blockBlobClient = await containerClient.getBlockBlobClient(oldPic);
      await blockBlobClient.delete(options);
      const blobName = `seller/${Date.now()}-${req.file.originalname}`;

      const blockUploadBlobClient =
        containerClient.getBlockBlobClient(blobName);
      const data = req.file.buffer;
      await blockUploadBlobClient.upload(data, data.length);
      course.thumbnail = blockUploadBlobClient.url;
    }
    await course.save();

    return res.status(200).json({ message: "Course updated successfully" })
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" })
  }
};
module.exports = updateCourse