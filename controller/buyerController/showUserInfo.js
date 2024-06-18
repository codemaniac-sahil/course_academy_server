const User = require("../../database/schema/buyerSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const showUserInfo = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(301).json({ message: "User is not authenticated" });
    }
    const data = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findOne({ _id: data.id }, { password: 0 });

    return res.status(201).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};
module.exports = showUserInfo;
