const Seller = require("../../database/schema/sellerSchema");
const Course = require("../../database/schema/courseSchema");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const addCourse = async (req, res) => {
  const token = req.cookies.token;

  const sellerId = jwt.verify(token, process.env.TOKEN_KEY);

  console.log(sellerId);
  const seller = await Seller.findOne({ _id: sellerId.id });

  console.log(seller);
};

module.exports = addCourse;
