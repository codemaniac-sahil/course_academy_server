const User = require("../../database/schema/buyerSchema");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { BlobServiceClient } = require("@azure/storage-blob");
const { createSecretToken } = require("../../token/generateToken");
dotenv.config();

const signup = async (req, res) => {
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING;
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerName = process.env.CONTAINER_NAME;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const { email, password, username, name } = req.body;
  try {
    if (!(email, password, username, name)) {
      return res.status(400).json({ message: "Fill all the field" });
    }

    const oldUser = await User.findOne({ emailId: email });
    if (oldUser) {
      return res.status(409).json({ message: "Already existed" });
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const blobName = `buyer/${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const data = req.file.buffer;
    await blockBlobClient.upload(data, data.length);

    const newUser = new User({
      buyerName: name,
      username,
      emailId: email,
      password: hashedPassword,
      profilePic: blockBlobClient.url,
    });
    newUser.save();
    const token = createSecretToken(newUser._id);
    res.cookie("token", token, {
      domain: process.env.FRONTENT_DOMAIN,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    console.log("cookie set succesfully");
    return res
      .status(201)
      .json({ message: "User added successfully", newUser });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};
module.exports = signup;
