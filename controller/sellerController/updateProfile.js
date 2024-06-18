const User = require("../../database/schema/sellerSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config;

const updateProfileLinks = async (req, res) => {
  const profileLinks = {
    profileName: req.body.profilename,
    links: req.body.links,
  };
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json("User is not authenticated");
    }
    const userId = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findOne({ _id: userId.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profileLinks.push(profileLinks);
    await user.save();
    return res.status(201).json({ message: "Profile link added", user });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = updateProfileLinks;
