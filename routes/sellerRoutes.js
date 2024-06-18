const express = require("express");
const updateProfileLinks = require("../controller/sellerController/updateProfile");
const addCourse = require("../controller/sellerController/addCourse");

const router = express.Router();

router.put("/updateprofile", updateProfileLinks);
router.post("/addcourse", addCourse);

module.exports = router;
