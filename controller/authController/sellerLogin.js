const Seller = require("../../database/schema/sellerSchema");

const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
const { createSecretToken } = require("../../token/generateToken");

dotenv.config();

const sellerLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!(email && password)) {
    console.log(email);
    return res.status(400).json({ message: "Please provide the input" });
  }
  const seller = await Seller.findOne({ emailId: email });
  if (!(seller && (await bcrypt.compare(password, seller.password)))) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = createSecretToken(seller._id);
  res.cookie("token", token, {
    domain: process.env.FRONTENT_DOMAIN,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.json({ token });
};
module.exports = sellerLogin;
