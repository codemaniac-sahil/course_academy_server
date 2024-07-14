const Seller = require("../../database/schema/sellerSchema");
const Course = require("../../database/schema/courseSchema");
const { BlobServiceClient } = require("@azure/storage-blob");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const addCourse = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const sellerId = jwt.verify(token, process.env.TOKEN_KEY);

    const seller = await Seller.findOne({ _id: sellerId.id });

    if (!seller) {
      return res.status(404).json({ message: "User not found" });
    }

    const { coursename, category, shortdesc, aboutcourse, price } = req.body;

    if (!(coursename, category, shortdesc, aboutcourse, price)) {
      return res.status(400).json({ message: "Fill all the field" });
    }
    const AZURE_STORAGE_CONNECTION_STRING =
      process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = process.env.CONTAINER_NAME;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `seller/${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const data = req.file.buffer;
    await blockBlobClient.upload(data, data.length);

    const course = new Course({
      courseName: coursename,
      category,
      shortDescription: shortdesc,
      aboutCourse: aboutcourse,
      price,
      thumbnail: blockBlobClient.url,
    });
    await course.save();
    await seller.courses.push(course._id);
    seller.save();

    res.status(201).json({ seller, course });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = addCourse;
