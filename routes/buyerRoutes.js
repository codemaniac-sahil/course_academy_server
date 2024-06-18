const express = require("express");
const showUserInfo = require("../controller/buyerController/showUserInfo");
const updateBuyer = require("../controller/buyerController/updateBuyer");
const upload = require("../azureStorage/imageUpload");

const router = express.Router();
router.get("/userprofile", showUserInfo);
router.put("/updatebuyer", upload.single("img"), updateBuyer);

module.exports = router;
