const Seller = require("../../database/schema/sellerSchema");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { BlobServiceClient } = require("@azure/storage-blob");
const { createSecretToken } = require("../../token/generateToken");
dotenv.config();

const sellerSignup = async (req, res) => {
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

    const oldSeller = await Seller.findOne({ emailId: email });
    if (oldSeller) {
      return res.status(409).json({ message: "Already existed" });
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const blobName = `seller/${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const data = req.file.buffer;
    await blockBlobClient.upload(data, data.length);

    const newSeller = new Seller({
      sellerName: name,
      username,
      emailId: email,
      password: hashedPassword,
      profilePic: blockBlobClient.url,
    });
    newSeller.save();
    const token = createSecretToken(newSeller._id);
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
      .json({ message: "User added successfully", newSeller });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
module.exports = sellerSignup;
