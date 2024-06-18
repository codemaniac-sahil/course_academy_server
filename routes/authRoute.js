const express = require("express");
const upload = require("../azureStorage/imageUpload");
const signup = require("../controller/authController/userSignup");
const userLogin = require("../controller/authController/userLogin");
const sellerSignup = require("../controller/authController/sellerSignup");
const sellerLogin = require("../controller/authController/sellerLogin");

const router = express.Router();

router.post("/user/signup", upload.single("img"), signup);
router.post("/user/login", userLogin);
router.post("/seller/signup", upload.single("img"), sellerSignup);
router.post("/seller/login", sellerLogin);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});
module.exports = router;
