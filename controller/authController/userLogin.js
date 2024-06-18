const User = require("../../database/schema/buyerSchema");

const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
const { createSecretToken } = require("../../token/generateToken");

dotenv.config();

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(401).json({ message: "Please provide the input" });
  }
  const user = await User.findOne({ emailId: email });
  if (!(user && (await bcrypt.compare(password, user.password)))) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = createSecretToken(user._id);
  res.cookie("token", token, {
    domain: process.env.FRONTENT_DOMAIN,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.json({ token });
};
module.exports = userLogin;
