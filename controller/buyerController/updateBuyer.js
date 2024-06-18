const User = require("../../database/schema/buyerSchema");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const bcrypt = require("bcrypt");
const { BlobServiceClient } = require("@azure/storage-blob");

const updateBuyer = async (req, res) => {
  const token = req.cookies.token;

  const { name, email, password, username } = req.body;

  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING;
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerName = process.env.CONTAINER_NAME;
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const tokenId = jwt.verify(token, process.env.TOKEN_KEY);
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthenticated User" });
    }

    if (!(name || username || email || password || req.file)) {
      res.status(400).json({ message: "No field to update" });
    }
    const user = await User.findOne({ _id: tokenId.id });

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    if (email) user.emailId = email;
    if (username) user.username = username;
    if (name) user.buyerName = name;
    if (password) {
      const salt = 10;
      user.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      const options = {
        deleteSnapshots: "include",
      };
      const oldPic = `buyer/${user.profilePic.split("/")[5]}`;

      const blockBlobClient = await containerClient.getBlockBlobClient(oldPic);
      await blockBlobClient.delete(options);

      const blobName = `buyer/${Date.now()}-${req.file.originalname}`;

      const blockUploadBlobClient =
        containerClient.getBlockBlobClient(blobName);
      const data = req.file.buffer;
      await blockUploadBlobClient.upload(data, data.length);
      user.profilePic = blockUploadBlobClient.url;
    }
    await user.save();

    console.log(user);
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};
module.exports = updateBuyer;
